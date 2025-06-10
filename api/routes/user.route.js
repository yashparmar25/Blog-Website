const express=require('express')
const router=express.Router();

const{updateUser,deleteUser,signout,getusers,getUser}=require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyUser');

router.put('/update/:userId',verifyToken,updateUser)
router.delete('/delete/:userId',verifyToken,deleteUser)
router.post('/signout',signout)
router.get('/getusers',verifyToken,getusers)
router.get('/:userId',getUser)
module.exports=router;