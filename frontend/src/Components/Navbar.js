import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetState } from "../Redux/slices/userLoginSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentuser, loginStatus, errorMessage } = useSelector(
    (state) => state.userLogin
  );
  const [user,setUser]=useState("");

  const upgradePack=()=>{
    if(currentuser.userType==='Teacher'){
      navigate(`/teacher-profile/${currentuser.username}/upgrade`);
    }
    else if(currentuser.userType==='Student'){
      navigate(`/student-profile/${currentuser.username}/upgrade`)
    }
  }

  const logout = () => {
    // Remove token from browser storage
    sessionStorage.removeItem("token");
    // Reset state
    let actionobj = resetState();
    dispatch(actionobj);
    navigate("");
  };
   useEffect(()=>{
    setUser(currentuser.plan_type);
   })

  return (
    <div className="navbar-container bg-dark text-white">
      {loginStatus === false ? (
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center">
            <img
              src="https://images.shiksha.com/mediadata/images/1687888767php162Hce.jpeg"
              alt="this image is not available"
              style={{ height: "40px", width: "40px" }}
              className="rounded-circle me-3"
            />
          </div>
          <div className="nav">
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/aboutus">
                  About us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signin">
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/signup">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center">
            <img
              src="https://images.shiksha.com/mediadata/images/1687888767php162Hce.jpeg"
              alt="this image is not available"
              style={{ height: "40px", width: "40px" }}
              className="rounded-circle me-3"
            />
            <p className="text-primary mb-0">
              Welcome <span className="bg-warning p-1 rounded">{currentuser.username}</span>
            </p>
          </div>
          {currentuser.userType === 'Teacher' && currentuser.username === 'admin' ? (
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="" onClick={logout}>
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            <div className="nav">
              <ul className="nav">
                {(() => {
                  switch (user) {
                    case 0:
                      return (
                        <button className="btn btn-success me-3" onClick={upgradePack}>Subscribe</button>
                      );
                    case 1:
                      return (
                        <button className="btn btn-primary me-3" disabled>
                          Basic Plan
                        </button>
                      );
                    case 3:
                      return (
                        <button className="btn btn-warning me-3" disabled>
                          Extended Plan
                        </button>
                      );
                    case 6:
                      return (
                        <button className="btn btn-danger me-3" disabled>
                          Super Saver Plan
                        </button>
                      );

                    default:
                      return null;
                  }
                })()}
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/aboutus">
                    About us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="" onClick={logout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
