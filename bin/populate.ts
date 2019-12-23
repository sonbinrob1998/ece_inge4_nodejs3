import { Metric, MetricsHandler } from '../src/metrics'
import {User, UserHandler} from '../src/users'
import fs = require('fs')

const dir: string = './db'
if (!fs.existsSync(dir))
  fs.mkdirSync(dir)
const db: MetricsHandler = new MetricsHandler( dir + '/metrics')
const dbUser: UserHandler = new UserHandler(dir + '/users')
const met: Metric[] = [
  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),
  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),
  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)
]
const met1: Metric[] = [
    new Metric(`${new Date('2024-07-04 10:00 UTC').getTime()}`, 12),
    new Metric(`${new Date('2025-11-06 11:15 UTC').getTime()}`, 10),
    new Metric(`${new Date('2026-11-02 18:34 UTC').getTime()}`, 8)
  ]
 let usr = new User("User0", "0@gmail.com", "paroli")
  dbUser.save(usr, (err)=>
  {
    if (err) throw err
    else console.log("User added. id: User0, password : paroli")
  })

  let usr2 = new User("User1", "xaxax@gmail.com", "paroli123")
  dbUser.save(usr, (err)=>
  {
    if (err) throw err
    else console.log("User added. id: User1, password : paroli123")
  })
 
db.save('User0', met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated. key : User0')
})
db.save('User1', met1, (err: Error | null) =>{
    if (err) throw err
    console.log('Data populated. key : User1')
})
