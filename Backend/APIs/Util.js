const bcryptjs=require('bcryptjs')
const jwt= require('jsonwebtoken')


//----------------------register--------------------------------------------
const createStudentorTeacher=async(req,res)=>{
   const studentCollectionObj=req.app.get('studentCollection');
   const teacherCollectionObj=req.app.get('teacherCollection');
   const adminCollectionObj=req.app.get('adminCollection');
   const testAttemptData=req.app.get('testAttemptData');
    //get user 
    const user=req.body
    //console.log(user)
    //check for duplicates student
    if(user.userType=='Student'){
        //find dbuser
        let dbuser1=await studentCollectionObj.findOne({username:user.username});
        let dbuser2=await studentCollectionObj.findOne({email:user.email});
        if(dbuser1!=null){
           return  res.send({message:"Username already exists"})
        }
        if(dbuser2!=null){
           return  res.send({message:"Email already exists"})
        }
        
        
    }

    //check for duplicates teacher
    if(user.userType=='Teacher'){
        //find dbuser
        let dbuser1=await teacherCollectionObj.findOne({username:user.username});
        let dbuser2=await teacherCollectionObj.findOne({email:user.email});
        if(dbuser1!=null){
           return  res.send({message:"Username already exists"})
        }
        if(dbuser2!=null){
           return  res.send({message:"Email already exists"})
        }
        
    }
    if(user.userType=='admin'){
      //find dbuser
      let dbuser1=await adminCollectionObj.findOne({username:user.username});
      let dbuser2=await adminCollectionObj.findOne({email:user.email});
      if(dbuser1!=null){
         return  res.send({message:"Username already exists"})
      }
      if(dbuser2!=null){
         return  res.send({message:"Email already exists"})
      }
      
  }
    
    //hash password
    let hashedpassword=await bcryptjs.hash(user.password,7);
    //console.log(user.password)
    //console.log(hashedpassword)

    //replace with hashed password
    user.password=hashedpassword


    //insert into database
   if(user.userType=='Student'){
      await studentCollectionObj.insertOne(user);
      
      res.send({message:"Student Profile Created"});
   }
   if(user.userType=='Teacher'){
      await teacherCollectionObj.insertOne(user);
      await testAttemptData.inserOne
      res.send({message:"Teacher Profile Created"});
   }
   if(user.userType=='admin'){
      await adminCollectionObj.insertOne(user);
      res.send({message:"Admin Profile Created"});
   }
   

}

const loginStudentorTeacher=async(req,res)=>{
   const studentCollectionObj=req.app.get('studentCollection');
   const teacherCollectionObj=req.app.get('teacherCollection');
   const adminCollectionObj=req.app.get('adminCollection')
   const subCollection=req.app.get('subCollection')
   const userCred=req.body
   //verify username of user
   if(userCred.userType=='Student'){
       let dbuser=await studentCollectionObj.findOne({username:userCred.username})
       if(dbuser==null){
           return res.send({message:"Invalid username"})
       }
       else{
           let status= await bcryptjs.compare(userCred.password,dbuser.password)//return bool value
           if(status==false){
               return res.send({message:"Invalid password"})
           }
           else{
               //create jwt token
               const signedtoken=jwt.sign({username:dbuser.username},'abcde',{expiresIn:'1d'})
               let obj = await subCollection.findOne({$and:[{userType:userCred.userType},{username:dbuser.username},{active_status:true}]})
              console.log(obj)
               if(!obj){
                dbuser.plan_type=0;
              }
              else{
                dbuser.plan_type=obj.plan_type;
              }
               delete dbuser.password
               res.send({message:"Login success",token:signedtoken,user:dbuser})
           }
       }
   }

   if(userCred.userType=='Teacher'){
      let dbuser=await teacherCollectionObj.findOne({username:userCred.username})
      if(dbuser==null){
          return res.send({message:"Invalid username"})
      }
      else{
          let status= await bcryptjs.compare(userCred.password,dbuser.password)//return bool value
          if(status==false){
              return res.send({message:"Invalid password"})
          }
          else{
              //create jwt token
              console.log(dbuser)
              const signedtoken=jwt.sign({username:dbuser.username},'abcde',{expiresIn:'1d'})
              let obj = await subCollection.findOne({$and:[{userType:dbuser.userType},{username:dbuser.username},{active_status:true}]})
              console.log(obj)
              if(!obj){
                dbuser.plan_type=0;
              }
              else{
                dbuser.plan_type=obj.plan_type;
              }
              delete dbuser.password
              res.send({message:"Login success",token:signedtoken,user:dbuser})
          }
      }
  }
  if(userCred.userType=='admin'){
   let dbuser=await adminCollectionObj.findOne({username:userCred.username})
   if(dbuser==null){
       return res.send({message:"Invalid username"})
   }
   else{
       let status= await bcryptjs.compare(userCred.password,dbuser.password)//return bool value
       if(status==false){
           return res.send({message:"Invalid password"})
       }
       else{
           //create jwt token
           const signedtoken=jwt.sign({username:dbuser.username},'abcde',{expiresIn:'1d'})
           
           delete dbuser.password
           res.send({message:"Login success",token:signedtoken,user:dbuser})
       }
   }
}


}

//--------------------------------Plan Upgrade-------------------------------------


module.exports={createStudentorTeacher,loginStudentorTeacher}