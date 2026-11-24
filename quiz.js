
let quizLanguage = "ta";
let currentQuestion = 0;
let quizScore = 0;
let quizAnswered = false;
let quizQuestions = [];

function startTNPSCQuiz(subject = "All") {
  if (typeof questionBank === "undefined" || !questionBank.length) {
    alert("Questions are not available.");
    return;
  }

  quizQuestions = subject === "All"
    ? [...questionBank]
    : questionBank.filter(q => q.subject === subject);

  if (!quizQuestions.length) {
    alert("No questions available for this subject.");
    return;
  }

  currentQuestion = 0;
  quizScore = 0;
  showTNPSCQuestion();
}

function showTNPSCQuestion() {
  const area = document.getElementById("content");
  const q = quizQuestions[currentQuestion];

  if (!q) return;

  quizAnswered = false;

  const lang = quizLanguage;
  const labels = {
    question: lang === "ta" ? "கேள்வி" : "Question",
    score: lang === "ta" ? "மதிப்பெண்" : "Score",
    choose: lang === "ta" ? "சரியான விடையைத் தேர்ந்தெடுக்கவும்" : "Choose the correct answer",
    submit: lang === "ta" ? "விடையைச் சரிபார்க்கவும்" : "Check Answer",
    next: lang === "ta" ? "அடுத்த கேள்வி" : "Next Question",
    correct: lang === "ta" ? "சரியான விடை!" : "Correct Answer!",
    wrong: lang === "ta" ? "தவறான விடை!" : "Incorrect Answer!",
    finish: lang === "ta" ? "தேர்வு முடிந்தது" : "Quiz Completed",
    home: lang === "ta" ? "முகப்புக்குத் திரும்பு" : "Back to Home"
  };

  area.innerHTML = `
    <div class="card">
      <h2>${labels.question} ${currentQuestion + 1}/${quizQuestions.length}</h2>
      <p>${labels.score}: ${quizScore}</p>
      <div style="background:#e5edf8;height:8px;border-radius:8px">
        <div style="background:#e3ad35;width:${(currentQuestion / quizQuestions.length) * 100}%;height:8px;border-radius:8px"></div>
      </div>
      <h3>${q.question[lang]}</h3>
      <p>${labels.choose}</p>
      <div id="quizOptions">
        ${q.options[lang].map((option, index) => `
          <button
            data-answer="${index}"
            style="display:block;width:100%;text-align:left;margin:9px 0;padding:15px">
            ${String.fromCharCode(65 + index)}. ${option}
          </button>
        `).join("")}
      </div>
      <div id="quizFeedback"></div>
      <button id="checkAnswer" class="primary">${labels.submit}</button>
    </div>
  `;

  let selectedAnswer = null;

  document.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => {
      if (quizAnswered) return;

      selectedAnswer = Number(button.dataset.answer);

      document.querySelectorAll("[data-answer]").forEach(b => {
        b.style.background = "#e5edf8";
      });

      button.style.background = "#d6e7ff";
    });
  });

  document.getElementById("checkAnswer").addEventListener("click", () => {
    if (quizAnswered) return;

    if (selectedAnswer === null) {
      alert(labels.choose);
      return;
    }

    quizAnswered = true;

    const correct = selectedAnswer === q.answer;

    if (correct) quizScore++;

    document.querySelectorAll("[data-answer]").forEach((button, index) => {
      button.disabled = true;
      button.style.background = index === q.answer
        ? "#c9efd7"
        : index === selectedAnswer
          ? "#ffd6d6"
          : "#e5edf8";
    });

    document.getElementById("quizFeedback").innerHTML = `
      <div style="background:#f2f5fa;padding:13px;border-radius:12px;margin-top:12px">
        <strong>${correct ? labels.correct : labels.wrong}</strong>
        <p>${q.explanation[lang]}</p>
      </div>
    `;

    const checkButton = document.getElementById("checkAnswer");

    if (currentQuestion + 1 < quizQuestions.length) {
      checkButton.textContent = labels.next;
      checkButton.onclick = nextTNPSCQuestion;
    } else {
      checkButton.textContent = labels.finish;
      checkButton.onclick = finishTNPSCQuiz;
    }
  });

  area.scrollIntoView({ behavior: "smooth" });
}

function nextTNPSCQuestion() {
  currentQuestion++;
  showTNPSCQuestion();
}

function finishTNPSCQuiz() {
  const total = quizQuestions.length;
  const percentage = Math.round((quizScore / total) * 100);

  const area = document.getElementById("content");

  area.innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:50px">🏆</div>
      <h2>${quizLanguage === "ta" ? "தேர்வு முடிந்தது!" : "Quiz Completed!"}</h2>
      <h1 style="color:#12345a">${quizScore}/${total}</h1>
      <h2>${percentage}%</h2>
      <p>${quizLanguage === "ta" ? "உங்கள் மதிப்பெண்" : "Your Score"}</p>
      <button class="primary" onclick="startTNPSCQuiz()">Try Again</button>
      <button style="width:100%;margin-top:10px" onclick="document.getElementById('content').innerHTML=''">
        Back to Home
      </button>
    </div>
  `;

  try {
    const previous = Number(localStorage.getItem("tnpscBestScore") || 0);
    if (percentage > previous) {
      localStorage.setItem("tnpscBestScore", percentage);
    }
  } catch (error) {
    console.log("Progress storage unavailable");
  }
}

function setTNPSCLanguage(language) {
  quizLanguage = language;
}
