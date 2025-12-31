let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

const limits = {
  bachelor: {
    "Food & Dining": 25, "Transport": 10, "Rent / Housing": 30,
    "Utilities": 7, "Subscriptions": 5, "Shopping": 10,
    "Healthcare": 5, "Education": 5, "Entertainment": 8,
    "Miscellaneous": 5
  },
  family: {
    "Food & Dining": 30, "Transport": 8, "Rent / Housing": 35,
    "Utilities": 10, "Subscriptions": 4, "Shopping": 7,
    "Healthcare": 8, "Education": 10, "Entertainment": 5,
    "Miscellaneous": 5
  }
};

function addExpense() {
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const month = document.getElementById("month").value;

  if (!amount || !month) return alert("Enter amount and month");

  expenses.push({ amount, category, month });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  analyze();
}

function analyze() {
  const salary = Number(document.getElementById("salary").value);
  const lifestyle = document.getElementById("lifestyle").value;
  const month = document.getElementById("month").value;

  if (!salary || !month) return;

  const monthExpenses = expenses.filter(e => e.month === month);

  let total = 0;
  let categoryTotal = {};
  let leakageCount = 0;

  monthExpenses.forEach(e => {
    total += e.amount;
    categoryTotal[e.category] = (categoryTotal[e.category] || 0) + e.amount;
  });

  document.getElementById("totalExpense").innerText = `Spent ₹${total}`;
  document.getElementById("savings").innerText = `Saved ₹${salary - total}`;

  let analysisHTML = `<h3>Expense Analysis</h3>`;

  for (let cat in categoryTotal) {
    let percent = (categoryTotal[cat] / salary) * 100;
    let limit = limits[lifestyle][cat];

    if (percent > limit) {
      leakageCount++;
      analysisHTML += `<p>⚠️ ${cat}: ${percent.toFixed(1)}% (High)</p>`;
    } else {
      analysisHTML += `<p>✔ ${cat}: ${percent.toFixed(1)}%</p>`;
    }
  }

  document.getElementById("leakageCount").innerText =
    `${leakageCount} Leakages`;

  document.getElementById("analysis").innerHTML = analysisHTML;

  drawChart(categoryTotal);
}

function drawChart(data) {
  const ctx = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data)
      }]
    }
  });
}
