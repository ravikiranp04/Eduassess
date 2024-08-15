import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../port";
import "./CSS/admin-dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { BsPencilSquare, BsEyeSlash } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

function Dashboard() {
  const [err, setErr] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubtypes, setSelectedSubtypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [messageStatus, setMessageStatus] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [filter, setFilter] = useState({
    easy: false,
    medium: false,
    hard: false,
  });
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stateVerify = async () => {
      if (state && state.message) {
        setMessageStatus(state.message);
        setMessageVisible(true);
        setTimeout(() => setMessageVisible(false), 3000); // Hide after 3 seconds
      }
    };

    const fetchData = async () => {
      try {
        const subjectsRes = await axios.get(
          `${BASE_URL}/admin-api/get-subjects`
        );
        if (subjectsRes.data.message === "Subjects are") {
          setSubjects(subjectsRes.data.payload);
        } else {
          setErr(subjectsRes.data.message);
        }

        const questionsRes = await axios.get(`${BASE_URL}/admin-api/prev-qs`);
        if (questionsRes.data.message === "Previous Questions are") {
          const questionsWithStatus = questionsRes.data.payload.map(
            (question) => ({
              ...question,
              display_status: true, // Assuming all questions are initially enabled
            })
          );
          setQuestions(questionsWithStatus);
        } else {
          setErr(questionsRes.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErr("Error fetching data. Please try again later.");
      }
    };

    stateVerify();
    fetchData();
  }, [state]);

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

  const handleDisableQuestion = async (question) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/admin-api/soft-del/${question.qs_id}`
      );
      if (res.data.message === "Question disabled") {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.qs_id === question.qs_id ? { ...q, display_status: false } : q
          )
        );
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error("Error disabling question:", error);
      setErr("Error disabling question. Please try again later.");
    }
  };

  const handleEnableQuestion = async (question) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/admin-api/enable/${question.qs_id}`
      );
      if (res.data.message === "Question Enabled") {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.qs_id === question.qs_id ? { ...q, display_status: true } : q
          )
        );
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error("Error enabling question:", error);
      setErr("Error enabling question. Please try again later.");
    }
  };

  const handleModifyQuestion = (question) => {
    navigate(`/admin-profile/add-question`, { state: question });
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: checked,
    }));
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

    return filteredQuestions.length > 0 ? (
      filteredQuestions.map((question, index) => (
        <div key={index} className="question-card mb-3 p-3 border">
          <h5>
            Subject: <span className="text-danger">{question.subject}</span>
          </h5>
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
                style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
              />
            )}
          </div>

          {/* Uploaded Image Preview */}
          <div className="mb-3">
            {question.imageFile && 
              <img
                src={question.imageFile}
                alt="Uploaded Image Preview"
                style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
       
              />
            }
          </div>

          <h4 className="h6">{question.question}</h4>
          <p>Option 1: {question.option_1}</p>
          <p>Option 2: {question.option_2}</p>
          <p>Option 3: {question.option_3}</p>
          <p>Option 4: {question.option_4}</p>
          <p>Correct Answer: {question.validity_answer}</p>
          <div className="d-flex justify-content-around">
            {question.display_status ? (
              <Button
                variant="secondary"
                className="mr-2 btn btn-danger"
                onClick={() => handleDisableQuestion(question)}
              >
                Disable <BsEyeSlash className="ml-1" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="mr-2 btn btn-success"
                onClick={() => handleEnableQuestion(question)}
              >
                Enable <BsEyeSlash className="ml-1" />
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => handleModifyQuestion(question)}
            >
              Modify <BsPencilSquare className="ml-1" />
            </Button>
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
        <div
          className="alert alert-success"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "1000",
          }}
        >
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
                  className="mr-2"
                />
                <label
                  htmlFor={`subject-${index}`}
                  className="m-0"
                  style={{ fontSize: "1rem" }}
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
                        className="mr-2"
                      />
                      <label
                        htmlFor={`subtype-${index}`}
                        className="m-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {subtype}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </Col>
        <Col sm={9} className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h5">Questions Overview</h3>
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
            </Form>
          </div>
          {renderQuestionsList()}
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
