// 📁 app.js

let data = [];
let currentFile = null;

// ==========================
// Cargar índice (historial)
// ==========================
async function loadIndex() {
  const res = await fetch("./data/index.json");
  const files = await res.json();

  const select = document.getElementById("dateSelect");

  select.innerHTML = "";

  files.forEach(file => {
    const option = document.createElement("option");
    option.value = file;
    option.text = formatDate(file);
    select.appendChild(option);
  });

  // cargar el más reciente automáticamente
  if (files.length > 0) {
    loadData(files[0]);
  }
}

// ==========================
// Cargar archivo seleccionado
// ==========================
async function loadData(filename) {
  currentFile = filename;

  const res = await fetch(`./data/${filename}`);
  const json = await res.json();

  // 🔥 CLAVE: providers
  data = json.providers;

  renderTable(data);
}

// ==========================
// Render tabla
// ==========================
function renderTable(dataset) {
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  dataset.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.tin}</td>
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

// ==========================
// Filtro por riesgo
// ==========================
document.getElementById("riskFilter").addEventListener("change", (e) => {
  const value = e.target.value;

  if (value === "ALL") {
    renderTable(data);
  } else {
    const filtered = data.filter(x => x.risk === value);
    renderTable(filtered);
  }
});

// ==========================
// Cambio de fecha
// ==========================
document.getElementById("dateSelect").addEventListener("change", (e) => {
  loadData(e.target.value);
});

// ==========================
// Formatear fecha
// ==========================
function formatDate(filename) {
  const match = filename.match(/results_(\d{8})_(\d{6})/);

  if (!match) return filename;

  const date = match[1];
  const time = match[2];

  return `${date.slice(6,8)}/${date.slice(4,6)}/${date.slice(0,4)} ${time.slice(0,2)}:${time.slice(2,4)}`;
}

// ==========================
// Init
// ==========================
loadIndex();