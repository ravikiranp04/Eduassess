// App.js
import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Home from './Components/Home';
import Teacherprofile from './Components/Teacherprofile';
import TestCreation from './Components/TestCreation';
import Userprofile from './Components/Userprofile';
import Test from './Components/Test';
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
              path:'dashboard',
              element:<Dashboard/>
            },
            {
              path:'upgrade',
              element:<UpgradeList/>
            },
            {
              path:'',
              element:<Navigate to='dashboard'/>
            }
          ]
        },
        {
          path:'/teacher-profile/:username',
          element:<Teacherprofile/>,
          children:[
            {
              path:'dashboard',
              element:<Dashboard/>
            },
            {
              path:'upgrade',
              element:<UpgradeList/>
            },
            {
              path:'',
              element:<Navigate to='dashboard'/>
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
