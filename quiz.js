
let quizLanguage = "ta";
let currentQuestion = 0;
let quizScore = 0;
let quizQuestions = [];
let quizAnswers = [];
let quizMode = "practice";
let quizTimeLeft = 600;
let quizTimer = null;

function startTNPSCQuiz(subject = "All", mode = "practice") {
  if (typeof questionBank === "undefined" || !questionBank.length) {
    alert("Questions are not available.");
    return;
  }

  quizQuestions = subject === "All"
    ? [...questionBank]
    : questionBank.filter(q => q.subject === subject);

  if (!quizQuestions.length) {
    alert("No questions available.");
    return;
  }

  clearInterval(quizTimer);

  quizMode = mode;
  currentQuestion = 0;
  quizScore = 0;
  quizAnswers = new Array(quizQuestions.length).fill(null);
  quizTimeLeft = mode === "mock" ? 600 : 0;

  renderTNPSCExam();

  if (mode === "mock") {
    quizTimer = setInterval(() => {
      quizTimeLeft--;

      const timer = document.getElementById("tnpscTimer");

      if (timer) {
        timer.textContent = formatQuizTime(quizTimeLeft);
      }

      if (quizTimeLeft <= 0) {
        finishTNPSCExam();
      }
    }, 1000);
  }
}

function formatQuizTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return String(minutes).padStart(2, "0") +
    ":" + String(remaining).padStart(2, "0");
}

function renderTNPSCExam() {
  const area = document.getElementById("content");
  const q = quizQuestions[currentQuestion];
  const lang = quizLanguage;

  if (!area || !q) return;

  const ta = lang === "ta";

  area.innerHTML = `
    <div class="card">
      <h2>${quizMode === "mock" ? "📝 " + (ta ? "மாதிரித் தேர்வு" : "Mock Examination") : "📚 " + (ta ? "பயிற்சித் தேர்வு" : "Practice Quiz")}</h2>

      ${quizMode === "mock" ? `
        <div style="background:#fff0d5;padding:12px;border-radius:10px">
          ⏱️ ${ta ? "மீதமுள்ள நேரம்" : "Time Remaining"}:
          <strong id="tnpscTimer">${formatQuizTime(quizTimeLeft)}</strong>
        </div>
      ` : ""}

      <p>${ta ? "கேள்வி" : "Question"} ${currentQuestion + 1} / ${quizQuestions.length}</p>

      <div style="background:#e5edf8;height:8px;border-radius:8px">
        <div style="background:#e3ad35;width:${((currentQuestion + 1) / quizQuestions.length) * 100}%;height:8px;border-radius:8px"></div>
      </div>

      <h3>${q.question[lang]}</h3>

      <p>${ta ? "விடையைத் தேர்வு செய்யவும்" : "Select your answer"}</p>

      <div id="tnpscOptions">
        ${q.options[lang].map((option, index) => `
          <button data-answer="${index}"
            style="display:block;width:100%;text-align:left;margin:8px 0;padding:14px;background:${quizAnswers[currentQuestion] === index ? "#d6e7ff" : "#e5edf8"}">
            ${String.fromCharCode(65 + index)}. ${option}
          </button>
        `).join("")}
      </div>

      <div class="section-title">${ta ? "கேள்விகள்" : "Question Navigation"}</div>

      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:7px" id="tnpscNavigation">
        ${quizQuestions.map((item,index) => `
          <button data-nav="${index}"
            style="background:${index === currentQuestion ? "#e3ad35" : quizAnswers[index] !== null ? "#c9efd7" : "#e5edf8"}">
            ${index + 1}
          </button>
        `).join("")}
      </div>

      <div style="display:flex;gap:8px;margin-top:18px">
        <button id="tnpscPrevious" style="flex:1">← ${ta ? "முந்தைய" : "Previous"}</button>
        <button id="tnpscNext" class="primary" style="flex:1;margin:0">${ta ? "அடுத்தது" : "Next"} →</button>
      </div>

      <button id="tnpscFinish" style="width:100%;margin-top:12px;background:#f8dddd;color:#a32121">
        ${ta ? "தேர்வை முடிக்கவும்" : "Submit Examination"}
      </button>
    </div>
  `;

  document.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => {
      quizAnswers[currentQuestion] = Number(button.dataset.answer);
      renderTNPSCExam();
    });
  });

  document.querySelectorAll("[data-nav]").forEach(button => {
    button.addEventListener("click", () => {
      currentQuestion = Number(button.dataset.nav);
      renderTNPSCExam();
    });
  });

  document.getElementById("tnpscPrevious").onclick = () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderTNPSCExam();
    }
  };

  document.getElementById("tnpscNext").onclick = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion++;
      renderTNPSCExam();
    }
  };

  document.getElementById("tnpscFinish").onclick = () => {
    const unanswered = quizAnswers.filter(a => a === null).length;

    if (unanswered > 0 &&
        !confirm(ta
          ? unanswered + " கேள்விகளுக்கு விடையளிக்கவில்லை. முடிக்கலாமா?"
          : unanswered + " questions are unanswered. Submit anyway?")) {
      return;
    }

    finishTNPSCExam();
  };

  area.scrollIntoView({ behavior: "smooth" });
}

