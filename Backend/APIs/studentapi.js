const exp = require("express");
const studentApp = exp.Router();
const schedule = require('node-schedule');
const expresshandler = require("express-async-handler");
const { createStudentorTeacher,loginStudentorTeacher } = require("./Util");
const {subscriptionVerify}= require('../Middlewares/subscriptionVerify');
const { toNamespacedPath } = require("path");
//body parser
studentApp.use(exp.json());

//midddle ware of objects
let studentCollection;
let teacherCollection;
let testTeacher;
let testAttemptData;
let subCollection;
studentApp.use((req, res, next) => {
  studentCollection = req.app.get("studentCollection");
  teacherCollection = req.app.get("teacherCollection");
  subCollection = req.app.get("subCollection");
  testTeacher = req.app.get("testTeacher")
  testAttemptData=req.app.get("testAttemptData")
  next();
});

//-------------------------Register-------------------------------------------------
studentApp.post("/register", expresshandler(createStudentorTeacher));
//---------------------------Student Login-----------------------------
studentApp.post('/login',expresshandler(loginStudentorTeacher))


//----------------------plan upgrade----------------------------------


/*schedule.scheduleJob('0 0 * * *', function() {
  console.log('Running scheduled task');
  checkAndUpdateExpiredSubscriptions(subCollection);
});*/



//---------------------------------------Ugrading a plan by student-----------------------------------------
studentApp.put("/upgrade/:username/:plan_type", async (req, res) => {
  let uname = req.params.username;
  let ptype = (+req.params.plan_type);
  let acc=await studentCollection.findOne({username:uname})
  let dbuser = {};
  
  let init_user_sub = await subCollection.findOne({$and:[{username:uname},{active_status:true}]})
  dbuser.subId = new Date().getTime();
  dbuser.userType = "Student";
  dbuser.username = uname;
  dbuser.email=acc.email
  dbuser.plan_type = ptype;
  if (init_user_sub != null) {
     let init_user = await subCollection.findOne({ username: uname },{sort:{subId:-1}})
     const exist_endtime = new Date(init_user.end_time);
     dbuser.start_time = exist_endtime.toISOString(); // user is found and having existing subscription
     let newEndTime = new Date(exist_endtime);
     newEndTime.setDate(newEndTime.getDate() +  (30*ptype));
     dbuser.end_time = newEndTime.toISOString();
     dbuser.active_status=false;
      
  }
  else {
        dbuser.start_time= new Date().toISOString();
        let endtime= new Date(dbuser.start_time);
        endtime.setDate(endtime.getDate()+(30*ptype));
        dbuser.end_time= endtime.toISOString(); // User having an expired subscription or first time subscription
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
  const updated=await subCollection.insertOne(dbuser)
  if(updated){
    res.send({message:"Subscription Successfull"})

  }
  else{
    res.send({message:"Can't Subscribe"})

  }
 
});
//------------------------------------------------------------------------------------------------------------------------------------
//Display tests by teacher username
studentApp.get('/display-tests/:uname',async(req,res)=>{
   const username = req.params.uname;
   console.log(username)
   const testobj = await testTeacher.find({$and:[{createdBy:username},{validity:true}]}).toArray();
   console.log(testobj)
   if(testobj && testobj.length!=0){
    console.log("y")
    res.send({message:"The created tests are",payload:testobj})
   }
   else{
    console.log("x");
    res.send({message:"No tests created"});
   }
})


///------------------------------------Start a test-------------------------------------
studentApp.get('/start-test/:st_uname/:uname/:testid/:s_uname/:type',subscriptionVerify,async(req,res)=>{
  const username = req.params.uname;
  const test_id=+req.params.testid;
  const st_uname=req.params.st_uname;
  //console.log(test_id," ",username);
  const checkObj = await testAttemptData.findOne({username:st_uname});
  console.log(checkObj)
  if(!checkObj){
    console.log("xxxxx")
    const testobj = await testTeacher.findOne({$and:[{createdBy:username},{testid:test_id}]});
    //console.log(testobj)
    
    if(testobj){
      delete testobj.students_attempted;
      delete testobj.validity
      res.send({message:"Test Started",payload:testobj});
      
    }
    else{
      res.send({message:"Error While starting the test"});
    }
  }
  else{
    const result = checkObj.test_data.some(test=>test.testid===test_id);
    console.log('uuuuu')
    if(result){
      res.send({message:"Test Already Attempted"})
    }
    else{
    const testobj = await testTeacher.findOne({$and:[{createdBy:username},{testid:test_id}]});
    console.log(testobj)
    
    if(testobj){
      delete testobj.students_attempted;
      delete testobj.validity
      res.send({message:"Test Started",payload:testobj});
      
    }
    else{
      res.send({message:"Error While starting the test"});
    }
    }
  }
  
  
 
})


//---------------------------------------------End a test-------------------------------
studentApp.post('/end-test',async(req,res)=>{
  const endObj=req.body;
  let user= await testAttemptData.findOne({username:endObj.username});
  //console.log(user)
  if(!user){
    const newData ={}
    newData.username=endObj.username;
    newData.test_data=[]
    user={...newData}
    const rr=await testAttemptData.insertOne(newData);
   // console.log(rr);
    //res.send({message:"User created"});
  }
  //updating for teacher memory------------
  teacher={}
  teacher.username=endObj.username;
  teacher.start_time=endObj.start_time;
  teacher.time_taken=endObj.time_taken;
  teacher.test_startdate=endObj.test_startdate;
  teacher.total_marks=endObj.total_marks
  teacher.marks_scored=endObj.marks_scored;
  console.log(teacher)

  let testing = await testTeacher.findOne({testid:endObj.testid});
  testing.students_attempted.push(teacher)
  await testTeacher.updateOne({testid:endObj.testid},{$set:testing},{returnOriginl:false})
  //console.log(user)-------------------------------------------
  //Updating in the testAttempt Data
  let uname_student=endObj.username;
  delete endObj.username;
  user.test_data.push(endObj);
  //console.log(user)
  //updating into database
  const updated = await testAttemptData.findOneAndUpdate({username:uname_student},{$set:user},{returnOriginl:false})
  if(updated){
    res.send({message:"Test Ended Successfully",payload:updated});
  }
  else{
    res.send({message:"Could Not End Test"});
  }

})


// Display prev tests
studentApp.get('/display-prev-tests/:uname',async(req,res)=>{
  const uname= req.params.uname;
  const prevObj = await testAttemptData.findOne({username:uname});
  if(prevObj){
    res.send({message:"Previous tests are",payload:prevObj});
  }
  else{
    res.send({message:"No tests found"});
  }
})


//Get teacher usernames
studentApp.get('/get-teachers',async(req,res)=>{
  const teachers = await teacherCollection.find({}, { projection: { username: 1 } }).toArray();

    const usernames = teachers.map(teacher => teacher.username);
    res.send({message:"usernames are",payload:usernames})
})
//export app
module.exports = studentApp;
