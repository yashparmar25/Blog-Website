const User=require('../models/user.model')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken');
exports.signup=async(req,res,next)=>{
    const{username,email,password}=req.body;

    if(!username || !email || !password || username==='' || email==='' || password==='')
        {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        const hashedPassword = bcryptjs.hashSync(password,10);

        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        })

        try{
            await newUser.save();//db interaction for creating entry in db
            res.json('Sign Up successful')
        }
        catch(error)
        {
         next(error)
        }
}

exports.signin=async(req,res,next)=>{

    const {email,password}=req.body;

    if(!email || !password || email==='' || password==='')
    {
       return res.status(400).json({
            success:false,
            message:'All fields are required'
        })
    }

    try{
        const validUser = await User.findOne({email});
        if(!validUser)
        {
          return res.status(404).json(
            {
               success:false,
               message:'User not Found', 
            }
          )
        }

        const validPassword= bcryptjs.compareSync(password,validUser.password);

        if(!validPassword)
        {
            return res.status(404).json(
                {
                   success:false,
                   message:'Invalid Password', 
                }
              )
        }

        //if there is validUser and ValidPassword then generate the token which gives the authentication to the user
        const token = jwt.sign({ id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
           
           const{password: pass, ...rest}=validUser._doc;
  
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).json(rest);
    }
    catch(error)
    {
    next(error)
    }
}

exports.google=async(req,res,next)=>{

  const{email,name,googlePhotoUrl}=req.body;
  try{
    const user=await User.findOne({email});
    if(user)
        {
        const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
        const{password,...rest}=user._doc;
        res.status(200).cookie('access_token',token,{
            httpOnly:true,
        }).json(rest);
        }

        else{
            const generatedPassword=Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({
            username: name.toLowerCase().split('').join('') + Math.random().toString(9).slice(-4),
            email,
            password:hashedPassword,
            profilePicture:googlePhotoUrl,
            })
            await newUser.save();

            const token=jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
            const{password,...rest}=newUser._doc;
            res.status(200).cookie('access_token',token,{
            httpOnly:true,
            }).json(rest);
        }
  }
  catch(error)
  {
   next(error)
  }
}

