import React from 'react'
import {Link} from 'react-router-dom'
import {Outlet} from 'react-router-dom'

function Navbar2() {
  return (
    <div >
        <div className='img-fluid float-start bg-dark'>
        <img src="https://images.shiksha.com/mediadata/images/1687888767php162Hce.jpeg" alt="this image is not available" style={{height:"40px",width:"40px"}} className='rounded-circle m-3 '/>
        </div>
        <div className="nav bg-dark justify-content-end mb-5 p-3">
        <ul className="nav">
            <li className="nav-item">
                <Link className="nav-link" to="aboutus">About us</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="Logout">Logout</Link>
            </li>
        </ul>
        </div>
        <div style={{minHeight:"100vh"}}><Outlet/>
        <img src="https://images.shiksha.com/mediadata/images/1687888767php162Hce.jpeg" alt="this image is not available" style={{height:"400px",width:"400px"}} className='float-end'/>

        </div>
    </div>
  )
}

export default Navbar2