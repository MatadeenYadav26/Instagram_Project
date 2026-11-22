const postModel = require('../models/post.model.js')
const ImageKit = require('@imagekit/nodejs')
const {toFile } = require('@imagekit/nodejs')
const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,

})



async function createPostController(req,res){

    console.log(req.body,req.file)

    const file = await imagekit.files.upload({ 
        file: await toFile(Buffer.from(req.file.buffer),"file"), // ye buffer me file ko store krta h
        fileName: "Test"
    })

    res.send(file)

}

module.exports = {
    createPostController
}