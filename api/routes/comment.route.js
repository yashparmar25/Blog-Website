const express = require('express')
const router = express.Router();

const {verifyToken}=require('../utils/verifyUser')
const {createComment,getPostComments,likeComment}=require('../controllers/comment.controller')

router.post('/create',verifyToken,createComment)
router.get('/getPostComments/:postId',getPostComments)
router.put('/likeComment/:commentId',verifyToken,likeComment)

module.exports=router;