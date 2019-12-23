import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import { ok } from 'assert'
import './request.ts'

const app = express()
const port: string = process.env.PORT || '8080'

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
 

//Sessions
/*
import session = require('express-session')
import levelSession = require('level-session-store')

const LevelStore = levelSession(session)

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
*/


//FRONT END PART 
app.get('/', (req, res)=> {
  res.render ('index.ejs')
})

app.get('/signin', (req,res)=> {
  res.render('signin.ejs')
})

app.get('/signup', (req,res)=>{
  res.render('signup.ejs')
})

app.get('/modification', (req, res)=>{
  res.render('modification.ejs')
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
   if (dbMet.API_authenticate(req))
    {
    dbMet.delete(req.params.id, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    })
  }
  })
app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is running on http://localhost:${port}`)
})