function finishTNPSCExam() {
  clearInterval(quizTimer);

  quizScore = quizQuestions.reduce((score, question, index) => {
    return score + (quizAnswers[index] === question.answer ? 1 : 0);
  }, 0);

  const total = quizQuestions.length;
  const percentage = Math.round((quizScore / total) * 100);
saveTNPSCResult(quizScore, total);
  const ta = quizLanguage === "ta";

  try {
    const oldBest = Number(localStorage.getItem("tnpscBestScore") || 0);

    if (percentage > oldBest) {
      localStorage.setItem("tnpscBestScore", percentage);
    }
  } catch (e) {}

  const area = document.getElementById("content");

  area.innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:55px">🏆</div>
      <h2>${ta ? "தேர்வு முடிந்தது!" : "Examination Completed!"}</h2>
      <h1 style="font-size:42px;color:#12345a">${quizScore}/${total}</h1>
      <h2>${percentage}%</h2>
      <p>${ta ? "உங்கள் மதிப்பெண்" : "Your Score"}</p>
      <p>${ta ? "சரியான விடைகள்" : "Correct Answers"}: ${quizScore}</p>
      <p>${ta ? "தவறான / விடையளிக்காத கேள்விகள்" : "Incorrect / Unanswered"}: ${total - quizScore}</p>

      <h3>${ta ? "விடை விளக்கங்கள்" : "Answer Explanations"}</h3>

      ${quizQuestions.map((q,index) => `
        <div style="text-align:left;background:#f2f5fa;padding:12px;border-radius:10px;margin:10px 0">
          <strong>${index + 1}. ${q.question[quizLanguage]}</strong>
          <p>${ta ? "சரியான விடை" : "Correct Answer"}: ${q.options[quizLanguage][q.answer]}</p>
          <p>${q.explanation[quizLanguage]}</p>
        </div>
      `).join("")}

      <button class="primary" onclick="startTNPSCQuiz('All','${quizMode}')">
        ${ta ? "மீண்டும் தேர்வு எழுதவும்" : "Try Again"}
      </button>

      <button style="width:100%;margin-top:10px" onclick="document.getElementById('content').innerHTML=''">
        ${ta ? "முகப்புக்குத் திரும்பு" : "Back to Home"}
      </button>
    </div>
  `;

  area.scrollIntoView({ behavior: "smooth" });
}

function setTNPSCLanguage(language) {
  quizLanguage = language;

  if (quizQuestions.length &&
      document.getElementById("tnpscOptions")) {
    renderTNPSCExam();
  }
}
