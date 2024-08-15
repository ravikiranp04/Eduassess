import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userLoginThunk } from "../Redux/slices/userLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function Signin() {
  const { currentuser, errorMessage, loginStatus } = useSelector(state => state.userLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { register, handleSubmit } = useForm();

  const submitform = (obj) => {
    console.log(currentuser?.plan_type);
    console.log(obj);
    console.log(errorMessage);
    
    const actionobj = userLoginThunk(obj);
    dispatch(actionobj);
  };

  useEffect(() => {
    if (loginStatus === true && currentuser) {
      if (currentuser.userType === 'Teacher' && currentuser.username === 'admin') {
        navigate(`/admin-profile`);
      } else if (currentuser.userType === 'Teacher') {
        navigate(`/teacher-profile/${currentuser.username}`);
      } else if (currentuser.userType === 'Student') {
        navigate(`/student-profile/${currentuser.username}`);
      }
    }
  }, [navigate, loginStatus, currentuser]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-4 col-md-6 col-sm-6">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Signin</h2>
            </div>
            <div className="card-body">
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit(submitform)}>
                {/* radio */}
                <div className="mb-4">
                  <label
                    htmlFor="loginAs"
                    className="form-check-label me-5"
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--light-dark-grey)",
                    }}
                  >
                    Login as
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
                    className="form-control"
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
                    className="form-control"
                    id="password"
                    {...register("password")}
                  />
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn text-light d-block mx-auto"
                    style={{ backgroundColor: "var(--dark-maroon)" }}
                  >
                    Login
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

export default Signin;
