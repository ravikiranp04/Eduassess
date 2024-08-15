import React from 'react'
import Navbar from './Navbar'
import {Outlet} from 'react-router-dom'

import Footer from './Footer'
function Rootlayout() {
  return (
    <div>
        <Navbar/>
        <div style={{minHeight:"100vh"}} ><Outlet/></div>
        <Footer/>
    </div>
  )
}

export default Rootlayout
