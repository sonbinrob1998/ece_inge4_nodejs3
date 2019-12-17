const express = require( 'express')
const app= express() 

app.set(' view-engine', 'ejs')

app.get('/', (req, res)=> {
    res.render ('index.ejs')
})

app.get('/signin', (req,res)=> {
    res.render('signin.ejs')
})

app.get('/signup', (req,res)=>{
    res.render('signup.ejs')
})

app.post('/signup', (req, res)=>{

})

app.post('/signin', (req, res)=>{

})

app.listen(8080)