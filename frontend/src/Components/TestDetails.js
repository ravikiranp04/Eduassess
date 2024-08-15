import React, { useState } from 'react';
import './CSS/TestDetails.css';

function TestDetails() {
  const [assessmentId, setAssessmentId] = useState('');
  const [questionPaper, setQuestionPaper] = useState(null);

  const generateAssessmentId = () => {
    // Generate a unique assessment ID (for simplicity, using timestamp)
    setAssessmentId(`AID-${Date.now()}`);
  };

  const handleFileUpload = (event) => {
    setQuestionPaper(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., send data to the server)
    console.log('Assessment ID:', assessmentId);
    console.log('Question Paper:', questionPaper);
    alert('Assessment Created Successfully!');
  };

  const downloadTemplate = () => {
    // Implement the template download logic (static file or generate dynamically)
    const link = document.createElement('a');
    link.href = 'path-to-your-template-file/template.pdf';
    link.download = 'Question_Template.pdf';
    link.click();
  };

  return (
    <div className="assessment-creation-page text-center">
      <header className="assessment-creation-header">
        <h1> Assessment Creation</h1>
      </header>
      <main className="assessment-creation-main">
        <form className="assessment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="assessmentId">Assessment ID:</label>
            <input
              type="text"
              id="assessmentId"
              value={assessmentId}
              readOnly
            />
            <button type="button" onClick={generateAssessmentId}>
              Generate Assessment ID
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="questionPaper">Upload Question Paper:</label>
            <input
              type="file"
              id="questionPaper"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
          </div>
          <div className="form-group">
            <button type="button" onClick={downloadTemplate}>
              Download Question Template
            </button>
          </div>
          <div className="form-group">
            <button type="submit">Submit Assessment</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default TestDetails;
