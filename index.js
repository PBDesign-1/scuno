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
const { connection } = require("./db/connection")
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



const authenticationRoutes = require("./routes/authenticationRoutes");
app.use("/authentication", authenticationRoutes)

const generalRoutes = require("./routes/generalRoutes");
app.use("/general", generalRoutes)




// Visitors
app.get("/", (req, res)=>{
    if(req.session.user){
        res.redirect("/dashboard")
    }else {
        res.sendFile(path.join(__dirname, "/screens/visitors/login/login.html"))
    }
})







//Visitors and Members
app.get("/rechner", (req, res)=>{
    if(req.session.user){
        res.redirect("/dashboard")
    }else {
        res.sendFile(path.join(__dirname, "/screens/visitors/login/login.html"))
    }
})




//Members only
app.get("/dashboard", (req, res)=>{
    if(req.session.user){
        res.sendFile(path.join(__dirname, "/screens/members/dashboard/dashboard.html"))
    }else {
        res.redirect("/login")
    }
})
app.get("/einstellungen", (req, res)=>{
    // if(req.session.user){
        res.sendFile(path.join(__dirname, "public/screens/members/settings/settings.html"))
    // }else {
        // res.redirect("/login")
    // }
})










app.listen(PORT, ()=>{
    console.log('server starts at port ' + PORT)
})