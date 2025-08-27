let questions = [];
let currentQuestionIndex = 0;

// Get the JSON file name and level from the query string
const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');
const level = urlParams.get('level');
const quizTitleMap = {
    './questions/intro_ml.json': 'Introduction to Machine Learning',
    './questions/knn.json': 'KNN',
    './questions/decisiontree.json': 'Decision Tree',
    './questions/dnn_cv.json': 'DNN Cross Validation',
    './questions/dnn_intro.json': 'Introduction to DNN',
    './questions/dnn_nlp.json': 'DNN for NLP',
    './questions/dual_kernels.json': 'Dual Kernels',
    './questions/embeddings.json': 'Embeddings',
    './questions/ensemble.json': 'Ensemble Methods',
    './questions/expect_max.json': 'Expectation Maximization',
    './questions/generalization.json': 'Generalization in ML',
    './questions/graphical_models.json': 'Graphical Models',
    './questions/linearreg.json': 'Linear Regression',
    './questions/logreg.json': 'Logistic Regression',
    './questions/misc.json': 'Miscellaneous Topics',
    './questions/optimization.json': 'Optimization Techniques',
    './questions/stat_decision_theory.json': 'Statistical Decision Theory',
    './questions/svm.json': 'Support Vector Machines'
};

// Update the quiz title
document.getElementById('quiz-title').textContent = quizTitleMap[file] || 'Quiz';

// Load questions from the JSON file
fetch(file)
  .then(response => response.json())
  .then(data => {
    let allQuestions = data.questions || data;
    // Filter questions by level if specified
    if (level) {
      questions = allQuestions.filter(question => question.level === level);
    } else {
      questions = allQuestions;
    }

    // Ensure questions are sorted by ID
    questions.sort((a, b) => a.id - b.id);

    // Display the first question
    if (questions.length > 0) {
      displayQuestion(currentQuestionIndex);
      displayQuestionIndex();
    } else {
      document.getElementById('question-container').innerHTML = '<p>No questions available for the selected level.</p>';
    }
  })
  .catch(error => console.error('Error loading questions:', error));

// Display the question index
function displayQuestionIndex() {
  const indexContainer = document.getElementById('question-index-container');
  indexContainer.innerHTML = ''; // Clear existing index
  questions.forEach((question, index) => {
    const button = document.createElement('button');
    button.textContent = index + 1;
    button.classList.add('link-button');
    if (index === currentQuestionIndex) {
      button.classList.add('active-question');
    }
    button.addEventListener('click', () => {
      currentQuestionIndex = index;
      displayQuestion(currentQuestionIndex);
      // Update active question in index
      const buttons = indexContainer.querySelectorAll('button');
      buttons.forEach((btn, i) => {
        if (i === currentQuestionIndex) {
          btn.classList.add('active-question');
        } else {
          btn.classList.remove('active-question');
        }
      });
    });
    indexContainer.appendChild(button);
  });
}

// Display the current question
function displayQuestion(index) {
  const question = questions[index];
  const questionText = document.getElementById('question-text');
  const optionsList = document.getElementById('options-list');
  const answer = document.getElementById('answer');
  const prevButton = document.getElementById('prev-question');
  const nextButton = document.getElementById('next-question');
  const showAnswerButton = document.getElementById('show-answer');

  // Update question text and options
  //questionText.textContent = `ID: ${question.id} - ${question.question}`;
  questionText.textContent = `${question.question}`;
  optionsList.innerHTML = question.options
    .map((option, i) => `<li data-option="${String.fromCharCode(65 + i)}">${option}</li>`)
    .join('');

  // Hide the answer initially
  answer.textContent = `Answer: ${question.correct.map(c => `${String.fromCharCode(65 + c)}) ${question.options[c]}`).join(", ")} - ${question.explanation}`;
  answer.classList.add('hidden');

  // Show/hide buttons based on question index
  showAnswerButton.classList.remove('hidden');
  prevButton.style.display = index > 0 ? 'inline' : 'none';
  nextButton.style.display = index < questions.length - 1 ? 'inline' : 'none';

  // Update active question in index
  const indexContainer = document.getElementById('question-index-container');
  const buttons = indexContainer.querySelectorAll('button');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('active-question');
    } else {
      btn.classList.remove('active-question');
    }
  });
}

// Event listeners for buttons
document.getElementById('show-answer').addEventListener('click', () => {
  document.getElementById('answer').classList.remove('hidden');
});

document.getElementById('prev-question').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
});

document.getElementById('next-question').addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
});

document.getElementById('back-to-toc').addEventListener('click', () => {
  window.location.href = './index.html';
});