const userModel = require('../models/user.model.js');
// const crypto = require('crypto'); /// basic level security
// for advance level use bcryptjs
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerController (req,res) {
    const{username,email,password,bio,profilePicture} = req.body

    // const isUserExistsByEmail = await userMoodel.findOne({email})
    
    // if(isUserExistsByEmail){
    //     return res.status(409).json({
    //         message:"User already exists with this email"
    //     })
    // }
    
    // const isUserExistsByUsername = await userMoodel.findOne({username})
    // if(isUserExistsByUsername){
    //     return res.status(409).json({
    //         message:"User already exists with this username"
    //     })
    // }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isUserAlreadyExists){
        return res.status(409)
        .json({
            message:"User already exists with this email or username" + 
            (isUserAlreadyExists.email == email ? "Email already exists" : "Username already exists")
        })
    }

    // const hash = crypto.createHash('sha256').update(password).digest('hex')

    const hash = await bcrypt.hash(password, 10) // 10 means kitni layers of hashing krni h vo batata h

    const user = await userModel.create({
        username,
        email,
        bio,
        profilePicture,
        password:hash
    })

    const token = jwt.sign(
        {
        id:user._id, 
        },
        process.env.JWT_SECRET,
        { expiresIn:'1d' }
    )

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            email:user.email,
            username:user.username,
            bio:user.bio,
            profilePicture:user.profilePicture
        }
    })




}


 async function loginController (req,res) {
    const {username ,email, password} = req.body

    const user = await userModel.findOne({
        $or:[
            {
                username:username
            },
            {
                email:email
            }
        ]
    })


if(!user){
    return res.status(404).json({
        message:"User not found"
    })
}

    // const hash = crypto.createHash('sha256').update(password).digest('hex')

    // const isPasswordValid = hash === user.password
    const isPasswordValid =  await bcrypt.compare(password, user.password) // ye function password ko hash krke user.password se compare krta h

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    )

    res.cookie("token",token)

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profilePicture:user.profilePicture 
        }
    })
}

module.exports = {
    registerController,
    loginController
}