import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../port";
import "./CSS/admin-dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Form, Dropdown } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
function TestCreation() {
  const [err, setErr] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubtypes, setSelectedSubtypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [messageStatus, setMessageStatus] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [testEditStatus,setTestEditStatus]=useState(false)
  const [filter, setFilter] = useState({
    easy: false,
    medium: false,
    hard: false,
  });
  const [User,setUser]=useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("Admin Questions");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });
  const { currentuser } = useSelector((state) => state.userLogin);

  const { state } = useLocation();
  const navigate = useNavigate();

  const [today] = useState(new Date().toISOString().split("T")[0]); // Get today's date in 'YYYY-MM-DD' format
  const startDate = watch("test_startdate");
  useEffect(() => {
    let isMounted = true;
  
    const stateVerify = async () => {
      if (state && isMounted) {
        setTestEditStatus(true);
        setSelectedQuestions(state.questions);
        setValue("title", state.title);
      setValue("Description", state.Description);
      setValue("test_startdate", state.test_startdate);
      setValue("start_time", state.start_time);
      setValue("test_enddate", state.test_enddate);
      setValue("end_time", state.end_time);
      setValue("duration", state.duration);
      setValue("pos_value", state.pos_value);
      setValue("neg_value", state.neg_value);
    }
    }
  
  
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin-api/get-subjects`);
        if (isMounted) {
          if (response.data.message === "Subjects are") {
            setSubjects(response.data.payload);
          } else {
            setErr(response.data.message);
          }
        }
      } catch (error) {
        if (isMounted) {
          setErr("Error fetching data. Please try again later.");
        }
      }
    };
  
    stateVerify();
    fetchSubjects();
    handleDropdownChange(dropdownValue);
  
    return () => { isMounted = false; }; // Cleanup function
  }, [state, dropdownValue]);
  

  const handleSubjectChange = (event, selectedSub) => {
    if (event.target.checked) {
      setSelectedSubject(selectedSub);
      setSelectedSubtypes([]);
    } else {
      setSelectedSubject(null);
      setSelectedSubtypes([]);
    }
  };

  const handleSubtypeChange = (event, subtype) => {
    if (event.target.checked) {
      setSelectedSubtypes((prev) => [...prev, subtype]);
    } else {
      setSelectedSubtypes((prev) => prev.filter((sub) => sub !== subtype));
    }
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: checked,
    }));
  };

  const onSubmit = async(data) => {
    if(!testEditStatus){
      data.testid= Date.now()
      data.createdBy = currentuser.username
      data.questions=selectedQuestions
      data.validity=false
      data.students_attempted=[]
      data.total_marks = (selectedQuestions.length)*data.pos_value
      console.log(data)
      const res = await axiosWithToken.post(`${BASE_URL}/teacher-api/create-test/${currentuser.username}/Teacher`,data);
      console.log(res);
      if(res){
        navigate("../userdashboard",{state:{message:res.data.message}})
      }
    }
    else{
      data.testid= state.testid
      data.createdBy = state.createdBy
      data.questions=selectedQuestions
      data.validity=false
      data.students_attempted=state.students_attempted
      data.total_marks = (selectedQuestions.length)*data.pos_value
      console.log(data)
      const res = await axiosWithToken.put(`${BASE_URL}/teacher-api/modify-test/${data.createdBy}/Teacher`,data);
      console.log(res);
      if(res){
        navigate("../userdashboard",{state:{message:res.data.message}})
      }
    }
    

  };

  const handleModifyQuestion = (question) => {
    navigate(`../add-question`, { state: question });
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.some(q => q.qs_id === question.qs_id)) {
        return prevSelected.filter((q) => q.qs_id !== question.qs_id);
      } else {
        return [...prevSelected, question];
      }
    });
  };
  
  

  const handleDropdownChange = async (value) => {
    setDropdownValue(value);
    if (value === "Admin Questions") {
      await fetchAdminQuestions();
    } else if (value === "My Previous Questions") {
      await fetchTeacherQuestions();
    }
  };

  const fetchAdminQuestions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/teacher-api/prev-qs-admin`);
      //console.log(response)
      if (response.data.message === "Previous Questions are") {
        setQuestions(response.data.payload);
        setUser(0)
      } else {
        setErr(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching admin questions:", error);
      setErr("Error fetching data. Please try again later.");
    }
  };

  const fetchTeacherQuestions = async () => {
    try {
      const response = await axiosWithToken.get(
        `${BASE_URL}/teacher-api/prev-qs/${currentuser.username}`
      );
      setQuestions(response.data.payload);
      setUser(1)
    } catch (error) {
      console.error("Error fetching teacher questions:", error);
      setErr("Error fetching data. Please try again later.");
    }
  };

  const renderQuestionsList = () => {
    let filteredQuestions = questions;

    if (selectedSubject) {
      filteredQuestions = filteredQuestions.filter(
        (question) => question.subject === selectedSubject
      );
    }

    if (selectedSubtypes.length > 0) {
      filteredQuestions = filteredQuestions.filter((question) =>
        selectedSubtypes.includes(question.sub_type)
      );
    }

    if (filter.easy || filter.medium || filter.hard) {
      filteredQuestions = filteredQuestions.filter((question) => {
        if (filter.easy && question.difficulty === "Easy") return true;
        if (filter.medium && question.difficulty === "Medium") return true;
        if (filter.hard && question.difficulty === "Hard") return true;
        return false;
      });
    }

    if (questionSearch) {
      filteredQuestions = filteredQuestions.filter((question) =>
        question.question.toLowerCase().includes(questionSearch.toLowerCase())
      );
    }

    return filteredQuestions.length > 0 ? (
      filteredQuestions.map((question, index) => (
        <div key={index} className="question-card mb-3 p-3 d-flex">
          <div style={{width:'80%'}}>
          
          <div className="d-flex align-items-center mb-3">
            <h5>
              Subject: <span className="text-danger">{question.subject}</span>
            </h5>
          </div>
          <h5>
            Sub Type: <span className="text-danger">{question.sub_type}</span>
          </h5>
          <h5>
            Difficulty:{" "}
            <span className="text-primary">{question.difficulty}</span>
          </h5>

          {/* Image URL Preview */}
          <div className="mb-3">
            {question.img && (
              <img
                src={question.img}
                alt="Image URL Preview"
                className="img-fluid"
              />
            )}
          </div>

          {/* Uploaded Image Preview */}
          <div className="mb-3">
            {question.imageFile && 
              <img
                src={question.imageFile}
                alt="Uploaded Image Preview"
                className="img-fluid"
              />
            }
          </div>

          <h4 className="h6">{question.question}</h4>
          <p>Option 1: {question.option_1}</p>
          <p>Option 2: {question.option_2}</p>
          <p>Option 3: {question.option_3}</p>
          <p>Option 4: {question.option_4}</p>
          <p>Correct Answer: {question.validity_answer}</p>
          {User==1 && !testEditStatus && <div className="d-flex justify-content-around">
            <Button
              variant="primary"
              onClick={() => handleModifyQuestion(question)}
            >
              Modify <BsPencilSquare className="ml-1" />
            </Button>
          </div>}
          </div>
          <div className="d-flex align-items-center" style={{width:'20%'}}>
          <input
              type="checkbox"
              checked={selectedQuestions.some((q) => q.qs_id === question.qs_id)}
              onChange={() => handleQuestionSelect(question)}
              className="mr-2 mx-auto" style={{width:'25px',height:'25px'}}
            />
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-muted mt-5">No questions found.</div>
    );
  };

  return (
    <Container fluid>
      {messageVisible && (
        <div className="alert alert-success">
          {messageStatus}
        </div>
      )}
      <Row>
        <Col
          sm={3}
          className="bg-light p-3 sticky-top"
          style={{ maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}
        >
          <h3 className="h5 text-center mb-4">Sort By Subjects</h3>
          <div className="subject-list">
            {subjects.map((sub, index) => (
              <div
                key={index}
                className="subject-item d-flex justify-content-between align-items-center my-2"
              >
                <input
                  type="checkbox"
                  value={sub.subject}
                  checked={selectedSubject === sub.subject}
                  onChange={(e) => handleSubjectChange(e, sub.subject)}
                  id={`subject-${index}`}
                />
                <label
                  htmlFor={`subject-${index}`}
                  className="m-0"
                >
                  {sub.subject}
                </label>
              </div>
            ))}
          </div>
          {selectedSubject && (
            <div className="subtypes-section mt-4">
              <h4 className="h6">Sort By SubTypes</h4>
              <div className="subtype-list">
                {subjects
                  .find((sub) => sub.subject === selectedSubject)
                  ?.subtypes.map((subtype, index) => (
                    <div
                      key={index}
                      className="subtype-item d-flex justify-content-between align-items-center my-2"
                    >
                      <input
                        type="checkbox"
                        value={subtype}
                        checked={selectedSubtypes.includes(subtype)}
                        onChange={(e) => handleSubtypeChange(e, subtype)}
                        id={`subtype-${index}`}
                      />
                      <label
                        htmlFor={`subtype-${index}`}
                        className="m-0"
                      >
                        {subtype}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div>
          
    <Dropdown className="m-2">
      <Dropdown.Toggle variant="secondary">
        {dropdownValue}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleDropdownChange("Admin Questions")}>
          Admin Questions
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleDropdownChange("My Previous Questions")}>
          My Questions
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
          </div>
        </Col>
        <Col sm={9} className="p-3">
          {/* New Test Details Form */}
          <Form onSubmit={handleSubmit(onSubmit)} className="mb-4">
  <h3 className="h5 mb-3">Test Details</h3>
  <Form.Group controlId="testTitle">
    <Form.Label>Title</Form.Label>
    <Form.Control
      type="text"
      placeholder="Enter title"
      {...register("title", { required: "Title is required" })}
      defaultValue={testEditStatus?state.title:null}
    />
    {errors.title && <span className="text-danger">{errors.title.message}</span>}
  </Form.Group>
  <Form.Group controlId="testDescription" className="mt-3">
    <Form.Label>Description</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      placeholder="Enter description"
      {...register("Description", { required: "Description is required" })}
      defaultValue={testEditStatus?state.Description:null}
    />
    {errors.Description && <span className="text-danger">{errors.Description.message}</span>}
  </Form.Group>
  <Form.Group controlId="test_startdate" className="mt-3">
    <Form.Label>Start Date</Form.Label>
    <Form.Control
      type="date"
      {...register("test_startdate", { required: " Start Date is required" ,validate: (value) => value >= today || "Start date must be in the future",})}
      defaultValue={testEditStatus?state.test_startdate:null}
    />
    {errors.test_startdate && <span className="text-danger">{errors.test_startdate.message}</span>}
  </Form.Group>
  <Form.Group controlId="testStartTime" className="mt-3">
    <Form.Label>Start Time</Form.Label>
    <Form.Control
      type="time"
      {...register("start_time", { required: "Start Time is required" })}
      defaultValue={testEditStatus?state.start_time:null}
    />
    {errors.start_time && <span className="text-danger">{errors.start_time.message}</span>}
  </Form.Group>
  <Form.Group controlId="test_enddate" className="mt-3">
    <Form.Label>Date</Form.Label>
    <Form.Control
      type="date"
      {...register("test_enddate", { required: "End Date is required",validate: (value) =>
        value > startDate || "End date must be after the start date", })}
        defaultValue={testEditStatus?state.test_enddate:null}  
    />
    {errors.test_enddate && <span className="text-danger">{errors.test_enddate.message}</span>}
  </Form.Group>
  <Form.Group controlId="testEndTime" className="mt-3">
    <Form.Label>End Time</Form.Label>
    <Form.Control
      type="time"
      {...register("end_time", { required: "End Time is required" })}
      defaultValue={testEditStatus?state.end_time:null}
    />
    {errors.end_time && <span className="text-danger">{errors.end_time.message}</span>}
  </Form.Group>
  <Form.Group controlId="testDuration" className="mt-3">
    <Form.Label>Duration (minutes)</Form.Label>
    <Form.Control
      type="number"
      placeholder="Enter duration"
      {...register("duration", { required: "Duration is required", valueAsNumber: true })}
      defaultValue={testEditStatus?state.duration:null}
    />
    {errors.duration && <span className="text-danger">{errors.duration.message}</span>}
  </Form.Group>

  {/* New fields for positive and negative marking */}
  <Form.Group controlId="testPositiveMarking" className="mt-3">
    <Form.Label>Positive Marking</Form.Label>
    <Form.Control
      type="number"
      placeholder=">=0"
      min="0"
      step="0.01"
      {...register("pos_value", { required: "Positive marking is required", valueAsNumber: true,validate:value => value>=0 || "Out of Range" })}
      defaultValue={testEditStatus?state.pos_value:null}
    />
    {errors.pos_value && <span className="text-danger">{errors.pos_value.message}</span>}
  </Form.Group>
  <Form.Group controlId="testNegativeMarking" className="mt-3">
    <Form.Label>Negative Marking</Form.Label>
    <Form.Control
      type="number"
      placeholder="<=0"
      max="0"
      step="0.01"
      {...register("neg_value", { required: "Negative marking is required", valueAsNumber: true,validate:value => value<=0 || "Out of Range" })}
      defaultValue={testEditStatus?state.neg_value:null}
    />
    {errors.neg_value && <span className="text-danger">{errors.neg_value.message}</span>}
  </Form.Group>
  <div className="d-flex justify-content-around">
  {
    testEditStatus?<Button variant="primary" type="submit" className="m-2">
    Modify Test
  </Button>:  <Button variant="primary" type="submit" className="m-2">
      Save Test
    </Button>
  }

    {User==1 && !testEditStatus && <button className="btn btn-success" onClick={()=>{navigate("../test-creation")}}>Create A Test</button>}
  </div>

  
</Form>

{/* Filter and Questions List */}
<div className="mb-4">
  <h3 className="h2 mb-3">Select Questions</h3>
  <Form>
    <Form.Check
      inline
      label="Easy"
      type="checkbox"
      id="easyCheckbox"
      name="easy"
      checked={filter.easy}
      onChange={handleFilterChange}
    />
    <Form.Check
      inline
      label="Medium"
      type="checkbox"
      id="mediumCheckbox"
      name="medium"
      checked={filter.medium}
      onChange={handleFilterChange}
    />
    <Form.Check
      inline
      label="Hard"
      type="checkbox"
      id="hardCheckbox"
      name="hard"
      checked={filter.hard}
      onChange={handleFilterChange}
    />
    <Form.Control
              type="text"
              placeholder="Search in questions..."
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              style={{ maxWidth: '300px', marginLeft: '10px' }}
            />
      <div className="d-flex justify-content-around align-items-center mt-3">
    
  </div>
  </Form>
</div>

         

          {/* Render Questions List */}
          <div className="questions-section">
            {renderQuestionsList()}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TestCreation;
