import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { randomBytes } from "crypto"

export class User {
    public username: string
    public email: string
    private password: string = ""
  
    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
      this.username = username
      this.email = email
  
      if (!passwordHashed) {
        this.setPassword(password)
      } else this.password = password
    }

    static fromDb(username: string, value: any): User {

        const [password, email] = value.split(":")
        return new User(username, email, password)
      }
    
      public setPassword(toSet: string): void {
        // Hash and set password
        this.password= this.myHash(toSet)
      }
    
      public getPassword(): string {
        return this.password
      }
      
      public myHash(str: String){
        //really stupid hashing function that just places ones between every letter.
        // myHash("paroli") = p1a1r1o1l1i1
        let arr: string = ""
        for (let i =0; i<str.length; i++)
        {
          arr += str[i]+1;
        }
        this.password= arr
        return(arr)
      }

      public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        if (this.myHash(toValidate) == this.getPassword())
        {
          return(true)
        }
        else{
          return(false)
        }
      }
    }
    

    export class UserHandler {
      public db: any

      public see_all(callback: (error: Error | null, result?: any[]) => void) {
        const stream = this.db.createReadStream()
        var arr: any[] = []
    
        stream.on('error', callback)
          .on('data', (data: any) => {
    
            arr.push(data)
    
          })
          .on('end', (err: Error) => {
            callback(null, arr)
          })
      }
      public get(username: string, callback: (err: Error | null, result?: User) => void) {

        this.db.get(`user:${username}`, function (err: Error, data: any) {
          if (err) callback(err)
          else if (data === undefined) callback(null, data)
          else
          {
          console.log("DATA ", data)
          callback(null, User.fromDb(username, data))
          }
        })
      }
    
      public save(user: User, callback: (err: Error | null) => void) {
        let pwd = user.getPassword();
        this.db.put(`user:${user.username}`, `${pwd}:${user.email}`, (err: Error | null) => {
          callback(err)
        })
      }
    
      public delete(username: string, callback: (err: Error | null) => void) {
        //use 
        const stream = this.db.createReadStream()
        stream.on('error', callback)
          .on('data', (data: any) => {
    
            //for each data, we will fire this function
            const [_, k] = data.key.split(":")
            const value = data.value
            if (username != k && username !=="4ll") {
              console.log(`Data ${k} does not match key ${username} and won't be deleted`)
            } else {
              console.log(`Data ${k} match the key ${username} and will be deleted`)
              this.db.del(data.key)
            }
          })
          .on('end', (err: Error) => {
            callback(null)
          })
      }
    
      constructor(path: string) {
        this.db = LevelDB.open(path)
      }
    }