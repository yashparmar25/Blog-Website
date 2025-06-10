const express=require('express')
const router=express.Router();
const {verifyToken}=require('../utils/verifyUser')

const{create}=require('../controllers/post.controller')
const{getposts}=require('../controllers/post.controller')
const{deletepost}=require('../controllers/post.controller')
const{updatepost}=require('../controllers/post.controller')
router.post('/create',verifyToken,create)
router.get('/getposts',getposts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletepost)
router.put('/updatepost/:postId/:userId',verifyToken,updatepost)

module.exports=router;