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
 
//API PART

//cRud
app.get('/api/metrics/:id', (req: any, res: any) => {
    dbMet.get(req.params.id, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    })
  })

//Post (body has to be an array of metrics, like 
// [
//   {"timestamp":"11154454548", "value": 10},
//   {"timestamp":"111544545483, "value": 10}
// ]

app.post('/api/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})

  //Delete all
  app.delete('/api/metrics/:id', (req: any, res: any) => {
    // console.log('req.body',req.body);
    // let metric = new Metric(req.body.timestamp, req.body.value);
    // var met: Metric[] = []
    // met.push(metric)
    dbMet.delete(req.params.id, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    })
  })
app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is running on http://localhost:${port}`)
})
