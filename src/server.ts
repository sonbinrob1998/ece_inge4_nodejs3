import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import { ok } from 'assert'
import './request.ts'
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
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
 

//Sessions




app.get('/', (req, res)=> {
  res.render ('index.ejs')
})
import { UserHandler, User } from './users'
import { cpus } from 'os'
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/modification', (req: any, res: any) =>
{
  res.render('modification', {ses : req.session.name})
})
authRouter.get('/logout', (req: any, res: any) => {
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
    if (!err || result !== undefined) {
     res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
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
app.use('/modification', userRouter)

const authCheck = function (req: any, res: any, next: any) {
  console.log("session : ", req.session)
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')

}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})



//API PART

app.get('/api/all', (req: any, res: any) => {
  dbMet.see_all((err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})
//cRud
app.get('/api/metrics/:id/:pwd', (req: any, res: any) => {
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
    res.status(200).send()
  })
})

app.post('/user/', (req: any, res: any) => {

  dbMet.saveUser(req.body, (err: Error | null) => {
    if (err) throw err
    res.redirect('/signin?redirect=True')
    res.status(200).send(ok)

  })
})


  //Delete one
  app.delete('/api/metrics/:id', (req: any, res: any) => {
    // console.log('req.body',req.body);
    // let metric = new Metric(req.body.timestamp, req.body.value);
    // var met: Metric[] = []
    // met.push(metric)
  })
app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is running on http://localhost:${port}`)
})
