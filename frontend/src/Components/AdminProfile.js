import React from 'react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
function AdminProfile() {
  const prod = [
    { name: "ravi" },
    { name: "kiran" },
    { name: "shiva" }
  ];
  const navigate=useNavigate();

  return (
    <div>
      <div className='d-flex justify-content-around m-2'>
        <button className='btn btn-success' onClick={()=>navigate('/admin-profile/dashboard')}>Questions</button>
        <button className='btn btn-success' onClick={()=>navigate('/admin-profile/add-question')}>Add a Question</button>
        <button className='btn btn-success' onClick={()=>navigate('/admin-profile/admin-subject')}>Subjects</button>
        <button className='btn btn-success' onClick={()=>navigate('/admin-profile/add-subject')}>Add Subject</button>
      </div>
      <Outlet/>
    </div>
  );
}

export default AdminProfile;
