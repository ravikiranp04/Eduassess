import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../port";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PreviousTests() {
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.userLogin);
  const [allTests, setAllTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [teacherUsername, setTeacherUsername] = useState("");
  const [err, setErr] = useState(null);
  const token = sessionStorage.getItem("token");

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });


  useEffect(() => {
    const fetchTests = async () => {
      try {
        if (!token || !currentuser?.username) {
          setErr("Unauthorized or no user found");
          return;
        }

        const res = await axiosWithToken.get(
          `${BASE_URL}/student-api/display-prev-tests/${currentuser.username}`
        );

        if (res.data?.message === "Previous tests are") {
          setAllTests(res.data.payload.test_data || []);
          setFilteredTests(res.data.payload.test_data || []);
        } else {
          setAllTests([]);
          setFilteredTests([]);
        }
      } catch (error) {
        setErr("Failed to fetch previous tests");
        console.error(error);
      }
    };

    fetchTests();
  }, [currentuser?.username]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setTeacherUsername(input);
    
    if (input) {
      const filtered = allTests.filter((test) =>
        test.createdBy.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests(allTests);
    }
  };

  return (
    <div className="container mt-5" style={{
      background: "linear-gradient(135deg, #f8f9fa, #ddeefc)",
      minHeight: "100vh",
      padding: "20px",
      borderRadius: "10px"
    }}>
      <h2 className="text-center mb-4 fw-bold text-dark">📚 Previous Tests</h2>
      
      <h3 className="text-center text-primary mb-3">🔍 Search for Exam</h3>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control shadow-sm mb-3"
            placeholder="Enter Teacher's Username"
            value={teacherUsername}
            onChange={handleInputChange}
            style={{ borderRadius: "10px" }}
          />
        </div>
      </div>

      {err && <p className="text-danger text-center">{err}</p>}

      {filteredTests.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredTests.map((test) => (
            <div key={test.id} className="col">
              <div
                className="card border-0 shadow-lg test-card"
                style={{
                  borderRadius: "15px",
                  background: "linear-gradient(135deg, #ffffff, #e3e3e3)",
                  transition: "transform 0.3s ease-in-out"
                }}
              >
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold text-dark">{test.title}</h5>
                  <p className="card-text text-muted">{test.description}</p>
                  <hr />
                  <ul className="list-unstyled">
                    <li><span className="badge bg-primary">Created By:</span> <strong>{test.createdBy}</strong></li>
                    <li><span className="badge bg-secondary">Test Date:</span> <strong>{test.test_startdate} at {test.start_time}</strong></li>
                    <li><span className="badge bg-warning text-dark">Time Taken:</span> <strong>{test.time_taken} mins</strong></li>
                    <li><span className="badge bg-success">Marks Scored:</span> <strong>{test.marks_scored} / {test.total_marks}</strong></li>
                  </ul>
                  <button
                    className="btn btn-outline-dark w-100 mt-3"
                    style={{
                      borderRadius: "10px",
                      fontWeight: "bold",
                      background: "#28a745",
                      color: "white",
                      transition: "0.3s"
                    }}
                    onMouseOver={(e) => (e.target.style.background = "#218838")}
                    onMouseOut={(e) => (e.target.style.background = "#28a745")}
                    onClick={()=>navigate('../test-analysis',{state : test})}
                  >
                    🔍 View Analysis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <h4 className="text-secondary">No Tests Found!!!</h4>
        </div>
      )}
    </div>
  );
}

export default PreviousTests;
