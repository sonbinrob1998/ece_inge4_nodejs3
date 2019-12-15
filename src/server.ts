import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')

const app = express()
const port: string = process.env.PORT || '8080'

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.get('/metrics/:id', (req: any, res: any) => {
    dbMet.get(req.params.id, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    })
  })
  
app.post('/metrics/:id', (req: any, res: any) => {
    // console.log('req.body',req.body);
    // let metric = new Metric(req.body.timestamp, req.body.value);
    // var met: Metric[] = []
    // met.push(metric)
    dbMet.save(req.params.id, req.body, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    })
  })
app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is running on http://localhost:${port}`)
})
