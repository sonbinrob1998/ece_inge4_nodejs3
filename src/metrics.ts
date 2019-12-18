import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'
import { NOTFOUND } from 'dns';
import { ok } from 'assert';

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  public db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
    public see_all ( callback: (error: Error | null, result?:any[]) => void)
    {
      const stream = this.db.createReadStream()
      var arr: any[]= [] 
      
      stream.on('error', callback)
        .on('data', (data: any) => {
 
            arr.push(data)
          
        })
        .on('end', (err: Error) => {
          callback(null, arr)
        })
    }

    public API_authenticate(req:any){
      const stream = WriteStream(this.db)
      stream.on('data', (data: any) => {
            const [_, username] = data.key.split(":")
            
    })
    return true
  }
    public save(key: string, metrics: Metric[], callback: (error: Error | null, result?:[]) => void) {
      const stream = WriteStream(this.db)
      stream.on('error', callback)
      stream.on('close', callback)
      metrics.forEach((m: Metric) => {
        stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
      })
      stream.end()
    } 
    
    public saveUser(params: any, callback: (error: Error | null, result?:any) => void)
    {
      console.log("Creating a new user with params ", params)
      
      const stream = WriteStream(this.db)
      stream.on('end', callback(null, {ok:ok})  )
      stream.write({key: `user:${params.name}`, value: {email : `${params.email}`, password: `${params.password}`}})
      stream.on('error', )
      stream.end()
  
  
    }
    public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
      //creates a read stream
      const stream = this.db.createReadStream()
      var met: Metric[] = [] 
      
      stream.on('error', callback)
        .on('data', (data: any) => {
          
      //for each data, we will fire this function
          const [_, k, timestamp] = data.key.split(":")
          const value = data.value
          if (key != k) {
            console.log(`Data ${k} does not match key ${key}`)
            met.push(new Metric(timestamp, value))
          } else {
            console.log(`Data ${k} match the key ${key}`)
            met.push(new Metric(timestamp, value))
          }
        })
        .on('end', (err: Error) => {
          callback(null, met)
        })
    }



  public delete(key: number, callback: (err: Error | null) => void) {

    const stream = this.db.createReadStream()
    stream.on('error', callback)
    .on('data', (data: any) => {
      
  //for each data, we will fire this function
      const [_, k, timestamp] = data.key.split(":")
      const value = data.value
      if (key != k) {
        console.log(`Data ${k} does not match key ${key} and won't be deleted`)
      } else {
        console.log(`Data ${k} match the key ${key} and will be deleted`)
      }
      this.db.del(data.key)
    })
    .on('end', (err: Error) => {
      callback(null )
    })
  }

}
