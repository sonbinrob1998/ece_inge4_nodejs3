import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"


const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
    
  })

  after(function () {
    dbMet.db.close()
  })

//   describe ('saveUser', function() {
//     it('should save data or uptate data', function (done) {
//         dbMet.saveUser("user0,robi@gmail.com,password", function(error: Error | null, result?: any)
//         {
            
//             // expect(result).to.not.be.undefined
//             // expect(result).to.not.be.null
//             // expect('Robi').to.be.a('string');
//             // expect('metric:User0:1572876000000').to.be.a('string');
//             // expect('ninja').to.be.a('string');
//             //expect(result).to.be.an('array')

//             // expect(result).to.have.a.property('key');
//             // expect(result).to.have.a.property('value');
//             // expect(result).to.have.a.property('password');
//             // expect(result).to.include({key: 'Robi'})



//         })
//     })
// })
  


describe('get', function () {
    it('should get empty array on non existing group', function () {
      dbMet.get("0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })


//[{"key":"metric:User0:1572876000000","value":12},{"key":"metric:User0:1572876900000","value":10},{"key":"metric:User0:1572877800000","value":8}]
// describe ('#save', function(){
//     it('should save data or uptate data', function (){
//         dbMet.saveUser("Robi", function(err:Error| null, result?: Metric[]){
//             expect(err).to.be.null
//             expect(result).to.not.be.empty
//         })
//     })
// })

// describe ('#see_all', function(){
//     it('should save data or uptate data', function (){
//         dbMet.saveUser("Robi", function(err:Error| null, result?: Metric[]){
//             expect(err).to.be.null
//             expect(result).to.not.be.empty
//         })
//     })
// })
// describe ('#API_authenticate', function(){
//     it('should save data or uptate data', function (){
//         dbMet.saveUser("Robi", function(err:Error| null, result?: Metric[]){
//             expect(err).to.be.null
//             expect(result).to.not.be.empty
//         })
//     })
// })

  
describe ('#delete', function(){
    it('should delete data', function (){
        dbMet.delete( 1, function(err:Error| null, result?: Metric[]){
            expect(err).to.be.null
            expect(result).to.be.an('array').that.does.not.include({"key": 1})
            
        })
    })
})

})