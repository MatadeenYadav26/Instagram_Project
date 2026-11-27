const postModel = require('../models/post.model.js')
const ImageKit = require('@imagekit/nodejs')
const {toFile } = require('@imagekit/nodejs')
const jwt = require('jsonwebtoken')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,

})



async function createPostController(req,res){

    console.log(req.body,req.file)

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Token not provided : Unauthorized Access"
        })
    }

    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message:"Invalid token : Unauthorized Access"
        })
    }
    
    console.log(decoded)

    const file = await imagekit.files.upload({ 
        file: await toFile(Buffer.from(req.file.buffer),"file"), // ye buffer me file ko store krta h
        fileName: "Test",
        folder:"Instagram_clone_Posts"
    })

    // res.send(file)

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:decoded.id
    })

    res.status(201).json({
        message:"Post created successfully"
    })
}


async function getPostController(req,res){
    const token = req.cookies.token

    let decoded;

    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    }
    catch(err){
            return res.status(401).json({
                message:"Token Invalid"
            })
    }

    const userId = decoded.id


    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message:"Posts fetched successfully!",
        posts
    })
}

async function getPostDetailsController(req,res){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Token not provided : Unauthorized Access"
        })
    }

    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token : Unauthorized Access"
        })
    }

    const userId = decoded.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }


    const isValiduser = post.user.toString() === userId

    if(!isValiduser){
        return res.status(403).json({
            message:"Forbidden : You are not allowed to access this post"
        })
    }

    return res.status(200).json({
        message:"Post details fetched successfully",
        post
    })
}



module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
}