const exp=require('express')
const teacherApp=exp.Router()
const expresshandler=require('express-async-handler')
const {createStudentorTeacher,loginStudentorTeacher}=require('./Util');
const {subscriptionVerify}=require('../Middlewares/subscriptionVerify')

//body parser
teacherApp.use(exp.json());

//midddle ware of objects
let studentCollection;
let teacherCollection;
let teacherQuestions;
let subCollection;
let adminQuestions;
let testTeacher;
teacherApp.use((req, res, next) => {
  studentCollection = req.app.get("studentCollection");
  teacherCollection = req.app.get("teacherCollection");
  subCollection = req.app.get("subCollection");
  teacherQuestions=req.app.get("teacherQuestions");
  adminQuestions=req.app.get("adminQuestions")
  testTeacher=req.app.get('testTeacher')
  next();
});

//teacher register
teacherApp.post('/register',expresshandler(createStudentorTeacher))
//teacher login
teacherApp.post('/login',expresshandler(loginStudentorTeacher))




//---------------------------------------Ugrading a plan by Teacher-----------------------------------------
teacherApp.put("/upgrade/:username/:plan_type", async (req, res) => {
    let uname = req.params.username;
    let ptype = (+req.params.plan_type);
    let acc=await teacherCollection.findOne({username:uname})
    let dbuser = {};
    
    let init_user_sub = await subCollection.findOne({$and:[{username:uname},{active_status:true}]})
    dbuser.subId = new Date().getTime();
    dbuser.userType = "Teacher";
    dbuser.username = uname;
    dbuser.email=acc.email
    dbuser.plan_type = ptype;
    if (init_user_sub != null) {
       let init_user = await subCollection.findOne({ username: uname },{sort:{subId:-1}})
       const exist_endtime = new Date(init_user.end_time);
       dbuser.start_time = exist_endtime.toISOString(); // teacher is found and having existing subscription
       let newEndTime = new Date(exist_endtime);
       newEndTime.setDate(newEndTime.getDate() +  (30*ptype));
       dbuser.end_time = newEndTime.toISOString();
       dbuser.active_status=false;
        
    }
    else {
          dbuser.start_time= new Date().toISOString();
          let endtime= new Date(dbuser.start_time);
          endtime.setDate(endtime.getDate()+(30*ptype));
          dbuser.end_time= endtime.toISOString(); // teacher having an expired subscription or first time subscription
          dbuser.active_status=true
      }
    
    switch(ptype){
      case 1:
          dbuser.No_of_Tests=5
          dbuser.tests_used=0
          break;
      case 3:
          dbuser.No_of_Tests=15
          dbuser.tests_used=0
          break;
      case 6:
          dbuser.No_of_Tests=30
          dbuser.tests_used=0
          break;
      default:
          break;
    }
    console.log(dbuser);
    await subCollection.insertOne(dbuser)
    res.send({message:"Subscription Successful"})
  });


//Add questions by teacher
teacherApp.post('/add-qs',async(req,res)=>{
  const qsObj = req.body;
  qsObj.qs_id=+('99'+qsObj.qs_id)
  console.log(qsObj.qs_id)
  await teacherQuestions.insertOne(qsObj);
  res.send({message:"Teacher Question Created"});
})  

//Display previous questions created by a teacher
teacherApp.get('/prev-qs/:username',async(req,res)=>{
  const uname= req.params.username
  let qsObj = await teacherQuestions.find({username:uname}).toArray();
  if(qsObj!=null){
    res.send({message:"Previous Questions are",payload:qsObj})
  }
  else{
    res.send({message:"No Questions created till now"})
  }
})

//Display previous questions created by admin
teacherApp.get('/prev-qs-admin',async(req,res)=>{
  let qsObj = await adminQuestions.find({display_status:true}).toArray();
  if(qsObj!=null){
    res.send({message:"Previous Questions are",payload:qsObj})
  }
  else{
    res.send({message:"No Questions created till now"})
  }
})

//Display tests by teacher username
teacherApp.get('/display-tests/:uname',async(req,res)=>{
  const username = req.params.uname;
  console.log(username)
  const testobj = await testTeacher.find({$and:[{createdBy:username}]}).toArray();
  console.log(testobj)
  if(testobj.length!=0){
   res.send({message:"The created tests are",payload:testobj})
  }
  else{
   res.send({message:"No tests created"});
  }
})


//Delete a question created by the teacher
teacherApp.delete('/del-qs/:qs_id',async(req,res)=>{
  const qid=(req.params.qs_id);
  const x =await teacherQuestions.deleteOne({qs_id:qid});
  if(x){
    res.send({message:"Question deleted"})
  }
  else{
    res.send({message:"Cant delete Question"})
  }
 
 
})

