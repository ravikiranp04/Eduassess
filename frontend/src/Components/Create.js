import React from 'react'
import {Link} from 'react-router-dom'
import {Outlet} from 'react-router-dom'
import './CSS/Create.css'
function Create() {
  return (
    <div >
        <div className='img-fluid float-start bg-dark'>
        <img src="https://images.shiksha.com/mediadata/images/1687888767php162Hce.jpeg" alt="this image is not available" style={{height:"40px",width:"40px"}} className='rounded-circle m-3 '/>
        </div>
        <div className="nav bg-dark justify-content-end mb-5 p-3">
        <ul className="nav">
            <li className="nav-item">
                <Link className="nav-link" to="">About us</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="Logout">Logout</Link>
            </li>
        </ul>
        </div>
        <div style={{minHeight:"100vh"}} className='out'><Outlet/>
            <h1 className='text-center'>Assessment Creation</h1>
            <div className='out1'>
            <label htmlFor="" >Subject  :  </label>
            <select name="subject" id="subject " className='p-2 m-3'>
                <option value="" disabled selected>---select the subject---</option>
                <option value="c">C</option>
                <option value="Ds">Data Structures</option>
                <option value="py">Python</option>
                <option value="java">Java</option>
            </select>
            <div>
            <label htmlFor="">Date : </label>
            <input type="date" name="" id="" className='p-2 m-3'/>
            </div>
            <div>
                <label htmlFor="">Time : </label>
                <input type="time" name="" id="" className='p-2 m-3'/>
            </div>
            <div>
                <label htmlFor=""> Duration : </label>
                <input type="number" name="" id="" className='p-2 m-3' placeholder='Duration in minutes'/>
            </div>
            <div>
                <label htmlFor="">Students List : </label>
                <select name="subject" id="subject " className='p-2 m-3'>
                <option value="" disabled selected>---select the students---</option>
                <option value="cse">CSE</option>
                <option value="aiml">AIML</option>
                <option value="it">IT</option>
                <option value="csds">CSDS</option>
                <option value="cscy">CSCY</option>
                <option value="eee">EEE</option>
                <option value="ece">ECE</option>
            </select>
            </div>
            <div>
                <label htmlFor="">Browse/upload : </label>
                <input type="file" name="" id=""  className='p-2 m-3'/>
            </div>
            <div className='btns'>
                <button className='bg-primary p-2 m-3 text-light'>Save</button>
                <button type="submit" className='bg-primary p-2 m-3 text-light'>Submit</button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Create