// App.js
import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Home from './Components/Home';
import Teacherprofile from './Components/Teacherprofile';
import TestCreation from './Components/TestCreation';
import Userprofile from './Components/Userprofile';
import Test from './Components/TestAttempt';
import TestDetails from './Components/TestDetails';
import Signin from './Components/Signin';
import Rootlayout from './Components/Rootlayout';
import Signup from './Components/Signup';
import Aboutus from './Components/Aboutus';
import AdminProfile from './Components/AdminProfile';
import Upgrade from './Components/Upgrade';
import UpgradeList from './Components/UpgradeList';
import Dashboard from './Components/Dashboard';
import AddQuestion from './Components/AddQuestion';
import AddSubject from './Components/AddSubject';
import AdminSubjects from './Components/AdminSubjects';
import UserDashboard from './Components/UserDashboard';
import StudentDashboard from './Components/StudentDashboard';
import TestAttempt from './Components/TestAttempt';
import StudentProfileDetails from './Components/StudentProfileDetails';
import TeacherProfileDetails from './Components/TeacherProfileDetails';
import PreviousTests from './Components/PreviousTests';
import TestAnalysis from './Components/TestAnalysis';
function App() {
  const browserRouter = createBrowserRouter([
    {
      path: '',
      element: <Rootlayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path:'/home',
          element:<Home/>
        },
        {
          path: '/signin',
          element: <Signin />,
        },
        {
          path:'/signup',
          element: <Signup/>
        },
        {
          path:'/aboutus',
          element:<Aboutus/>
        },
        {
          path:'/student-profile/:username',
          element:<Userprofile/>,
          children:[
            {
              path:'studentdashboard',
              element:<StudentDashboard/>
            },
            {
              path:'upgrade',
              element:<UpgradeList/>
            },
            {
              path:'test-attempt',
              element:<TestAttempt/>
            },
            {
              path:'',
              element:<Navigate to='studentdashboard'/>
            },
            {
              path:'profile-details',
              element:<StudentProfileDetails/>
            },
            {
              path:'previous-tests',
              element:<PreviousTests/>
              
            },
            {
              path:'test-analysis',
              element:<TestAnalysis/>
            }
          ]
        },
        {
          path:'/teacher-profile/:username',
          element:<Teacherprofile/>,
          children:[
            {
              path:'userdashboard',
              element:<UserDashboard/>
            },
            {
              path:'upgrade',
              element:<UpgradeList/>
            },
            {
              path:'test-creation',
              element:<TestCreation/>
            },
            {
              path:'test-modify',
              element:<TestCreation/>
            },
            {
              path:'add-question',
              element:<AddQuestion/>
            },
            {
              path:'questions',
              element:<Dashboard/>
            },
            {
              path:'',
              element:<Navigate to='userdashboard'/>
            },
            {
              path:'profile-details',
              element:<TeacherProfileDetails/>
            }
          ]
        },
        {
          path:'/admin-profile',
          element:<AdminProfile/>,
          children:[
            {
              path:'dashboard',
              element:<Dashboard/>
            },
            {
              path:'',
              element:<Navigate to='dashboard'/>
            },
            {
              path:'add-subject',
              element:<AddSubject/>
            },{
              path:'admin-subject',
              element:<AdminSubjects/>
            }
          ]
        },
        {
          path:'admin-profile/add-question',
          element:<AddQuestion/>
        },
        
        // Add other routes here if needed
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;
