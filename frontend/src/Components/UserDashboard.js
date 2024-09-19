import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../port';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdOutlinePreview } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
function UserDashboard() {
    const [teacherTests, setTeacherTests] = useState([]);
    const [err, setErr] = useState(null);
    const dispatch = useDispatch();
    const { currentuser } = useSelector((state) => state.userLogin);
    const navigate=useNavigate()
    const [messageStatus, setMessageStatus] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
    const token = sessionStorage.getItem('token');
    const axiosWithToken = axios.create({
        headers: { Authorization: `Bearer ${token}` }
    });
    const {state} = useLocation();
    const handleModify = async(test) => {
        //console.log('Modify test with id:', id);
        let res;
        if(test.validity==false){
          res=await axiosWithToken.put(`${BASE_URL}/teacher-api/activate/${test.createdBy}/${test.testid}/${test.createdBy}/Teacher`);
        }
        else{
          res=await axiosWithToken.put(`${BASE_URL}/teacher-api/deactivate/${test.createdBy}/${test.testid}`);
        }
        console.log(res)
        if(res.data.message==='test De-activated' || res.data.message==='test activated'){
          const res2 = await axiosWithToken.get(`${BASE_URL}/teacher-api/display-tests/${currentuser.username}`);
          if (res2.data.message === 'The created tests are') {
                    
            setTeacherTests(res2.data.payload);
          }
           else {
            setErr('No tests Created');
          }
           
        }
        else if(res.data.message==="Subscribe to Access"){
            setMessageStatus(res.data.message);
            setMessageVisible(true);
            setTimeout(() => setMessageVisible(false), 3000);
        }
        else{
          setErr("Please Try again")
        }
    };

    const handleDelete = async (id) => {
        //console.log('Delete test with id:', id);
        const confirmed = window.confirm("Are you sure you want to delete this test?");
        if(confirmed){
            const res= await axiosWithToken.delete(`${BASE_URL}/teacher-api/del-test/${id}`);
            if(res.data.message==='Test Deleted'){
                
                setTeacherTests(prevtests=>prevtests.filter((test)=>test.testid!=id))
            }
            setMessageStatus(res.data.message);
            setMessageVisible(true);
            setTimeout(() => setMessageVisible(false), 3000);
        }
       
    };

    const modifyTest=(test)=>{
      navigate(`../test-modify`,{state:test});
    }

    useEffect(() => {
        const stateVerify = async () => {
            if (state && state.message) {
              setMessageStatus(state.message);
              setMessageVisible(true);
              setTimeout(() => setMessageVisible(false), 3000); // Hide after 3 seconds
            }
          };
        const getTeacherTests = async () => {
            try {
                const res = await axiosWithToken.get(`${BASE_URL}/teacher-api/display-tests/${currentuser.username}`);
                console.log(res)
                console.log(res.data.message)
               
                if (res.data.message === 'The created tests are') {
                    
                    setTeacherTests(res.data.payload);
                } else {
                    setMessageStatus(state.message);
                    setMessageVisible(true);
                    setTimeout(() => setMessageVisible(false), 3000); // Hide after 3 seconds
                }
            } catch (error) {
                setErr('Error! Please Try Again!!');
                console.error(error);
            }
        };

        if (currentuser.userType === 'Teacher') {
            getTeacherTests();
            stateVerify();
        }
    }, [currentuser]);

    return (
        <div className="container my-4">
            {messageVisible && (
        <div className="alert alert-success">
          {messageStatus}
        </div>
      )}
            <div className='d-flex justify-content-around'>
            <button className="btn btn-success" onClick={()=>{navigate("../test-creation")}}>Create A Test</button>
            <Button variant="primary" onClick={()=>{navigate('../add-question')}}>Create a Question</Button>
            <Button variant="primary" onClick={()=>{navigate('../questions',{state:{num:1}})}}>My Questions</Button>
            </div>
            {err && <div className="alert alert-danger">{err}</div>}
            <Row>
                {teacherTests.length > 0 ? (
                    teacherTests.map(test => (
                        <Col key={test.id} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-light">
                                <Card.Body>
                                    <Card.Title>{test.title}</Card.Title>
                                    <Card.Text>{test.Description}</Card.Text>
                                    <ul className="list-unstyled">
                                        <li><strong>Created By:</strong> {test.createdBy}</li>
                                        <li><strong>Start Date:</strong> {test.test_startdate}</li>
                                        <li><strong>Start Time:</strong> {test.start_time}</li>
                                        <li><strong>End Date:</strong> {test.test_enddate}</li>
                                        <li><strong>End Time:</strong> {test.end_time} minutes</li>
                                        <li><strong>Duration:</strong> {test.duration}</li>
                                    </ul>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between">
                                  {
                                    test.validity==false?<Button 
                                    variant="success" 
                                    onClick={() => handleModify(test)}
                                >
                                    Enable
                                </Button>:
                                <Button 
                                variant="danger" 
                                onClick={() => handleModify(test)}
                            >
                                Disable
                            </Button>
                                  }
                                    
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleDelete(test.testid)}
                                    >
                                        Delete Test
                                    </Button>

                                    <FaEdit
                  className="mr-3 text-primary"
                  onClick={() => modifyTest(test)}
                  style={{ cursor: 'pointer', fontSize: '20px', margin: '1px' }}
                />
                <MdOutlinePreview className="mr-3" style={{ cursor: 'pointer', fontSize: '20px', margin: '1px' }}/>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No tests available.</p>
                )}
            </Row>
            <Outlet />
        </div>
    );
}

export default UserDashboard;
