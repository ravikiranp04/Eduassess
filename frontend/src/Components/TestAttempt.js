import React, { useState, useEffect, useRef } from "react";
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

  const [questions, setQuestions] = useState([]);
  const [autoExitStatus, setautoExitStatus] = useState(false);
  const { currentuser } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
  const [timeLeft, setTimeLeft] = useState((state?.duration || 25) * 60); // Convert minutes to seconds

  useEffect(() => {
    if (state && !questions.length) {
      setQuestions(state.questions);
    }

    if (!state?.end_time) return; // Prevent errors if end_time is missing

    const endTime = new Date(state.end_time);
    const currentTime = new Date();

    if (currentTime >= endTime || timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleSubmit();
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, questions]);

  // Tab SWitiching
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const visibilityTimeout = useRef(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Tab is hidden. Counting switch...");

        // ✅ Correctly use the latest tabSwitchCount
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;

          if (newCount > 3) {
            console.log("Exceeded max tab switches! Submitting test.");
            setautoExitStatus(true);
            handleAutoSubmit();
            return newCount;
          }

          alert(
            `Tab switching not allowed. Only ${3 - newCount} attempts left.`
          );
          return newCount;
        });

        // ✅ Use useRef correctly
        visibilityTimeout.current = setTimeout(() => {
          console.log("Stayed away for too long! Submitting test.");
          setautoExitStatus(true);
          handleAutoSubmit();
        }, 5000);
      } else {
        console.log("Tab is visible again. Cancelling auto-submit.");
        clearTimeout(visibilityTimeout.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(visibilityTimeout.current);
    };
  }, []);

  const handleOptionClick = (questionIndex, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: `mcq_op${optionIndex}`,
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
        if (selectedOption === question.validity_answer) {
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
    finalObj.test_completion = "Successful";
    console.log(finalObj);
    console.log("Correct Answers: ", correctAnswers);
    console.log("Wrong Answers: ", wrongAnswers);

    //ending test

    let confirm = window.confirm("Confirm to Submit");
    if (!confirm) return; // If the user cancels, stop execution

    const res = await axiosWithToken.post(
      `${BASE_URL}/student-api/end-test`,
      finalObj
    );
    if (res.data.message == "Test Ended Successfully") {
      navigate(`../studentdashboard`, {
        state: { message: res.data.message },
      });
    }
    console.log()
  };

  const handleAutoSubmit = async () => {
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
        if (selectedOption === question.validity_answer) {
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
    finalObj.test_completion = "Auto submitted due to Malpractice (Tab change)";
    console.log(finalObj);
    console.log("Correct Answers: ", correctAnswers);
    console.log("Wrong Answers: ", wrongAnswers);

    const res = await axiosWithToken.post(
      `${BASE_URL}/student-api/end-test`,
      finalObj
    );
    if (res.data.message == "Test Ended Successfully") {
      navigate(`../studentdashboard`, {
        state: { message: "Test Ended due to Tab Switch" },
      });
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
            <li>
              ⏳ You have <strong>{state.duration} minutes</strong> to complete
              this test.
            </li>
            <li>✅ Make sure you answer all questions before submitting.</li>
            <li>
              ⚠️ Once submitted, the test <strong>cannot be retaken.</strong>
            </li>
            <li>
              🚨 <strong>Tab Switching Rules:</strong>
              <ul>
                <li>
                  Allowed <strong>only 3 times.</strong>
                </li>
                <li>
                  Each switch must not exceed <strong>5 seconds.</strong>
                </li>
                <li>
                  If exceeded, the test will be <strong>auto-submitted.</strong>
                </li>
              </ul>
            </li>
            <li>
              📊 Your performance will be evaluated based on your answers.
            </li>
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
          <div>
            {questions[currentQuestion]?.question_type=="mcq" && <p>Single Correct Answer</p>}
            {questions[currentQuestion]?.question_type=="fib" && <p>Fill in the blanks</p>}
            {questions[currentQuestion]?.question_type=="descp" && <p>Descriptive Question</p>}
            {questions[currentQuestion]?.question_type=="num" && <p>Numerical answer</p>}
          </div>
          <div className="question-text">
            {questions[currentQuestion]?.question}
          </div>
          {questions[currentQuestion]?.question_type == "mcq" && (
            <div className="options">
              {[1, 2, 3, 4].map((optionIndex) => (
                <button
                  key={optionIndex}
                  className={`option-button ${
                    selectedOptions[currentQuestion] ===`mcq_op${optionIndex}`
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleOptionClick(currentQuestion, optionIndex)
                  }
                >
                  {questions[currentQuestion][`option_${optionIndex}`]}
                </button>
              ))}
            </div>
          )}

          {questions[currentQuestion]?.question_type === "fib" && (
            <input
              type="text"
              className="form-control"
              value={selectedOptions[currentQuestion] || ""}
              onChange={(e) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  [currentQuestion]: e.target.value,
                }))
              }
            />
          )}

          {questions[currentQuestion]?.question_type === "num" && (
            <input
              type="number"
              step="any"
              className="form-control"
              value={selectedOptions[currentQuestion] || ""}
              onChange={(e) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  [currentQuestion]: e.target.value,
                }))
              }
            />
          )}

          {questions[currentQuestion]?.question_type === "descp" && (
            <textarea
              className="form-control"
              rows={6}
              value={selectedOptions[currentQuestion] || ""}
              onChange={(e) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  [currentQuestion]: e.target.value,
                }))
              }
            />
          )}

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
