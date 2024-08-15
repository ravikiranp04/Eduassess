import React, { useState, useEffect } from 'react';
import './CSS/Test.css';

function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const questions = [
    { question: "Question 1?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 2?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 3?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 4?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 5?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 6?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 7?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 8?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 9?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 10?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 11?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 12?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 13?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 14?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 15?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 16?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 17?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 18?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 19?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 20?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 21?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 22?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 23?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 24?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    { question: "Question 25?", options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    // Add more questions as needed
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      // Handle timeout logic here, e.g., auto-submit answers
    }
  }, [timeLeft]);

  const handleOptionClick = (questionIndex, optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleNextClick = () => {
    setVisitedQuestions(prev => [...new Set([...prev, currentQuestion])]);
    setCurrentQuestion(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handleSaveAndNextClick = () => {
    handleNextClick();
  };
  const handleSubmit = () => {
    // Handle the submission logic here
    console.log("Submitted Answers: ", selectedOptions);
    // You can add more logic here, such as sending the data to a server
  }; 

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <h1>Software Name</h1>
        <h2>Subject Name</h2>
        <button type="submit" className='text-light' onClick={handleSubmit}>Submit Test</button>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>

      </header>
      <main className="quiz-main">
        <div className="question-section">
          <div className="question-text">{questions[currentQuestion].question}</div>
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedOptions[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleOptionClick(currentQuestion, index)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="save-next-button" onClick={handleSaveAndNextClick}>Save & Next</button>
            <button className="next-button" onClick={handleNextClick}>Next</button>
          </div>
        </div>
        <aside className="quiz-sidebar">
          <div className="user-photo">
            <img src="user-photo-url.jpg" alt="User" />
          </div>
          <div className="question-status">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`status-button ${visitedQuestions.includes(index) ? (selectedOptions[index] != null ? 'selected' : 'not-selected') : 'not-visited'}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Test;
