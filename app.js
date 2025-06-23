let balance = 0;
let incomes = [];
let expenses = [];
let categories = ["Food", "Transport", "Entertainment", "Other"];

window.onload = function () {
  loadFromStorage();
  updateBalance();
  populateCategoryDropdown();
  renderIncomes();
  renderExpenses();
};

function updateBalance() {
  document.getElementById("balance").innerText = `€${balance.toFixed(2)}`;
  document.getElementById("balance").style.color = balance < 1000 ? "red" : "white";
}

function addIncome() {
  const amount = parseFloat(document.getElementById("income-input").value);
  if (!isNaN(amount)) {
    const now = new Date();

    const existing = incomes.find(
      i =>
        new Date(i.date).getFullYear() === now.getFullYear() &&
        new Date(i.date).getMonth() === now.getMonth()
    );

    if (existing) {
      existing.amount += amount;
      existing.date = now.toISOString();
    } else {
      const id = Date.now();
      incomes.push({
        id,
        amount,
        date: now.toISOString()
      });
    }

    balance += amount;
    updateBalance();
    renderIncomes();
    saveToStorage();
    document.getElementById("income-input").value = "";
  }
}

function renderIncomes() {
  const incomeList = document.getElementById("income-grid");
  incomeList.innerHTML = "";
  incomes.forEach(inc => {
    const date = new Date(inc.date);
    const month = `${date.toLocaleString("default", {
      month: "long"
    })} ${date.getFullYear()}`;
    const row = document.createElement("div");
    row.className = "income-row";
    row.innerHTML = `
      <strong>${month}</strong>: €${inc.amount.toFixed(2)}
      <div class="btn-group">
      <button class="btn btn-primary btn-sm" onclick="editIncome(${inc.id})">Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteIncome(${inc.id})">Delete</button>
      </div>
    `;
    incomeList.appendChild(row);
  });
}

function editIncome(id) {
  const income = incomes.find(i => i.id === id);
  if (!income) return;

  document.getElementById("income-input").value = income.amount;

  balance -= income.amount;
  incomes = incomes.filter(i => i.id !== id);

  updateBalance();
  renderIncomes();
  saveToStorage();
}

function deleteIncome(id) {
  const index = incomes.findIndex(i => i.id === id);
  if (index !== -1) {
    balance -= incomes[index].amount;
    incomes.splice(index, 1);
    updateBalance();
    renderIncomes();
    saveToStorage();
  }
}

function addExpense() {
  const amount = parseFloat(document.getElementById("expense-input").value);
  const category = document.getElementById("category-select").value;
  if (!isNaN(amount) && category) {
    const now = new Date();

    const existing = expenses.find(
      e =>
        e.category === category &&
        new Date(e.date).getFullYear() === now.getFullYear() &&
        new Date(e.date).getMonth() === now.getMonth()
    );

    if (existing) {
      existing.amount += amount;
      existing.date = now.toISOString();
    } else {
      const id = Date.now();
      expenses.push({
        id,
        category,
        amount,
        date: now.toISOString()
      });
    }

    balance -= amount;
    updateBalance();
    renderExpenses();
    saveToStorage();
    document.getElementById("expense-input").value = "";
  }
}

function renderExpenses() {
  const expenseList = document.getElementById("expense-grid");
  expenseList.innerHTML = "";
  expenses.forEach(exp => {
    const date = new Date(exp.date);
    const month = `${date.toLocaleString("default", {
      month: "long"
    })} ${date.getFullYear()}`;
    const row = document.createElement("div");
    row.className = "expense-row";
    row.innerHTML = `
      <strong>${month}</strong> - ${exp.category}: €${exp.amount.toFixed(2)}
      <div class="btn-group">
      <button class="btn btn-primary btn-sm" onclick="editExpense(${exp.id})">Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteExpense(${exp.id})">Delete</button>
      </div>
    `;
    expenseList.appendChild(row);
  });
}

function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (!expense) return;

  document.getElementById("expense-input").value = expense.amount;
  document.getElementById("category-select").value = expense.category;

  balance += expense.amount;
  expenses = expenses.filter(e => e.id !== id);

  updateBalance();
  renderExpenses();
  saveToStorage();
}

function deleteExpense(id) {
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    balance += expenses[index].amount;
    expenses.splice(index, 1);
    updateBalance();
    renderExpenses();
    saveToStorage();
  }
}

function addCategory() {
  const newCategory = prompt("Enter new category:");
  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory);
    populateCategoryDropdown();
    saveToStorage();
  }
}

function populateCategoryDropdown() {
  const select = document.getElementById("category-select");
  select.innerHTML = "";
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.innerText = cat;
    select.appendChild(opt);
  });
}

function saveToStorage() {
  localStorage.setItem("balance", balance);
  localStorage.setItem("incomes", JSON.stringify(incomes));
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("categories", JSON.stringify(categories));
}

function loadFromStorage() {
  balance = parseFloat(localStorage.getItem("balance")) || 0;
  incomes = JSON.parse(localStorage.getItem("incomes")) || [];
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  categories = JSON.parse(localStorage.getItem("categories")) || categories;
}
