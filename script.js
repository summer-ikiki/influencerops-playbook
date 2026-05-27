const creators = [
  { name: "Sarah Kim", platform: "TikTok", owner: "Jialin", rate: 1350, viewMedian: 93600, schoolSignal: "Strong", comments: "Students", stage: "Approval", score: 90.2, status: "pending" },
  { name: "Ethan Hartley", platform: "Instagram", owner: "Jenny", rate: 1800, viewMedian: 81200, schoolSignal: "Strong", comments: "Students", stage: "Contract", score: 86.4, status: "pending" },
  { name: "Kai Anderson", platform: "TikTok", owner: "Doris", rate: 4200, viewMedian: 244000, schoolSignal: "Medium", comments: "Mixed", stage: "Content review", score: 92.7, status: "paid" },
  { name: "Mia Zhou", platform: "Xiaohongshu", owner: "Jenny", rate: 900, viewMedian: 57800, schoolSignal: "Strong", comments: "Students", stage: "Posted", score: 78.8, status: "posted" },
  { name: "Marcus Webb", platform: "TikTok", owner: "Jialin", rate: 2100, viewMedian: 118000, schoolSignal: "Medium", comments: "Real", stage: "Contract", score: 88.1, status: "paid" },
  { name: "Lena Park", platform: "Instagram", owner: "Doris", rate: 1250, viewMedian: 42100, schoolSignal: "Weak", comments: "Mixed", stage: "Initial screening", score: 72.5, status: "pending" }
];

const stages = ["Initial screening", "Approval", "Contract", "Content review", "Posted"];
const pageTitles = {
  overview: "Campaign Overview",
  evaluation: "Creator Evaluation",
  outreach: "Outreach Automation",
  pipeline: "Creator Pipeline",
  schedule: "Content Schedule",
  payment: "Payment Queue",
  report: "Campaign Report",
  partners: "Long-term Partners"
};

const navList = document.querySelector("#navList");
const pageTitle = document.querySelector("#pageTitle");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  pageTitle.textContent = pageTitles[viewId];
}

navList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  setView(button.dataset.view);
});

function money(value) {
  return `$${value.toLocaleString("en-US")}`;
}

function cpm(creator) {
  return creator.rate / (creator.viewMedian / 1000);
}

function renderEvaluation() {
  document.querySelector("#evaluationTable").innerHTML = creators.map((creator) => {
    const creatorCpm = cpm(creator);
    const passes = creator.viewMedian >= 50000 && creator.schoolSignal !== "Weak" && creatorCpm < 20;
    return `
      <tr>
        <td>${creator.name}</td>
        <td>${creator.viewMedian.toLocaleString("en-US")}</td>
        <td>${creator.schoolSignal}</td>
        <td>$${creatorCpm.toFixed(2)}</td>
        <td><span class="status ${passes ? "paid" : "overdue"}">${passes ? "consider" : "hold"}</span></td>
      </tr>
    `;
  }).join("");
}

function renderOutreach() {
  const list = document.querySelector("#outreachList");
  list.innerHTML = creators.slice(0, 5).map((creator, index) => `
    <div class="creator-row">
      <div class="creator-meta">
        <strong>${creator.name}</strong>
        <span>${creator.platform} - ${creator.viewMedian.toLocaleString("en-US")} median views - CPM $${cpm(creator).toFixed(2)}</span>
      </div>
      <span class="status ${index < 2 ? "sent" : "pending"}">${index < 2 ? "sent" : "queued"}</span>
    </div>
  `).join("");
}

function renderKanban() {
  const kanban = document.querySelector("#kanban");
  kanban.innerHTML = stages.map((stage) => {
    const cards = creators.filter((creator) => creator.stage === stage).map((creator) => `
      <article class="creator-card">
        <strong>${creator.name}</strong>
        <span>${creator.platform} - ${creator.owner} - ${money(creator.rate)} - CPM $${cpm(creator).toFixed(2)}</span>
        ${stage !== "Posted" ? `<button class="small-button" data-advance="${creator.name}">Advance</button>` : `<span class="status posted">posted</span>`}
      </article>
    `).join("");
    return `<section class="lane"><h2>${stage}</h2><div class="card-list">${cards}</div></section>`;
  }).join("");
}

