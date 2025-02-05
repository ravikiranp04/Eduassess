import React, { useEffect } from 'react';
import './CSS/Home.css';

import createQuizImg from './images/question_14232189.png';
import takeQuizImg from './images/cards_6638715.png';
import getResultsImg from './images/customer-review_14785124.png';

function Home() {
  useEffect(() => {
    const startCountdown = (duration, display) => {
      let timer = duration, hours, minutes, seconds;
      const interval = setInterval(() => {
        hours = Math.floor(timer / 3600);
        minutes = Math.floor((timer % 3600) / 60);
        seconds = timer % 60;

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        if (display) {
          display.textContent = `${hours}:${minutes}:${seconds}`;
        }

        if (--timer < 0) {
          timer = duration; 
        }
      }, 1000);

      return () => clearInterval(interval); 
    };

    const countdownTimer = 3600; 
    const display = document.querySelector('#countdown-timer');
    if (display) {
      startCountdown(countdownTimer, display);
    }
  }, []);

  return (
    <div className='text-center rootlayout'>
      <section className="hero">
        <h2 className="welcome-heading">Welcome to EduAssess</h2>
        <p>Your gateway to interactive and engaging assessments for students and teachers alike.</p>
        <div className="cta-buttons">
          <a href="#start-quiz" className="cta-button">Start a Quiz</a>
          <a href="#create-quiz" className="cta-button">Create a Quiz</a>
          <a href="#learn-more" className="cta-button">Learn More</a>
        </div>

        <div className="search-section">
          <input type="text" placeholder="Search for quizzes or subjects" />
          <button className="search-button">Search</button>
        </div>

        <div className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <img src={createQuizImg} alt="Create Quiz" />
              <h3>Create a Quiz</h3>
              <p>Teachers can create quizzes with ease using our intuitive interface.</p>
            </div>
            <div className="step">
              <img src={takeQuizImg} alt="Take Quiz" />
              <h3>Students Take the Quiz</h3>
              <p>Students can access quizzes from any device at their convenience.</p>
            </div>
            <div className="step">
              <img src={getResultsImg} alt="Get Results" />
              <h3>Get Instant Feedback</h3>
              <p>Receive immediate results and detailed performance reports.</p>
            </div>
          </div>
        </div>

        <div className="popular-quiz">
          <h2>Featured Quiz: Math Fundamentals</h2>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <p>Thousands of students are mastering math with our top-rated quiz!</p>
        </div>

        <div className="features">
          <h2>Why Choose EduAssess?</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>Interactive Quizzes</h3>
              <p>Engage with quizzes that are designed to be fun and informative.</p>
            </div>
            <div className="feature-item">
              <h3>Custom Assessments</h3>
              <p>Create custom quizzes tailored to your specific needs and curriculum.</p>
            </div>
            <div className="feature-item">
              <h3>Detailed Analytics</h3>
              <p>Track progress and performance with detailed analytics and reports.</p>
            </div>
          </div>
        </div>

        <div className="countdown">
          <h2>Upcoming Features</h2>
          <p>Stay tuned for new and exciting features coming soon!</p>
          <div id="countdown-timer" className="countdown-timer"></div>
          <div className="countdown-labels">
            <div className="countdown-label">Hours</div>
            <div className="countdown-label">Minutes</div>
            <div className="countdown-label">Seconds</div>
          </div>
        </div>

        <section className="parallax">
          <div className="parallax-content">
            <h2>Transform Your Learning Experience</h2>
            <p>
              At QuizZone, we bridge the gap between traditional learning and modern technology.
              Our interactive quizzes, detailed analytics, and custom assessments empower teachers and
              students to take control of the learning process.
            </p>
            <a href="#learn-more" className="cta-button">Discover More</a>
          </div>
        </section>
      </section>

      <footer className="footer">
        <p>&copy; 2024 QuizZone. All rights reserved.</p>
        <p>
          <a href="https://www.quizbreaker.com/free-online-quizzes#beano" target="_blank">QuizBreaker</a> |
          <a href="https://www.beano.com/categories/emoji-quizzes" target="_blank">Emoji Quiz</a> |
          <a href="https://myquiz.org/" target="_blank">MyQuiz</a>
        </p>
        <p>
          <a href="https://www.techlearning.com/news/20-sites-for-creating-quizzes" target="_blank">
            20 Sites for Creating Quizzes
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Home;
