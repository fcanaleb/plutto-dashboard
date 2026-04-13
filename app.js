// 📁 app.js

let data = [];

async function loadData() {
  const res = await fetch("data/latest.json");
  data = await res.json();
  renderTable(data);
}

function renderTable(dataset) {
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  dataset.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.rut}</td>
      <td>${item.score}</td>
      <td>${item.risk}</td>
      <td>${item.delta ?? 0}</td>
    `;

    // color por riesgo
    if (item.risk === "HIGH") tr.classList.add("high");
    if (item.risk === "MEDIUM") tr.classList.add("medium");
    if (item.risk === "LOW") tr.classList.add("low");

    tbody.appendChild(tr);
  });
}

// filtro
document.getElementById("riskFilter").addEventListener("change", (e) => {
  const value = e.target.value;

  if (value === "ALL") {
    renderTable(data);
  } else {
    const filtered = data.filter(x => x.risk === value);
    renderTable(filtered);
  }
});

// init
loadData();