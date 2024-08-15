const subscriptionVerify=async (req,res,next)=>{
    let subCollection  = req.app.get('subCollection');
    //get bearer token
    try{
        let uname=req.params.s_uname;
        let usertype=req.params.type
        const subObj = await subCollection.findOne({$and:[{userType:usertype},{username:uname},{active_status:true}]})
        console.log(subObj)
        if(!subObj){
        return res.send({message:"Subscribe to Access"})

        }
        else{
            next();
        }
    }catch(err){
        next(err)
    }
    
   
}
module.exports={subscriptionVerify}