function renderSchedule() {
  const rows = [
    ["May 26", "Mia Zhou", "Xiaohongshu", "Posted", "xiaohongshu.com/demo/post"],
    ["May 27", "Kai Anderson", "TikTok", "Scheduled", "tiktok.com/@kai/demo"],
    ["May 29", "Sarah Kim", "TikTok", "Script required", "-"],
    ["Jun 01", "Ethan Hartley", "Instagram", "In production", "-"],
    ["Jun 04", "Lena Park", "Instagram", "Hold", "-"]
  ];
  document.querySelector("#scheduleTable").innerHTML = rows.map((row) => `
    <tr>
      <td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td>
      <td><span class="status ${row[3] === "Posted" ? "posted" : row[3] === "Script required" || row[3] === "Hold" ? "overdue" : "pending"}">${row[3]}</span></td>
      <td>${row[4]}</td>
    </tr>
  `).join("");
}

function renderPayment() {
  const paid = creators.filter((creator) => creator.status === "paid").length;
  document.querySelector("#paymentProgress").textContent = `${paid}/${creators.length} paid`;
  document.querySelector("#paymentTable").innerHTML = creators.map((creator) => `
    <tr>
      <td>${creator.name}</td>
      <td>${money(creator.rate)}</td>
      <td>${creator.platform} video</td>
      <td><span class="status ${creator.status === "paid" ? "paid" : "pending"}">${creator.status === "paid" ? "paid" : "pending"}</span></td>
      <td>${creator.status === "paid" ? "" : `<button class="small-button" data-pay="${creator.name}">Mark paid</button>`}</td>
    </tr>
  `).join("");
}

function renderReport() {
  const ranked = [...creators].sort((a, b) => b.score - a.score).slice(0, 5);
  document.querySelector("#rankingList").innerHTML = ranked.map((creator, index) => `
    <div class="ranking-item">
      <span class="rank">${index + 1}</span>
      <div>
        <strong>${creator.name}</strong>
        <div class="creator-score">${creator.platform} - est. CPM $${cpm(creator).toFixed(2)} - ${creator.comments} comments</div>
      </div>
      <span class="score">${creator.score}</span>
    </div>
  `).join("");
}

function renderPartners() {
  const partners = creators.filter((creator) => creator.score >= 86);
  document.querySelector("#partnerGrid").innerHTML = partners.map((creator) => `
    <article class="partner-card">
      <strong>${creator.name}</strong>
      <span>${creator.platform} - ${creator.owner}</span>
      <span>${money(creator.rate * 3)} proposed quarterly spend - score ${creator.score}</span>
      <button class="small-button">Renew deal</button>
    </article>
  `).join("");
}

function updateMetrics() {
  const spend = creators.reduce((sum, creator) => sum + creator.rate, 0) * 6;
  const paid = creators.filter((creator) => creator.status === "paid").length;
  document.querySelector("#totalSpend").textContent = money(spend);
  document.querySelector("#totalViews").textContent = (670326 + paid * 12840).toLocaleString("en-US");
  document.querySelector("#replyCount").textContent = String(218 + paid * 4);
  document.querySelector("#cps").textContent = `$${(115.42 - paid * 3.15).toFixed(2)}`;
}

function renderAll() {
  updateMetrics();
  renderEvaluation();
  renderOutreach();
  renderKanban();
  renderSchedule();
  renderPayment();
  renderReport();
  renderPartners();
}

document.addEventListener("click", (event) => {
  const advanceName = event.target.dataset.advance;
  const payName = event.target.dataset.pay;

  if (advanceName) {
    const creator = creators.find((item) => item.name === advanceName);
    const index = stages.indexOf(creator.stage);
    creator.stage = stages[Math.min(index + 1, stages.length - 1)];
    renderAll();
    showToast(`${creator.name} moved to ${creator.stage}`);
  }

  if (payName) {
    const creator = creators.find((item) => item.name === payName);
    creator.status = "paid";
    renderAll();
    showToast(`Payment confirmation sent to ${creator.name}`);
  }
});

document.querySelector("#sendBatch").addEventListener("click", () => {
  document.querySelector("#queuedCount").textContent = "0 queued";
  showToast("Outreach sent and follow-up rules scheduled");
});

document.querySelector("#refreshBtn").addEventListener("click", () => {
  updateMetrics();
  showToast("Dashboard refreshed");
});

document.querySelector("#demoAction").addEventListener("click", () => {
  setView("outreach");
  showToast("Workflow ready: send outreach batch");
});

renderAll();
