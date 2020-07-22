const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths fpr Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and view location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=> {
    res.render('index', {
        title: 'Weather',
        name: 'Ajay'
    })
})

app.get('/about',(req,res)=> {
    res.render('about', {
        title: 'About me',
        name: 'Ajay'
    })
})

app.get('/help',(req,res)=> {
    res.render('help', {
        title : 'Help',
        name: 'Ajay',
        helpText: "This is some helpful text"
    })
})

app.get('/weather', (req,res)=>{

    if(!req.query.address){
        return res.send({
            error: 'Please provide address'
        })
    }

    geocode(req.query.address,(error,{latitude,longitude,location} = {}) => {

        if(error){
            return res.send({error})    
        }
        forecast(latitude , longitude, (error, data) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: data,
                location: location,
                address: req.query.address 
            })
        })
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Ajay',
        errorMessage: 'Help Article Not found.'
    })
})


app.get('*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Ajay',
        errorMessage: 'Page Not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port', port);
})