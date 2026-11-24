
function openTNPSCPreviousPapers() {
  const area = document.getElementById("content");

  const papers = [
    {
      name: "Group 1",
      tamil: "தொகுதி 1",
      url: "https://www.tnpsc.gov.in/english/answerkeys.aspx"
    },
    {
      name: "Group 2 & 2A",
      tamil: "தொகுதி 2 மற்றும் 2A",
      url: "https://www.tnpsc.gov.in/english/answerkeys.aspx"
    },
    {
      name: "Group 4",
      tamil: "தொகுதி 4",
      url: "https://www.tnpsc.gov.in/english/answerkeys.aspx"
    },
    {
      name: "Tamil Eligibility Test",
      tamil: "தமிழ் தகுதித் தேர்வு",
      url: "https://www.tnpsc.gov.in/Tamil/answerkeys.aspx"
    },
    {
      name: "All Previous Papers",
      tamil: "அனைத்து முந்தைய வினாத்தாள்கள்",
      url: "https://www.tnpsc.gov.in/English/Home.aspx"
    }
  ];

  const lang =
    localStorage.getItem("tnpscLanguage") || "ta";

  area.innerHTML = `
    <div class="card">
      <h2>📄 ${lang === "ta"
        ? "முந்தைய ஆண்டு வினாத்தாள்கள்"
        : "Previous Year Question Papers"}</h2>

      <p>${lang === "ta"
        ? "அதிகாரப்பூர்வ TNPSC வினாத்தாள்கள் மற்றும் விடைக்குறிப்புகளைப் பார்க்கவும்."
        : "Access official TNPSC question papers and answer keys."}</p>

      ${papers.map(paper => `
        <div style="background:#f2f5fa;padding:14px;border-radius:12px;margin:10px 0">
          <strong>${lang === "ta" ? paper.tamil : paper.name}</strong>
          <p>
            <a href="${paper.url}" target="_blank"
              style="color:#1459a6;font-weight:bold">
              ${lang === "ta"
                ? "அதிகாரப்பூர்வ இணையதளத்தைத் திறக்கவும் ↗"
                : "Open Official TNPSC Website ↗"}
            </a>
          </p>
        </div>
      `).join("")}

      <p style="font-size:12px;color:#66768a">
        ${lang === "ta"
          ? "குறிப்பு: இவை TNPSC அதிகாரப்பூர்வ இணையதளத்திற்கான இணைப்புகள். தேர்வு மற்றும் ஆண்டை அங்கு தேர்வு செய்யவும்."
          : "Note: These links open the official TNPSC website. Select the examination and year there."}
      </p>
    </div>
  `;

  area.scrollIntoView({behavior:"smooth"});
}
