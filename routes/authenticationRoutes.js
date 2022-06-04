const { Router } = require('express');
const bcrypt = require('bcrypt');
const { connection } = require('../db/connection');
const router = Router()


router.post('/login', async (req, res)=> {
    const { password, email} = req.body
    console.log(req.body)
    try {
        const dbUser = await connection.db.db("scuno").collection("users").findOne({email})
        if(!dbUser ){
            return res.json({msg: "Ein Nutzer mit dieser Email existiert nicht"})
        }

        const comparePassword = await bcrypt.compare(password, dbUser.password)
        if(!comparePassword){
            return res.json({msg: "Das Passwort ist falsch"})
        }

        req.session.user = dbUser._id;
        req.session.email = dbUser.email;

        res.json({success: true})

    } catch (err){
        console.log(err)
        res.json({success: false, err})
    }
})

router.post('/register', async (req, res)=> {
    try {    
        let body = req.body
        
        console.log(body)

        if(!body.password || !body.name || !body.email){
            res.json({success: false})
        }else {
            body.password = await bcrypt.hash(body.password, 10);
    
            const checkEmail = await connection.db.db("scuno").collection("users").findOne({email: body.email})
            // const checkEmailData = await connection.db.db("user-management").collection("applications").findOne({email: body.email})
            

            if(!checkEmail){
                const newUser = await connection.db.db("scuno").collection("users").insertOne({...body})

                let years = (new Date(new Date().getFullYear(), 8, 2) - new Date()) > 0 ? [new Date().getFullYear() - 1, new Date().getFullYear()] : [new Date().getFullYear(), new Date().getFullYear() + 1]
                const insertFirstYear = await connection.db.db("scuno").collection("years").insertOne({years, subjects: {}, user: newUser.insertedId })
    
                res.json({success: true})
            }else {
                res.json({success: false, msg: "Account mit dieser Email existiert bereits."})
            }                
        }


        
        
    } catch (err){
        console.log(err)
        res.status(400).json({err})
    }
})


router.get('/logout', async (req, res)=> {
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.end()
    })
    
})








module.exports = router