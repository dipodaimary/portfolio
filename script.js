let questions = [];
let currentQuestionIndex = 0;

 



fetch('questions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Questions loaded:', data); // Add this line
    questions = data;
    organizeSections();
    displayTOC();
  })
  .catch(error => {
    console.error('Error loading questions:', error); // Add this line
  });





// Function to display a single question
function displayQuestion(index) {
  const container = document.getElementById('question-container');
  const question = questions[index];
  
  container.innerHTML = `
    <div class="question">
      <h2>${question.topic}</h2>
      <p>${question.question}</p>
      <div class="options">
        ${question.options.map((option, i) => `
          <label>
            <input type="radio" name="option" value="${i}">
            ${option}
          </label><br>
        `).join('')}
      </div>
      <button onclick="revealAnswer(${index})">Reveal Answer</button>
      <p id="answer-${index}" class="hidden">Correct Answer: ${question.options[question.correct]}<br>
      Explanation: ${question.explanation}</p>
    </div>
  `;
}

// Function to reveal the answer
function revealAnswer(index) {
  const answerElement = document.getElementById(`answer-${index}`);
  answerElement.classList.remove('hidden');
}

// Handle "Next Question" button
document.getElementById('next-question').addEventListener('click', () => {
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  displayQuestion(currentQuestionIndex);
});

// Handle "Show All Questions" button
document.getElementById('show-all').addEventListener('click', () => {
  const container = document.getElementById('question-container');
  container.innerHTML = questions.map((question, i) => `
    <div class="question">
      <h2>${question.topic}</h2>
      <p>${question.question}</p>
      <div class="options">
        ${question.options.map((option, i) => `
          <label>${option}</label><br>
        `).join('')}
      </div>
      <p>Correct Answer: ${question.options[question.correct]}<br>
      Explanation: ${question.explanation}</p>
    </div>
  `).join('');
});
