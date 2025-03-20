import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CSS/TestAnalysis.css"; // Import a separate CSS file for styling

function TestAnalysis() {
  const location = useLocation();
  const testdata = location.state;

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    if (testdata) {
      setQuestions(testdata.questions || []);
      setFilteredQuestions(testdata.questions || []);
    }
  }, [testdata]);

  useEffect(() => {
    setFilteredQuestions(
      questions.filter(
        (q) =>
          (subjectFilter === "All" || q.subject === subjectFilter) &&
          (difficultyFilter === "All" || q.difficulty === difficultyFilter)
      )
    );
  }, [subjectFilter, difficultyFilter, questions]);

  if (!testdata) {
    return <p>No Test data available</p>;
  }

  return (
    <div className="test-analysis-container">
      {/* Sidebar for Filters and Test Summary */}
      <aside className="sidebar">
        <div className="test-info">
          <h1>Test Analysis</h1>
          <h2>{testdata.title}</h2>
          <p>{testdata.Description}</p>
          <p>
            <strong>Score:</strong> {testdata.marks_scored} /{" "}
            {testdata.total_marks}
          </p>
          <p>
            <strong>Time Taken:</strong> {testdata.time_taken}
          </p>
        </div>
        <div className="filters">
          <label>Subject:</label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="All">All</option>
            {[...new Set(questions.map((q) => q.subject))].map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <label>Difficulty:</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </aside>

      {/* Main Content: Questions Section */}
      <main className="questions-container">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question, index) => (
            <div key={index} className="question-card">
              <div className="question-type">
                {question.question_type === "mcq" && (
                  <p>Single Correct Answer</p>
                )}
                {question.question_type === "fib" && <p>Fill in the blanks</p>}
                {question.question_type === "descp" && (
                  <p>Descriptive Question</p>
                )}
                {question.question_type === "num" && <p>Numerical answer</p>}
              </div>
              <div className="question-text">
                <h3>
                  Q{index + 1}: {question.question}
                </h3>
                <p>
                  <strong>Subject:</strong> {question.subject} |{" "}
                  <strong>SubType:</strong> {question.subtype} |{" "}
                  <strong>Difficulty:</strong> {question.difficulty}
                </p>
              </div>
              {/* Answer Section */}
              {question.question_type === "mcq" && (
                <div className="options">
                  <button
                    className={`option-button ${
                      question.answer === "mcq_op1" ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor:
                        question.answer === "mcq_op1"
                          ? question.validity_answer === "mcq_op1"
                            ? "green"
                            : "red"
                          : "white",
                    }}
                  >
                    {question.option_1}
                  </button>

                  <button
                    className={`option-button ${
                      question.answer === "mcq_op2" ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor:
                        question.answer === "mcq_op2"
                          ? question.validity_answer === "mcq_op2"
                            ? "green"
                            : "red"
                          : "white",
                    }}
                  >
                    {question.option_2}
                  </button>

                  <button
                    className={`option-button ${
                      question.answer === "mcq_op3" ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor:
                        question.answer === "mcq_op3"
                          ? question.validity_answer === "mcq_op3"
                            ? "green"
                            : "red"
                          : "white",
                    }}
                  >
                    {question.option_3}
                  </button>

                  <button
                    className={`option-button ${
                      question.answer === "mcq_op4" ? "selected" : ""
                    }`}
                    style={{
                      backgroundColor:
                        question.answer === "mcq_op4"
                          ? question.validity_answer === "mcq_op4"
                            ? "green"
                            : "red"
                          : "white",
                    }}
                  >
                    {question.option_4}
                  </button>
                </div>
              )}

              {question.question_type === "fib" ||
              question.question_type === "num" ? (
                <p>
                  Your Answer:
                  <span
                    style={{
                      color:
                        question.answer === question.validity_answer
                          ? "green"
                          : "red",
                    }}
                  >
                    {question.answer || "Not Attempted"}
                  </span>
                  <br />
                  Correct Answer:{" "}
                  <strong style={{ color: "green" }}>
                    {question.validity_answer}
                  </strong>
                </p>
              ) : null}
              {question.question_type === "descp" && (
                <p>
                  <strong>Your Response:</strong>{" "}
                  {question.answer || "Not Attempted"}
                  <br />
                  <strong>Expected Answer:</strong> {question.validity_answer}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </main>
    </div>
  );
}

export default TestAnalysis;
