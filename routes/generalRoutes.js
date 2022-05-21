const { Router } = require('express');
const bcrypt = require('bcrypt');
const { connection } = require('../db/connection');
const { ObjectId } = require('mongodb');
const router = Router()


router.get("/me", async (req, res)=>{
    try{
        if(!!req.session.user){
            const me = await connection.db.db("scuno").collection("users").findOne({_id: ObjectId(req.session.user)})
            res.json({success: true, response: me})
        }else{
            res.json({success: false})
        }
    }catch(err){
        res.json({success: false, err})
    }
})

router.post("/changeMe", async (req, res)=>{
    try{
        if(!!req.session.user){
            const {change} = req.body

            if(change._id){
                delete change._id
            }
            
            const chngeMe = await connection.db.db("scuno").collection("users").updateOne({_id: ObjectId(req.session.user)}, change)
            res.json({success: true, response: me})
        }else{
            res.json({success: false})
        }
    }catch(err){
        res.json({success: false, err})
    }
})








router.get("/myYears", async (req, res)=>{
    try{
        if(!!req.session.user){
            const myYearsRaw = await connection.db.db("scuno").collection("years").find({user: ObjectId(req.session.user)}).sort({year: -1})
            const myYears = await myYearsRaw.toArray()
        
            res.json({success: true, response: myYears})
        }else{
            res.json({success: false})
        }
    }catch(err){
        res.json({success: false})
    } 
})

router.get("/myCurrentYear", async (req, res)=>{
    try{
        if(!!req.session.user){
            const currentYear = new Date().getFullYear()
            const myCurrentYear = await connection.db.db("scuno").collection("years").findOne({user: ObjectId(req.session.user), year: currentYear})

            res.json({success: true, response: myCurrentYear})
        }else{
            res.json({success: false})
        }
    }catch(err){
        res.json({success: false})
    }
    
})









router.post("/subject", async (req, res)=>{
    try{
        if(!!req.session.user){
            const currentYear = new Date().getFullYear()
            const { newSubject, classtests, tests, oralGrades } = req.body
            const pushNewSubject = await connection.db.db("scuno").collection("years").updateOne({user: ObjectId(req.session.user), year: currentYear}, {$set: {subjects: {[newSubject]: {percentages: { tests, classtests, oralGrades }, tests: [], classtests: [], oralGrades: []}}}})

            res.json({success: true})
        }else{
            res.json({success: false})
        }
    }catch(err){
        res.json({success: false})
    }
})

router.post("/grade", async (req, res)=>{
    try{
        if(!!req.session.user){
            const currentYear = new Date().getFullYear()
            const { type, grade, subject } = req.body
            console.log(req.body)
            const pushNewGrade = await connection.db.db("scuno").collection("years").updateOne({user: ObjectId(req.session.user), year: currentYear}, {$push: {[`subjects.${subject}.${type}`]: grade }})

            res.json({success: true})
        }else{
            res.json({success: false})
        }
    }catch(err){
        console.log(err)
        res.json({success: false, err})
    }
})






module.exports = router