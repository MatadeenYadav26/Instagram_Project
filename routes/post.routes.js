const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller.js')
const multer = require('multer') 
const upload = multer({storage:multer.memoryStorage()}) // ye memoryStorage ka use krke file ko memory me store krta h



// Post /api/posts [protected]
// req.body = { caption,image-file}

// /api/posts/
postRouter.post("/",upload.single("image"),postController.createPostController)


// GET /api/posts [protected]

postRouter.get("/",postController.getPostController)

// GET /api/posts/details/:postId [protected]
// return details of a post with given postId . alsocheck weater the post belongs to the user that is requesting.

postRouter.get("/details/:postId",postController.getPostDetailsController)

module.exports = postRouter
