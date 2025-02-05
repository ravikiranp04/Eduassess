import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../port';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
function StudentDashboard() {
  const [teacherUsername, setTeacherUsername] = useState('');
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableUsernames, setAvailableUsernames] = useState([
    'john'
  ]); // Simulated available usernames from a database
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const { currentuser } = useSelector((state) => state.userLogin);
  const {state} = useLocation();
  const token = sessionStorage.getItem('token');
    const axiosWithToken = axios.create({
        headers: { Authorization: `Bearer ${token}` }
    });
    const navigate=useNavigate()
  const [TC,setTC]=useState(false)
  const [messageStatus, setMessageStatus] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  
  useEffect(()=>{
    const stateVerify=()=>{
      if(state && state.message){
        setMessageStatus(state.message);
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 3000);
      }
    }
     const fetchUsersNames=async()=>{
        const res = await axiosWithToken.get(`${BASE_URL}/student-api/get-teachers`)
        if(res.data.message==='usernames are'){
            const x = res.data.payload
            setAvailableUsernames(x.filter(uname=>uname!=='admin'))
        }
     }
     fetchUsersNames();
     stateVerify();
  },[])

  const handleSearch = async (username) => {
    if (!username) {
      setError('Please select a valid username');
      return;
    }
    setError('');
    setIsLoading(true);
    setTeacherUsername(username);
    
    // Simulating fetching tests for the teacher from API
    setTimeout(async() => {
        //fetching tests by that teacher
      const res = await axiosWithToken.get(`${BASE_URL}/student-api/display-tests/${teacherUsername}`)
      console.log(res)
      if(res.data.message==='The created tests are'){
        setTests(res.data.payload); // Replace this with actual API call
      
      }
      else if(res.data.message==="No tests created"){
        setTests([])
      }
      setIsLoading(false);
      
    }, 1500);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setTeacherUsername(input);
    if (input.length > 0) {
      const filtered = availableUsernames.filter((username) =>
        username.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredUsernames(filtered);
    } else {
      setFilteredUsernames([]);
    }
  };

  const handleUsernameSelect = (username) => {
    setTeacherUsername(username);
    setFilteredUsernames([]);
    handleSearch(username); 
  };

  const handleTakeTest = async (test) => {
    
    
    console.log(test)
    const res = await axiosWithToken.get(`${BASE_URL}/student-api/start-test/${currentuser.username}/${test.createdBy}/${test.testid}/${currentuser.username}/Student`)
    console.log(res)
    if(res.data.message==='Test Started'){
      alert(`Taking test with ID: ${test.testid}`);
      navigate('../test-attempt',{state:res.data.payload})
    }
    else{
      setMessageStatus(res.data.message);
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 3000);
    }
    
  };

  return (
    <div className="container mt-5">
      {messageVisible && (
        <div className="alert alert-success">
          {messageStatus}
        </div>
      )}
    <h1 className="text-center text-primary mb-4">Search for the Exam</h1>

    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="input-group mb-3 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Teacher Username"
            value={teacherUsername}
            onChange={handleInputChange}
          />
          <button className="btn btn-primary" onClick={() => handleSearch(teacherUsername)}>
            Search
          </button>

          {/* Autocomplete Dropdown */}
          {filteredUsernames.length > 0 && (
            <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%' }}>
              {filteredUsernames.map((username) => (
                <li
                  key={username}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleUsernameSelect(username)}
                  style={{ cursor: 'pointer' }}
                >
                  {username}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading && <div className="text-center">Loading tests...</div>}
          </div>
      <div>
        {/* Tests displayed as cards */}
        {!isLoading && tests.length > 0 && (
          <div className="row mt-4">
            {tests.map((test) => (
              <div key={test.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{test.title}</h5>
                    <p className="card-text">{test.description}</p>
                    <ul className="list-unstyled">
                      <li><strong>Created By:</strong> {test.createdBy}</li>
                      <li><strong>Start Date:</strong> {test.test_startdate}</li>
                      <li><strong>Start Time:</strong> {test.start_time}</li>
                      <li><strong>End Date:</strong> {test.test_enddate}</li>
                      <li><strong>End Time:</strong> {test.end_time}</li>
                      <li><strong>Duration:</strong> {test.duration}</li>
                    </ul>
                    <button 
                      className="btn btn-success mt-3"
                      onClick={() => handleTakeTest(test)}
                    >
                      Take Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
    
  );
}

export default StudentDashboard;
