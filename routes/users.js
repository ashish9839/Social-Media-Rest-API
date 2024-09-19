const router=require("express").Router();
const User=require("./models/User");
const bcrypt=require("bcrypt");

//update user
router.put('/:id',async (req,resp)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return resp.status(500).json(err);
            }
        }
        try{
            const updateUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
            if(!updateUser)
            {
                return resp.status(404).json("User not found");
            }
            resp.status(200).json("account has been updated");
        }catch(err){
            return resp.status(500).json(err);
        }
    }else{
        return resp.status(403).json("you can update only your account");
    }
});

//delete user
router.delete('/:id',async (req,resp)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
            const user = await User.findById(req.params.id);
            console.log(user,"ajsbjbcjrbcjebdcjbdxvhx")
            if(!user)
            {
                return resp.status(404).json("User not found");
            }
            await User.findByIdAndDelete(req.params.id);
            resp.status(200).json("account has been deleted");
        }catch(err){
            return resp.status(500).json(err);
        }
    }else{
        return resp.status(403).json("you can delete only your account");
    }
});

//find user
router.get('/:id',async (req,resp)=>{
    try{
        const user=await User.findById(req.params.id);
        const{password,updateAt, ...other}=user._doc;
        resp.status(200).json(other);
    }catch(err){
        resp.status(500).json(err);
    }
}
);

//follow user
router.put('/:id/follow',async (req,resp)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const curruser=await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await curruser.updateOne({$push:{following:req.params.id}});
                resp.status(200).json("user has been followed");
            }else{
                resp.status(403).json("you already follow this user");
             }
           }
            catch(err){
                resp.status(500).json(err);
            }
        } 
        
        else{
            resp.status(403).json("you cant folow yourself");
        }    
});

//unfollow user
router.put('/:id/unfollow',async (req,resp)=>{
    if(req.body.userId!=req.params.id){
        try{
            const user=await User.findById(req.params.id);
            const curruser=await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await curruser.updateOne({$pull:{following:req.params.id}});
                resp.status(200).json("user has been unfollowed");
            }else{
                resp.status(403).json("you dont follow this user");
             }
           }
            catch(err){
                resp.status(500).json(err);
            }
        } 
        
        else{
            resp.status(403).json("you cant unfollow yourself");
        }    
});
module.exports=router;