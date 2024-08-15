import "./CSS/Signup.css";
import { useForm } from "react-hook-form";
import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { BASE_URL } from "../port";
function Signup() {
  const navigate=useNavigate()
  let { register, handleSubmit } = useForm();
  let [err,setErr]=useState('')
  const submitform=async(obj)=>{
    console.log(obj);
    const res= await axios.post(`${BASE_URL}/teacher-api/register`,obj);
    console.log(res)
    if(res.data.message=='Student Profile Created' || res.data.message=='Teacher Profile Created' || res.data.message==='Admin Profile Created' ){
        navigate('/signin')
    }
    else{
      setErr(res.data.message)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Signup</h2>
            </div>
            <div className="card-body">

              {/* user register error message */}
              {err.length!=0&&<p className="text-danger text-center">{err}</p>}
              <form onSubmit={handleSubmit(submitform)}>
                {/* radio */}
                <div className="mb-4">
                  <label
                    htmlFor="user"
                    className="form-check-label me-3"
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--light-dark-grey)",
                    }}
                  >
                    Register as
                  </label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="Teacher"
                      value="Teacher"
                      {...register("userType")}
                    />
                    <label
                      htmlFor="Teacher"
                      className="form-check-label"
                      style={{ color: "var(--dark-green)" }}
                    >
                      Teacher
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="Student"
                      value="Student"
                      {...register("userType")}
                    />
                    <label
                      htmlFor="Student"
                      className="form-check-label"
                      style={{ color: "var(--dark-green)" }}
                    >
                      Student
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="admin"
                      value="admin"
                      {...register("userType")}
                    />
                    <label
                      htmlFor="admin"
                      className="form-check-label"
                      style={{ color: "var(--dark-green)" }}
                    >
                      Admin
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control "
                    id="username"
                    {...register("username")}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control "
                    id="password"
                    {...register("password")}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    {...register("email")}
                  />
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="text-light d-block mx-auto"
                    style={{ backgroundColor: "var(--dark-maroon)" }}
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;