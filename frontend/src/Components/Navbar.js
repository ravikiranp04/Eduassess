import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetState } from "../Redux/slices/userLoginSlice";
import vnrLogo from "./images/vnr logo.jpg";
import { CgProfile } from "react-icons/cg";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentuser, loginStatus, errorMessage } = useSelector(
    (state) => state.userLogin
  );
  const [user, setUser] = useState("");

  const upgradePack = () => {
    if (currentuser.userType === "Teacher") {
      navigate(`/teacher-profile/${currentuser.username}/upgrade`);
    } else if (currentuser.userType === "Student") {
      navigate(`/student-profile/${currentuser.username}/upgrade`);
    }
  };
  const logout = () => {
    // Remove token from browser storage
    sessionStorage.removeItem("token");
    // Reset state
    let actionobj = resetState();
    dispatch(actionobj);
    navigate("");
  };
  useEffect(() => {
    setUser(currentuser.plan_type);
  });

  return (
    <div className="navbar-container bg-dark text-white">
      {loginStatus === false ? (
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="logo">
            <img src={vnrLogo} alt="vnr Logo" />
            <h1 className="quizzone-heading">EduAssess</h1>
          </div>
          <div className="nav">
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/home">
                  Home
                </Link>
              </li>
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
          <div className="d-flex align-items-center gap-3 p-2 bg-light rounded shadow-sm">
            {/* Profile Image */}
            <img
              src="https://images.shiksha.com/mediadata/images/1687888767php162Hce.jpeg"
              alt="Profile"
              style={{ height: "50px", width: "50px", objectFit: "cover" }}
              className="rounded-circle border border-2"
            />

            {/* Welcome Message */}
            <p className="text-primary fw-bold mb-0 fs-6">
              Welcome,{" "}
              <span className="bg-warning px-2 py-1 rounded">
                {currentuser.username}
              </span>
            </p>

            {/* Profile Icon */}
            <CgProfile
              size={30}
              className="text-dark ms-auto cursor-pointer"
              onClick={() =>
                navigate(
                  `/${currentuser.userType.toLowerCase()}-profile/${
                    currentuser.username
                  }/profile-details`
                )
              }
            />
          </div>

          {currentuser.userType === "Teacher" &&
          currentuser.username === "admin" ? (
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/home">
                  Home
                </Link>
              </li>
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
                        <button
                          className="btn btn-success me-3"
                          onClick={upgradePack}
                        >
                          Subscribe
                        </button>
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
                  <Link className="nav-link text-white" to="/home">
                    Home
                  </Link>
                </li>
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
