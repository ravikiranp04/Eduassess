import React, { useState } from 'react';
import Upgrade from './Upgrade';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../port';

function UpgradeList() {
  const { currentuser, loginStatus } = useSelector((state) => state.userLogin);
  const token = sessionStorage.getItem('token');
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { username } = useParams();

  const axiosWithToken = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const subscribe = async (ptype) => {
    if (!token || !currentuser) {
      setErr('User not logged in or session expired.');
      return;
    }

    setLoading(true); // Disable button

    try {
      let res;
      if (currentuser.userType === 'Teacher') {
        res = await axiosWithToken.put(
          `/teacher-api/upgrade/${currentuser.username}/${ptype}`
        );
      } else if (currentuser.userType === 'Student') {
        res = await axiosWithToken.put(
          `/student-api/upgrade/${currentuser.username}/${ptype}`
        );
      }

      if (res.data.message === 'Subscription Successful') {
        if(currentuser.userType === 'Teacher'){
          navigate( `/teacher-profile/${currentuser.username}/userdashboard`, { state: { message: res.data.message } });

        }
        else{
          navigate( `/student-profile/${currentuser.username}/studentdashboard`, { state: { message: res.data.message } });
        }

      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr('An error occurred during subscription.');
      console.error(error);
    } finally {
      setLoading(false); // Re-enable button after loading
    }
  };

  const plans = [
    {
      planname: "BASIC",
      plantype: 1,
      money: 'Rs 99',
      noOfTests: 5,
      dataAvailable: '02 months',
      mes: 'Automatic Email to student',
    },
    {
      planname: "EXTENDED",
      plantype: 3,
      money: 'Rs 199',
      noOfTests: 15,
      dataAvailable: '06 months',
      mes: 'Automatic Email to student',
    },
    {
      planname: "SUPER SAVER",
      plantype: 6,
      money: 'Rs 299',
      noOfTests: 'Unlimited',
      dataAvailable: '1 year',
      mes: 'Automatic Email to student',
    },
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center text-light bg-primary py-3 rounded fs-1">Yearly Plan</h1>
      <div className="row justify-content-center">
        {plans.map((plan, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
            <div
              className={`card rounded-5 bg-primary text-light text-center h-100 ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && subscribe(plan.plantype)} // Prevent multiple clicks
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }} // Change cursor when loading
            >
              <Upgrade planobj={plan} />
            </div>
          </div>
        ))}
      </div>
      {err && <div className="alert alert-danger mt-3">{err}</div>}
    </div>
  );
}

export default UpgradeList;
