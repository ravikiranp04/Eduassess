import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userLoginThunk } from "../Redux/slices/userLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import './CSS/Signin.css';
import { Link } from "react-router-dom";

function Signin() {
  const { currentuser, errorMessage, loginStatus } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { register, handleSubmit } = useForm();

  const submitform = (obj) => {
    console.log(obj);
    const actionobj = userLoginThunk(obj);
    dispatch(actionobj);
  };

  useEffect(() => {
    if (loginStatus === true && currentuser) {
      if (currentuser.userType === "Teacher" && currentuser.username === "admin") {
        navigate(`/admin-profile`);
      } else if (currentuser.userType === "Teacher") {
        navigate(`/teacher-profile/${currentuser.username}`);
      } else if (currentuser.userType === "Student") {
        navigate(`/student-profile/${currentuser.username}`);
      }
    }
  }, [navigate, loginStatus, currentuser]);

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Sign In</h2>
        
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
        <form onSubmit={handleSubmit(submitform)}>
          {/* Login as (radio buttons) */}
          <div className="user-type-container">
            <label className="user-type-label">Login as</label>
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

          <button type="submit" className="signin-btn">Login</button>
        </form>

        <div className="text-center mt-3">
          <p>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
          </p>
        </div>
        <div className="text-center mt-3">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
