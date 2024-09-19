import "./CSS/Signup.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../port";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [err, setErr] = useState("");
  
  const submitform = async (obj) => {
    console.log(obj);
    const res = await axios.post(`${BASE_URL}/teacher-api/register`, obj);
    console.log(res);
    if (
      res.data.message === "Student Profile Created" ||
      res.data.message === "Teacher Profile Created" ||
      res.data.message === "Admin Profile Created"
    ) {
      navigate("/signin");
    } else {
      setErr(res.data.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>
        {err.length !== 0 && <p className="error-message">{err}</p>}
        
        <form onSubmit={handleSubmit(submitform)}>
          {/* Radio Buttons for user type */}
          <div className="user-type-container">
            <label className="user-type-label">Register as</label>
            <div className="radio-buttons">
              <label className="radio-option">
                <input type="radio" value="Teacher" {...register("userType")} />
                <span>Teacher</span>
              </label>
              <label className="radio-option">
                <input type="radio" value="Student" {...register("userType")} />
                <span>Student</span>
              </label>
            </div>
          </div>

          {/* Username */}
          <div className="input-container">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              className="form-input"
              {...register("username")}
            />
          </div>

          {/* Password */}
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              {...register("password")}
            />
          </div>

          {/* Email */}
          <div className="input-container">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              {...register("email")}
            />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        
        

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="signin-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
