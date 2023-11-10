const { validationResult } = require("express-validator")
const User=require("../models/User")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const jwtsecret="keerthana"
const createuser=async(req,res)=>
    {   console.log(req.body)
        const errors=validationResult(req)
        console.log(errors)
        if(!errors.isEmpty())
        {   console.log("errrr")
            return res.status(400).json({errors:errors.array()})
        }

        const salt=await bcrypt.genSalt(10)
        let secpassword=await bcrypt.hash(req.body.password,salt)
    try{
        await User.create({
            name:req.body.name,
            password:secpassword,
            email:req.body.email,
            location:req.body.location
        })
        res.json({success:true})
    }
    catch(err)
    {
        console.log(err)
        res.json({success:false})
    }
    
}

const login=async(req,res)=>
    {   
        const errors=validationResult(req)
        console.log(errors)
        if(!errors.isEmpty())
        {   console.log("errrr")
            return res.status(400).json({errors:errors.array()})
        }
    let email=req.body.email
    try{
        let userData=await User.findOne({email})
        if(!userData)
        {
            return res.status(400).json({errors:"Try logging with correct credentials"})
        }
        const pwdCompare=await bcrypt.compare(req.body.password,userData.password)
        if(!pwdCompare)
        {
            return res.status(400).json({errors:"Try logging with correct credentials"})
        }
        const data={
            user:{
                id:userData.id
            }
        }
        const authtoken=jwt.sign(data,jwtsecret)
        return res.json({success:true,authtoken:authtoken})
    }
    catch(err)
    {
        console.log(err)
        res.json({success:false})
    }
    
}
module.exports.createuser=createuser
module.exports.login=login