const exp=require('express')
const adminApp=exp.Router()
const expresshandler=require('express-async-handler')
const {createStudentorTeacher,loginStudentorTeacher}=require('./Util');

// Add body parser
adminApp.use(exp.json());

let studentCollection;
let teacherCollection;
let teacherQuestions;
let subCollection;
let adminQuestions;
let subjectCategories
adminApp.use((req, res, next) => {
  studentCollection = req.app.get("studentCollection");
  teacherCollection = req.app.get("teacherCollection");
  subCollection = req.app.get("subCollection");
  teacherQuestions=req.app.get("teacherQuestions");
  adminQuestions=req.app.get("adminQuestions")
  subjectCategories=req.app.get('subjectCategories')
  next();
});

//----------------------------------------------------------------------------------------------
//Demo Exam Registration
adminApp.post('/demo',expresshandler(async(req,res)=>{
    let demoCollection=req.app.get('DemoCollection')
    const data=req.body

    let demouser=await demoCollection.findOne({email:data.email})
    if(demouser!=null){
        res.send({message:"Demo User Already Registered"})
    }
    else{
        const validDate= new Date(data.registerTime)
        validDate.setDate(validDate.getDate()+7)
        data.validity=validDate.toISOString()
        await demoCollection.insertOne(data);
        res.send({message:"Demo Registered"});
    }
}))
//---------------------------------------------------Admin Operations-----------------------------------
// Admin register
adminApp.post('/register',expresshandler(createStudentorTeacher))
//admin login
adminApp.post('/login',expresshandler(loginStudentorTeacher))


//--------------------Admin question adding------------
adminApp.post('/add-qs',expresshandler(async(req,res)=>{
    const qsObj = req.body;
    const updt= await adminQuestions.insertOne(qsObj);
    if(updt){
      res.send({message:"Admin Question Created"});
    }
    else{
      res.send({message:"Try Again"});
    }
    
}))

//Display questions available in the database
adminApp.get('/prev-qs',expresshandler(async(req,res)=>{
    let qsObj = await adminQuestions.find().toArray();
    if(qsObj!=null){
      res.send({message:"Previous Questions are",payload:qsObj})
    }
    else{
      res.send({message:"No Questions created till now"})
    }
  }))


//Disable a Question(soft delete)
adminApp.put('/soft-del/:qs_id',expresshandler(async(req,res)=>{
    const qid=+(req.params.qs_id);
    let qsobj= await adminQuestions.findOne({qs_id:qid});
    qsobj.display_status=false
    const disabled = await adminQuestions.findOneAndUpdate({qs_id:qid},{$set:qsobj},{returnOriginal:false})
    //console.log(disabled)
    if(!disabled){

        res.send({message:"Question not disabled"})
    }
    else{
        res.send({message:"Question disabled"})
    }
}))

//Enable a Question(soft delete)
adminApp.put('/enable/:qs_id',expresshandler(async(req,res)=>{
  const qid=+(req.params.qs_id);
  let qsobj= await adminQuestions.findOne({qs_id:qid});
  qsobj.display_status=true
  const disabled = await adminQuestions.findOneAndUpdate({qs_id:qid},{$set:qsobj},{returnOriginal:false})
  //console.log(disabled)
  if(!disabled){

      res.send({message:"Question not Enabled"})
  }
  else{
      res.send({message:"Question Enabled"})
  }
}))

//Modify a existing question
adminApp.put('/modify-qs',expresshandler(async(req,res)=>{
    const qsobj=req.body;
    //console.log(qsobj)
    const updated=await adminQuestions.findOneAndUpdate({qs_id:qsobj.qs_id},{$set:{...qsobj}},{returnOriginal:false})
    console.log(updated)
    if(!updated){
      res.send({message:"Question not updated"});
    }
    else{
  
      res.send({message:"Question updated"});
    }
  
  }))

// add a subject
adminApp.post('/add-subject',expresshandler(async(req,res)=>{
  const obj = req.body;
  obj.subjectid=+(obj.subjectid)
  console.log(obj)
  const dbobj = await subjectCategories.findOne({subject:obj.subject})
  if(dbobj){
    res.send({message:"Subject already exists"})
  }
  else{
    const upd = await subjectCategories.insertOne(obj);
    if(upd){
      res.send({message:"Subject added Successfully"})
    }
    else{
      res.send({message:"Try again"});
    }
  }
}))

// Modify a subject
adminApp.put('/modify-subject',expresshandler(async(req,res)=>{
  const obj = req.body;
  //console.log(obj)
  obj.subjectid=+(obj.subjectid)
  //console.log(obj.subjectid)
  const dbobj = await subjectCategories.findOneAndUpdate({subjectid:obj.subjectid},{$set:obj},{returnOriginal:false})
  //console.log(dbobj)
  if(dbobj){
    res.send({message:"Subject Modified"})
  }
  else{
    
      res.send({message:"Try again"});
  }
}))

//Remove a subject
adminApp.delete('/delete-subject/:subid',expresshandler(async(req,res)=>{
  const subjectid = +(req.params.subid);
  const updt = await subjectCategories.deleteOne({subjectid:subjectid});
  if(updt){
    res.send({message:"Subject deleted"});
  }
  else{
    res.send({message:"Try again"})
  }
}))

//get subject
adminApp.get('/get-subjects',expresshandler(async(req,res)=>{
  
  const obj = await subjectCategories.find().toArray();
  if(obj){
    res.send({message:"Subjects are",payload:obj});
  }
  else{
    res.send({message:"Try again"})
  }
}))

//get subject categories
adminApp.get('/get-subject-cat/:subid',expresshandler(async(req,res)=>{
  const subjectid=+req.params.subid;
  const dbobj=await subjectCategories.findOne({subjectid:subjectid});
  if(dbobj){
    res.send({message:"categories are",payload:dbobj})
  }
  else{
    res.send({message:"Try again"})
  }

}))

//exporting api
module.exports=adminApp;