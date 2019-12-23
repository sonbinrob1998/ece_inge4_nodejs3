import { Metric, MetricsHandler } from '../src/metrics'
import fs = require('fs')

const dir: string = './db'
if (!fs.existsSync(dir))
  fs.mkdirSync(dir)
const db: MetricsHandler = new MetricsHandler( dir + '/metrics')

const met: Metric[] = [
  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),
  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),
  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)
]
const met2: Metric[] = [
    new Metric(`${new Date('2024-07-04 10:00 UTC').getTime()}`, 12),
    new Metric(`${new Date('2025-17-06 11:15 UTC').getTime()}`, 10),
    new Metric(`${new Date('2026-11-02 18:34 UTC').getTime()}`, 8)
  ]

db.save('User0', met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated. key : User0')
})
db.save('User1', met2, (err: Error | null) =>{
    if (err) throw err
    console.log('Data populated. key : User1')
})
