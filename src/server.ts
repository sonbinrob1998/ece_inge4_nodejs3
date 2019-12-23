import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import { ok } from 'assert'
import { UserHandler, User } from './users'
import { cpus } from 'os'
import session = require('express-session')
import levelSession = require('level-session-store')
var cookieParser = require('cookie-parser')


const app = express()
const port: string = process.env.PORT || '8080'

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(cookieParser())

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');
const LevelStore = levelSession(session)

app.use(session({
  secret: 'my very VERY secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')

//Sessions

app.get('/', (req, res)=> {
  res.render ('index.ejs')
})

const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})


const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

authRouter.get('/modification', authCheck, (req: any, res: any) =>
{
  dbMet.get(req.session.user.username, (err: Error | null, result?:Metric[])=>
  {  
    var arr: any[] = [ ["Timestamp", "Value"] ]
    if (result!.length != 0)
    {
     
      result!.forEach(element => {
        arr.push([element.timestamp, element.value])
      });
    }
  
    console.log("rendering metrics for :", req.session.user.username)
    console.log( "metrics : ", result)
    console.log(arr)
    res.render('modification', {name: req.session.user.username, result : result, arr: arr})
   })
})
authRouter.get('/logout', authCheck, (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})
authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})
app.use(authRouter)

const userRouter = express.Router()

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    console.log("DATA USER =  : ", err, req.body)

    if (!err || result !== undefined ) {
     res.status(409).send("Username already taken. Come back to previous page.")
    } else {
      console.log("trying to save username with details :", req.body)
      let user = new User(req.body.username, req.body.email, req.body.password)
      dbUser.save(user, function (err: Error | null) {
        if (err) next(err)
        else res.redirect("/")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})

app.use('/user', userRouter)



app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})



//API PART
app.get('/api/allUsers', (req: any, res: any) => {
  dbUser.see_all((err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})
app.get('/api/all', (req: any, res: any) => {
  dbMet.see_all((err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})
//cRud
app.get('/api/metrics/:id/', (req: any, res: any) => {
    dbMet.get(req.params, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    })
  })

//Post (body has to be an array of metrics, like 
// [
//   {"timestamp":"11154454548", "value": 10},
//   {"timestamp":"11154454549, "value": 15}
// ]
app.post('/api/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err

    res.redirect('/modification')
  
  })
})

  //delete one user
  //use id = "4ll" to erase everything (dev)
  app.delete('/api/delete/user/:id', (req: any, res: any) => {
    dbUser.delete(req.params.id, (err)=>
    {
      if (err)
      {
        console.log(err)
      }
      res.status(200).send()
      })
  })

  app.delete('/api/delete/metrics/:id', (req: any, res: any) => {
    dbMet.delete(req.params.id, (err)=>{
      if (err)
      {
        console.log(err)
      }
      res.status(200).send()
  })
  })

  app.delete('/api/delete/metrics/:id/:timestamp', (req: any, res: any) => {
    dbMet.deleteOne(req.params, (err)=>{
      if (err)
      {
        console.log(err)
      }
      res.status(200).send()
  })
  })
app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is running on http://localhost:${port}`)
})
