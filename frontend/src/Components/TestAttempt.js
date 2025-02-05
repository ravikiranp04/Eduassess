import React, { useState, useEffect } from "react";
import "./CSS/Test.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../port";
import { useNavigate } from "react-router-dom";
function TestAttempt() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { state } = useLocation();
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [questions, setQuestions] = useState([]);
  const [autoExitStatus,setautoExitStatus]=useState(false)
  const { currentuser } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
  useEffect(() => {
    
    if (state && !questions.length) {
      setQuestions(state.questions);
    }

    const timer = setInterval(() => {
      const currentTime = new Date();
      const endTime = new Date(state.end_time);

      
      if (currentTime >= endTime || timeLeft <= 0) {
        handleSubmit(); 
        clearInterval(timer); 
      } else {
        setTimeLeft((prevTime) => prevTime - 1); 
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state, timeLeft, questions]);


  // Tab SWitiching
  useEffect(() => {
    let visibilityTimeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Tab is hidden. Submitting the test automatically.");

        
        visibilityTimeout = setTimeout(() => {
          setautoExitStatus(true); 
          handleSubmit();
        }, 0); 
      } else {
        console.log("Tab is visible again. Cancelling auto-submit.");
        clearTimeout(visibilityTimeout);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(visibilityTimeout);
      setautoExitStatus(false); 
    };
  }, []); 



  const handleOptionClick = (questionIndex, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
    setAttemptedQuestions((prev) => [...new Set([...prev, questionIndex])]);
  };

  const handleNextClick = () => {
    setVisitedQuestions((prev) => [...new Set([...prev, currentQuestion])]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBackClick = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSaveAndNextClick = () => {
    setVisitedQuestions((prev) => [...new Set([...prev, currentQuestion])]);
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion]:
        selectedOptions[currentQuestion] !== undefined
          ? selectedOptions[currentQuestion]
          : null, 
    }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleMarkForReview = () => {
    setMarkedQuestions((prev) => {
      const updatedMarks = [...prev];
      if (updatedMarks.includes(currentQuestion)) {
        return updatedMarks.filter((q) => q !== currentQuestion); 
      } else {
        return [...updatedMarks, currentQuestion]; 
      }
    });

    
    setVisitedQuestions((prev) => [...new Set([...prev, currentQuestion])]);

    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleClearClick = () => {
    
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion]: null, 
    }));
  };

  const handleSubmit = async () => {
    let correctAnswers = 0;
    let wrongAnswers = 0;

    
    const current = new Date();
    const endHours = String(current.getHours()).padStart(2, "0");
    const endMinutes = String(current.getMinutes()).padStart(2, "0");
    const endTime = `${endHours}:${endMinutes}`;
    state.end_time = endTime; 

    const [startHours, startMinutes] = state.start_time.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = current.getHours() * 60 + current.getMinutes();

    const timeTakenInMinutes = endTotalMinutes - startTotalMinutes;

    const minutes = Math.floor(timeTakenInMinutes);
    const seconds = current.getSeconds();

    
    const formattedTimeSpent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    
    questions.forEach((question, index) => {
      const selectedOption = selectedOptions[index]; 

     
      if (selectedOption != null) {
     
        if (selectedOption === +question.validity_answer) {
          correctAnswers++; // Increment correct answers count
        } else {
          wrongAnswers++; // Increment wrong answers count
        }
      }
      question.answer = selectedOption ? selectedOption : 0;
      question.attempt_status = selectedOption ? true : false;
    });

    let finalObj = { ...state };
    finalObj.username = currentuser.username;
    delete finalObj.students_attempted;
    delete finalObj.validity;
    delete finalObj.test_enddate;

    finalObj.time_taken = formattedTimeSpent; 
    finalObj.questions = questions;
    finalObj.marks_scored =
      correctAnswers * finalObj.pos_value - wrongAnswers * finalObj.neg_value;

    console.log(finalObj);
    console.log("Correct Answers: ", correctAnswers);
    console.log("Wrong Answers: ", wrongAnswers);

    //ending test
    let confirm = false;

    if (!autoExitStatus) {
      confirm = window.confirm("Confirm to Submit");
    }
    
    if (confirm || autoExitStatus) {
     
      const res = await axiosWithToken.post(
        `${BASE_URL}/student-api/end-test`,
        finalObj
      );
      if (res.data.message == "Test Ended Successfully") {
        navigate(`../studentdashboard`, {
          state: { message: res.data.message },
        });
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getCurrentDateTime = () => {
    const current = new Date();

    const date = `${String(current.getDate()).padStart(2, "0")}-${String(
      current.getMonth() + 1
    ).padStart(2, "0")}-${current.getFullYear()}`;
    const time = `${String(current.getHours()).padStart(2, "0")}:${String(
      current.getMinutes()
    ).padStart(2, "0")}`;

    return { date, time };
  };

  return !termsAccepted ? (
    <>
      <div className="terms-backdrop"></div>
      <div className="terms-modal">
        <div className="terms-header">Terms and Conditions</div>
        <div className="terms-content">
          <p>
            Before you start the test, please read and accept the terms and
            conditions below:
          </p>
          <ul>
            <li>You have {state.duration} minutes to complete this test.</li>
            <li>Make sure you answer all questions before submitting.</li>
            <li>Once submitted, the test cannot be retaken.</li>
            <li>Your performance will be evaluated based on your answers.</li>
          </ul>
          <p>Click "Accept" to proceed and start the test.</p>
        </div>
        <button
          className="terms-button"
          onClick={() => {
            setTermsAccepted(true);
            const { date, time } = getCurrentDateTime();
            state.start_time = time;
            state.test_startdate = date;
            console.log(`Test started on: ${date} at ${time}`);
          }}
        >
          Accept
        </button>
      </div>
    </>
  ) : (
    <div className="quiz-page">
      <header className="quiz-header">
        <h1>EduAssess</h1>
        <button
          type="submit"
          className="text-light btn btn-success"
          onClick={handleSubmit}
        >
          Submit Test
        </button>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </header>
      <main className="quiz-main">
        <div className="question-section">
          <div className="question-text">
            {questions[currentQuestion]?.question}
          </div>
          <div className="options">
            {[1, 2, 3, 4].map((optionIndex) => (
              <button
                key={optionIndex}
                className={`option-button ${
                  selectedOptions[currentQuestion] === optionIndex
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleOptionClick(currentQuestion, optionIndex)}
              >
                {questions[currentQuestion][`option_${optionIndex}`]}
              </button>
            ))}
          </div>
          <div className="navigation-buttons">
            {currentQuestion > 0 && (
              <button className="back-button" onClick={handleBackClick}>
                Back
              </button>
            )}
            <button
              className="save-next-button"
              onClick={handleSaveAndNextClick}
            >
              Save & Next
            </button>
            <button
              className="next-button"
              style={{ backgroundColor: "#a16da7" }}
              onClick={handleMarkForReview}
            >
              Mark For Review
            </button>
            {currentQuestion < questions.length - 1 && (
              <button className="next-button" onClick={handleNextClick}>
                Next
              </button>
            )}
            <button className="next-button" onClick={handleClearClick}>
              Clear
            </button>
          </div>
        </div>
        <aside className="quiz-sidebar">
          <div className="user-photo">
            <img
              src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
              alt="User"
              className="user-photo img"
            />
          </div>
          <div className="question-status">
            {questions.map((_, index) => {
              let statusClass = "not-visited"; // default class
              if (visitedQuestions.includes(index)) {
                if (markedQuestions.includes(index)) {
                  statusClass = "marked"; // purple
                } else if (selectedOptions[index] != null) {
                  statusClass = "selected"; // green
                } else {
                  statusClass = "visited"; // yellow
                }
              }
              return (
                <button
                  key={index}
                  className={`status-button ${statusClass}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="color-legend">
            <p>
              <span className="legend-box not-visited"></span> Not Visited
            </p>
            <p>
              <span className="legend-box visited"></span> Visited
            </p>
            <p>
              <span className="legend-box selected"></span> Answered
            </p>
            <p>
              <span className="legend-box marked"></span> Marked for Review
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default TestAttempt;
