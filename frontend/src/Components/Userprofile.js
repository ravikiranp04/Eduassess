
import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar2 from './Navbar2'
function Userprofile() {
  return(
    <div>User Profile
      <Outlet/>
    </div>
    
  )
}

export default Userprofile