//Modify a existing question
teacherApp.put('/modify-qs/:s_uname/:type',subscriptionVerify,async(req,res)=>{
  const qsobj=req.body;
  //console.log(qsobj)
  const updated=await teacherQuestions.findOneAndUpdate({$and:[{qs_id:qsobj.qs_id},{username:qsobj.username}]},{$set:{...qsobj}},{returnOriginal:false})
  console.log(updated)
  if(!updated){
    res.send({message:"Question not updated"});
  }
  else{

    res.send({message:"Question updated"});
  }

})

//Modifying a test
teacherApp.put('/modify-test/:s_uname/:type',subscriptionVerify,async(req,res)=>{
  const testobj=req.body;
  const cby = req.params.s_uname
  console.log(testobj)
  console.log(cby)
  //console.log(qsobj)
  const updated=await testTeacher.findOneAndUpdate({$and:[{testid:testobj.testid},{createdBy:cby}]},{$set:{...testobj}},{returnOriginal:false})
  console.log(updated)
  if(!updated){
    res.send({message:"Test not updated"});
  }
  else{

    res.send({message:"Test updated"});
  }

})

//Create a Test (subscription)
teacherApp.post('/create-test/:s_uname/:type',subscriptionVerify,async(req,res)=>{
  /*//checking for subscription
   const s_uname = req.params.s_uname
   const subObj = await subCollection.find({$and:[{userType:'Teacher'},{username:s_uname},{active_status:true}]})
   if(!subObj){
    res.send({message:"No subscription"})
   }*/
   const testObj = req.body;
   delete testObj.marks
   const updated= await testTeacher.insertOne(testObj);
   if(!updated){
     res.send({message:"Test not Created"});
   }
   else{
    res.send({message:"Test Created"});
   }
})

//Changing Marking scheme for correct answers
teacherApp.put('/correct/:uname/:testid/:marks',async(req,res)=>{
    const uname = req.params.uname;
    const test_id=(+req.params.testid);
    const marks = (+req.params.marks);
    const userobj = await testTeacher.findOne({$and:[{createdBy:uname},{testid:test_id}]})
    console.log(userobj);
    userobj.questions.forEach(question=>{
      question.correct_value=marks;
    })
    //console.log(userobj);
    const updated = await testTeacher.findOneAndUpdate({$and:[{createdBy:uname},{testid:test_id}]},{$set:{questions:userobj.questions}},{returnOriginal:false});
    console.log(updated)
    if(!updated){
      res.send({message:"Can't Change Marking scheme"});
    }
    else{
      res.send({message:"Marking Scheme Changed"});
    }
})

//Changing Marking scheme for wrong answers
teacherApp.put('/wrong/:uname/:testid/:marks',async(req,res)=>{
  const uname = req.params.uname;
  const test_id=(+req.params.testid);
  const marks = (+req.params.marks);
  const userobj = await testTeacher.findOne({$and:[{createdBy:uname},{testid:test_id}]})
  //console.log(userobj);
  userobj.questions.forEach(question=>{
    question.wrong_answer=marks;
  })
  //console.log(userobj);
  const updated = await testTeacher.findOneAndUpdate({$and:[{createdBy:uname},{testid:test_id}]},{$set:{questions:userobj.questions}},{returnOriginal:false});
  console.log(updated)
  if(!updated){
    res.send({message:"Can't Change Marking scheme"});
  }
  else{
    res.send({message:"Marking Scheme Changed"});
  }
})

//Deleet test
teacherApp.delete('/del-test/:id',async(req,res)=>{
  const iid = +(req.params.id);
  console.log(iid)
  const updt = await testTeacher.deleteOne({testid:iid});
  if(updt){
    res.send({message:"Test Deleted"});
  }
  else{
    res.send({message:"Cant delete test"})
  }
})

// Activate a a test created the teacher
teacherApp.put('/activate/:uname/:testid/:s_uname/:type',subscriptionVerify,async(req,res)=>{
  const uname=req.params.uname;
  const test_id=(+req.params.testid);
  const testobj= await testTeacher.findOneAndUpdate({$and:[{createdBy:uname},{testid:test_id}]},{$set:{validity:true}},{returnOriginal:false})
  if(testobj){
    res.send({message:"test activated"});
  }
  else{
    res.send({message:"Test Dont exist"})
  }
})

// De Activate a a test created the teacher
teacherApp.put('/deactivate/:uname/:testid',async(req,res)=>{
  const uname=req.params.uname;
  const test_id=(+req.params.testid);
  const testobj= await testTeacher.findOneAndUpdate({$and:[{createdBy:uname},{testid:test_id}]},{$set:{validity:false}},{returnOriginal:false})
  if(testobj){
    res.send({message:"test De-activated"});
  }
  else{
    res.send({message:"Test Dont exist"})
  }
})

//export app
module.exports=teacherApp;