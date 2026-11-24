
function saveTNPSCResult(score, total) {
  try {
    let data = JSON.parse(
      localStorage.getItem("tnpscProgress") || "{}"
    );

    data.tests = (data.tests || 0) + 1;
    data.questions = (data.questions || 0) + total;
    data.correct = (data.correct || 0) + score;
    data.best = Math.max(data.best || 0, score);

    localStorage.setItem(
      "tnpscProgress",
      JSON.stringify(data)
    );
  } catch (e) {
    console.log("Progress could not be saved");
  }
}

function openTNPSCProgress() {
  const area = document.getElementById("content");

  let data = {};

  try {
    data = JSON.parse(
      localStorage.getItem("tnpscProgress") || "{}"
    );
  } catch (e) {}

  const tests = data.tests || 0;
  const questions = data.questions || 0;
  const correct = data.correct || 0;
  const best = data.best || 0;

  const accuracy = questions
    ? Math.round(correct / questions * 100)
    : 0;

  const lang =
    localStorage.getItem("tnpscLanguage") || "ta";

  area.innerHTML = `
    <div class="card">
      <h2>📊 ${lang === "ta"
        ? "எனது கற்றல் முன்னேற்றம்"
        : "My Learning Progress"}</h2>

      <div class="grid">
        <div class="item">
          <div class="emoji">📝</div>
          <h2>${tests}</h2>
          <p>${lang === "ta" ? "தேர்வுகள்" : "Tests Completed"}</p>
        </div>

        <div class="item">
          <div class="emoji">🏆</div>
          <h2>${best}</h2>
          <p>${lang === "ta" ? "அதிக மதிப்பெண்" : "Best Score"}</p>
        </div>

        <div class="item">
          <div class="emoji">📚</div>
          <h2>${questions}</h2>
          <p>${lang === "ta" ? "கேள்விகள்" : "Questions Attempted"}</p>
        </div>

        <div class="item">
          <div class="emoji">✅</div>
          <h2>${correct}</h2>
          <p>${lang === "ta" ? "சரியான விடைகள்" : "Correct Answers"}</p>
        </div>
      </div>

      <div style="background:#e5edf8;padding:16px;border-radius:12px;margin-top:15px">
        <h3>${lang === "ta" ? "துல்லிய விகிதம்" : "Accuracy"}</h3>
        <h1>${accuracy}%</h1>
        <div style="background:white;height:12px;border-radius:10px">
          <div style="width:${accuracy}%;height:12px;background:#269b61;border-radius:10px"></div>
        </div>
      </div>

      <p style="margin-top:20px">
        ${tests >= 10 ? "🏅 " + (lang === "ta" ? "தேர்வு சாதனையாளர்!" : "Exam Champion!") : tests >= 1 ? "⭐ " + (lang === "ta" ? "நல்ல தொடக்கம்!" : "Good Start!") : (lang === "ta" ? "உங்கள் முதல் தேர்வைத் தொடங்குங்கள்!" : "Start your first test!")}
      </p>
    </div>
  `;

  area.scrollIntoView({behavior:"smooth"});
}
