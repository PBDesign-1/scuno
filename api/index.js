const express = require('express')
const path = require('path');
const app = express();
require('dotenv').config();
const session = require("express-session");
const MongoStore = require('connect-mongo'); 
const { ObjectId } = require('mongodb');

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
const { connection } = require("../db/connection")
app.use(session({
    secret: "asdfg",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        clientPromise: connection.open(),
        dbName: "session"
    }),
    cookie: {
        secure: false
    }

}))



const authenticationRoutes = require("../routes/authenticationRoutes");
app.use("/authentication", authenticationRoutes)

const generalRoutes = require("../routes/generalRoutes");
const res = require('express/lib/response');
app.use("/general", generalRoutes)




// Visitors
app.get("/", (req, res)=>{
    if(req.session.user){
        res.redirect("/dashboard")
    }else {
        res.sendFile(path.join(__dirname, "public/screens/visitors/home/home.html"))
    }
})

app.get("/anmelden", (req, res)=>{
    if(req.session.user){
        res.redirect("/dashboard")
    }else {
        res.sendFile(path.join(__dirname, "public/screens/visitors/login/login.html"))
    }
})
app.get("/registrieren", (req, res)=>{
    if(req.session.user){
        res.redirect("/dashboard")
    }else {
        res.sendFile(path.join(__dirname, "public/screens/visitors/register/register.html"))
    }
})






//Visitors and Members
app.get("/rechner", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/members/calculator/calculator.html"))
    }else {
        res.sendFile(path.join(__dirname, "public/screens/visitors/calculator/calculator.html"))
    }
})
app.get("/impressum", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/rechtliches/impressum/impressumMembers.html"))
    }else {
        res.sendFile(path.join(__dirname, "public/screens/rechtliches/impressum/impressum.html"))
    }
})
app.get("/datenschutzerklearung", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/rechtliches/datenschutzerklärung/datenschutzerklärungMembers.html"))
    }else {
        res.sendFile(path.join(__dirname, "public/screens/rechtliches/datenschutzerklärung/datenschutzerklärung.html"))
    }
})






//Members only
app.get("/dashboard", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/members/dashboard/dashboard.html"))
    }else {
        res.redirect("/anmelden")
    }
})
app.get("/fach", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/members/subject/subject.html"))
    }else {
        res.redirect("/anmelden")
    }
})
app.get("/einstellungen", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/members/settings/settings.html"))
    }else {
        res.redirect("/anmelden")
    }
})







app.get("*", (req, res)=>{
    if(!!req.session.user){
        res.redirect("/dashboard")
    }else {
        res.redirect("/")
    }
})


app.listen(PORT, ()=>{
    console.log('server starts at port ' + PORT)
})
Footer
© 2023 GitHub, Inc.
Footer navigation
Terms
Privacy
