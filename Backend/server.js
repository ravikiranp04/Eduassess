const exp=require('express')
const app=exp();
const path=require('path')
const cors=require('cors')
//Importing API
const adminApp=require('./APIs/adminapi')
const studentApp=require('./APIs/studentapi')
const teacherApp=require('./APIs/teacherapi')
//directing Http requests
app.use('/admin-api',adminApp)
app.use('/student-api',studentApp)
app.use('/teacher-api',teacherApp)
//accessing content of environment variable file
require('dotenv').config()
app.use(cors())
//body parser
app.use(exp.json())

// Static file serving from React build directory
app.use(exp.static(path.join(__dirname, '../frontend/build')));
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});*/

let subCollection;
//MongoDb connect
const mongoClient=require('mongodb').MongoClient
mongoClient.connect(process.env.DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(client=>{
    //database object
    const assessDBObj=client.db('assess');
    //create collection object
    const DemoCollection=assessDBObj.collection('Demos');
    const studentCollection=assessDBObj.collection('students')
    const teacherCollection=assessDBObj.collection('teachers')
    const adminCollection=assessDBObj.collection('admins')
    subCollection=assessDBObj.collection('subCollection')
    const teacherQuestions=assessDBObj.collection('teacherQuestions');
    const adminQuestions=assessDBObj.collection('adminQuestions');
    const testTeacher=assessDBObj.collection('testTeacher')
    const testAttemptData= assessDBObj.collection('testAttemptData');
    const subjectCategories = assessDBObj.collection('subjectCategories')
    //share collection object with APIs
    app.set('DemoCollection',DemoCollection)
    app.set('studentCollection',studentCollection)
    app.set('teacherCollection',teacherCollection)
    app.set('subCollection',subCollection)
    app.set('teacherQuestions',teacherQuestions)
    app.set('adminQuestions',adminQuestions);
    app.set('adminCollection',adminCollection)
    app.set('testTeacher',testTeacher);
    app.set('testAttemptData',testAttemptData);
    app.set('subjectCategories',subjectCategories)
    console.log("DB Connection Success");

})
.catch((err)=>{
    console.log("Error in Connecting to Database\n", err)
})


//error handler
app.use((err,req,res,next)=>{
    res.send({status:"Error",message:err.message})
})

app.listen(process.env.PORT,()=>{
    console.log(`Server on ${process.env.PORT}`)
})


//---------------------------Plan Upgrade Check---------------
const checkAndUpdateExpiredSubscriptions = async (subCollection) => {
  
    if (!subCollection) {
      console.error('subCollection is not initialized');
      return;
    }
    console.log(subCollection)
    let currentTime = new Date();
  
    try {
      // Find all active subscriptions where the end_time is before the current time
      let expiredSubscriptions = await subCollection.find({
        active_status: true,
        end_time: { $lte: currentTime }
      }).toArray();
  
      if (expiredSubscriptions.length > 0) {
        await subCollection.updateMany(
          { _id: { $in: expiredSubscriptions.map(sub => sub._id) } },
          { $set: { active_status: false } }
        );
        console.log(`${expiredSubscriptions.length} expired subscriptions deactivated.`);
      }
      console.log(subCollection)
  
      // Update active status to true for new subscriptions
      let newSubscriptions = await subCollection.find({
        active_status: false,
        end_time: { $gte: currentTime },
        start_time: { $lte: currentTime }
      }).toArray();
  
      if (newSubscriptions.length > 0) {
        await subCollection.updateMany(
          { _id: { $in: newSubscriptions.map(sub => sub._id) } },
          { $set: { active_status: true } }
        );
        console.log(`${newSubscriptions.length} new subscriptions activated.`);
      }
      let No_of_Tests
      // Control number of tests
      let allSubscriptions = await subCollection.find({
        tests_used: { $gte: No_of_Tests }
      }).toArray();
  
      if (allSubscriptions.length > 0) {
        await subCollection.updateMany(
          { _id: { $in: allSubscriptions.map(sub => sub._id) } },
          { $set: { active_status: false } }
        );
        console.log(`${allSubscriptions.length} subscriptions with excess tests deactivated.`);
      }
  
      console.log("Expired subscriptions checked and updated");
    } catch (error) {
      console.error("Error checking and updating subscriptions:", error);
    }
  };
  
  setInterval(async () => {
    try {
      await checkAndUpdateExpiredSubscriptions(subCollection);
    } catch (error) {
      console.error("Error in setInterval:", error);
    }
  },900000);