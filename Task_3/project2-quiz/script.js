/**
 * Advanced Interactive Quiz App
 * State Management: We rely on a single source of truth for UI state.
 */

// 1. Data Structure: Array of question objects
const questions = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlink Text Markup Language"],
        answerIndex: 1
    },
    {
        question: "Which CSS property controls the text size?",
        options: ["font-style", "text-style", "font-size", "text-size"],
        answerIndex: 2
    },
    {
        question: "What does CSS stand for?",
        options: ["Colorful Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"],
        answerIndex: 2
    },
    {
        question: "How do you declare a JavaScript variable?",
        options: ["v carName;", "variable carName;", "var carName;", "None of the above"],
        answerIndex: 2
    },
    {
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answerIndex: 0
    }
];

// 2. State Variables
let currentQuestionIndex = 0;
let score = 0;
let hasAnsweredCurrent = false;

// 3. DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const feedbackMessage = document.getElementById('feedback-message');
const questionTracker = document.getElementById('question-tracker');
const progressBar = document.getElementById('progress-bar');
const quizContentDiv = document.querySelector('.quiz-content');
const resultsScreen = document.getElementById('results-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

/**
 * 4. Render Function - The core of UI updates
 * We clear the old DOM and inject new buttons based on the current state.
 */
function renderQuestion() {
    // Reset state for the new question
    hasAnsweredCurrent = false;
    nextBtn.style.display = 'none';
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';

    // Get current question object
    const currentQ = questions[currentQuestionIndex];

    // Update Header and Tracker
    questionText.textContent = currentQ.question;
    questionTracker.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    // Update Progress Bar
    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render Option Buttons
    optionsContainer.innerHTML = ''; // Clear previous options

    currentQ.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;

        btn.addEventListener('click', () => handleOptionClick(index, btn, currentQ.answerIndex));

        optionsContainer.appendChild(btn);
    });
}

/**
 * 5. Event Handlers
 */
function handleOptionClick(selectedIndex, clickedBtn, correctIndex) {
    if (hasAnsweredCurrent) return; // Prevent multiple clicks

    hasAnsweredCurrent = true;
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    // Disable all buttons to freeze state
    allBtns.forEach(b => b.disabled = true);

    // Evaluate Answer
    if (selectedIndex === correctIndex) {
        score++;
        clickedBtn.classList.add('correct');
        feedbackMessage.textContent = "Correct! 🎉";
        feedbackMessage.classList.add('success');
    } else {
        clickedBtn.classList.add('incorrect');
        // Highlight the correct answer for learning purposes
        allBtns[correctIndex].classList.add('correct');
        feedbackMessage.textContent = "Incorrect. Better luck next time!";
        feedbackMessage.classList.add('error');
    }

    // Show Next Button
    nextBtn.style.display = 'block';
}

function handleNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    // Hide main quiz content, show results screen
    quizContentDiv.style.display = 'none';
    resultsScreen.style.display = 'block';

    // Set progress bar to 100%
    progressBar.style.width = '100%';

    // Update Score
    finalScoreEl.textContent = score;
    const maxScore = document.querySelector('.score-max');
    maxScore.textContent = `/ ${questions.length}`;

    const resultMessage = document.getElementById('result-message');
    if (score === questions.length) {
        resultMessage.textContent = "Perfect score! You're a wizard! 🧙‍♂️";
    } else if (score >= questions.length / 2) {
        resultMessage.textContent = "Good job! You passed. 👍";
    } else {
        resultMessage.textContent = "Keep practicing! You'll get it next time. 📚";
    }
}

function restartQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;

    // Toggle UI views
    quizContentDiv.style.display = 'block';
    resultsScreen.style.display = 'none';

    // Re-render
    renderQuestion();
}

// 6. Init Event Listeners
nextBtn.addEventListener('click', handleNextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Start the quiz
renderQuestion();
