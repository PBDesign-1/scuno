const { Router } = require('express');
const bcrypt = require('bcrypt');
const { connection } = require('../db/connection');
const { ObjectId } = require('mongodb');
const router = Router()


router.get("/me", async (req, res)=>{
    try{
        if(!!req.session.user){
            let me = await connection.db.db("scuno").collection("users").findOne({_id: ObjectId(req.session.user)})
            delete me.password
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
            
            let {changes} = req.body

            if(changes._id){
                delete changes._id
            }
            if(changes.password){
                changes.password = await bcrypt.hash(changes.password, 10)
            }
            
            const changeMe = await connection.db.db("scuno").collection("users").updateOne({_id: ObjectId(req.session.user)}, {$set: changes})
            res.json({success: true})
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

router.get("/getYear/:years", async (req, res)=>{
    try{
        if(!!req.session.user){
            const years = req.params.years.split("-").map(y=>parseFloat(y))
            const thisYear = await connection.db.db("scuno").collection("years").findOne({user: ObjectId(req.session.user), years: years})
            const allYearsRawRaw = await connection.db.db("scuno").collection("years").find({user: ObjectId(req.session.user)})
            const allYearsRaw = await allYearsRawRaw.toArray()
            const allYears = allYearsRaw.map(y=>y.years)

            res.json({success: true, response: thisYear, years: allYears})
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
            let { newSubject, classtests, tests, oralGrades, years } = req.body
            years = years.split("-").map(y=>parseFloat(y)).sort((a,b)=>a - b)
            
            const subjectCheck = await connection.db.db("scuno").collection("years").findOne({user: ObjectId(req.session.user), years})

            if(!!subjectCheck.subjects[newSubject]){
                res.json({success: false, exists: true})
            }else {
                
                tests = parseFloat(tests)
                classtests = parseFloat(classtests)
                oralGrades = parseFloat(oralGrades)
    
                const pushNewSubject = await connection.db.db("scuno").collection("years").updateOne({user: ObjectId(req.session.user), years}, {$set: {[`subjects.${newSubject}`]: {percentages: { tests, classtests, oralGrades }, tests: [], classtests: [], oralGrades: [] }}})
                res.json({success: true, exists: false})                
            }

        }else{
            res.json({success: false, exists: false})
        }
    }catch(err){
        console.log(err)
        res.json({success: false, exists: false, err})
    }
})

router.post("/deleteSubject", async (req, res)=>{
    try{
        if(!!req.session.user){
            let { years, subject } = req.body
            years = years.split("-").map(y=>parseFloat(y)).sort((a,b)=>a - b)

            const yearDoc = await connection.db.db("scuno").collection("years").findOne({user: ObjectId(req.session.user), years})

            let subjects = yearDoc.subjects
            delete subjects[subject]



            const uploadYearDoc = await connection.db.db("scuno").collection("years").updateOne({user: ObjectId(req.session.user), years}, {$set: {subjects}})

            res.json({success: true})

        }else{
            res.json({success: false, exists: false})
        }
    }catch(err){
        console.log(err)
        res.json({success: false, exists: false, err})
    }
})



router.post("/grade", async (req, res)=>{
    try{
        if(!!req.session.user){
            let { type, grade, subject, years } = req.body
            years = years.split("-").map(y=>parseFloat(y)).sort((a,b)=>a - b)
            
            if(type === "Mündlich" || type === "mündlich" || type === "mündl." ){
                type = "oralGrades"
            }else if(type === "Klassenarbeit" || type === "klassenarbeit"){
                type = "classtests"
            }else if (type === "Test" || type === "test"){
                type = "tests"
            }

            const pushNewGrade = await connection.db.db("scuno").collection("years").updateOne({user: ObjectId(req.session.user), years}, {$push: {subjects :{subject: {type: parseFloat(grade) }}}})

            res.json({success: true})
        }else{
            res.json({success: false})
        }
    }catch(err){
        console.log(err)
        res.json({success: false, err})
    }
})
router.post("/deleteGrade", async (req, res)=>{
    try{
        if(!!req.session.user){
            let { type, index, subject, years } = req.body
            years = years.split("-").map(y=>parseFloat(y)).sort((a,b)=>a - b)
            
            if(type === "Mündlich" || type === "mündlich" || type === "mündl." ){
                type = "oralGrades"
            }else if(type === "Klassenarbeit" || type === "klassenarbeit"){
                type = "classtests"
            }else if (type === "Test" || type === "test"){
                type = "tests"
            }

            const gradeDoc = await connection.db.db("scuno").collection("years").findOne({user: ObjectId(req.session.user), years})

            let grades = gradeDoc.subjects[subject][type].filter((g, i)=>i !== index)

            const updateGrades = await connection.db.db("scuno").collection("years").updateOne({user: ObjectId(req.session.user), years}, {$set: {[`subjects.${subject}.${type}`]: grades }})

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