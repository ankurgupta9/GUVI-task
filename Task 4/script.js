const form = document.getElementById("form");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const list = document.getElementById("list");

const incomeTotal = document.getElementById("incomeTotal");
const expenseTotal = document.getElementById("expenseTotal");
const balance = document.getElementById("balance");

const resetBtn = document.getElementById("resetBtn");
const filters = document.getElementsByName("filter");

let data = JSON.parse(localStorage.getItem("data")) || [];
let editId = null;

render();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = document.querySelector("input[name='type']:checked").value;

  if (editId) {
    data.forEach(item => {
      if (item.id === editId) {
        item.desc = desc.value;
        item.amount = Number(amount.value);
        item.type = type;
      }
    });
    editId = null;
  } else {
    data.push({
      id: Date.now(),
      desc: desc.value,
      amount: Number(amount.value),
      type: type
    });
  }

  save();
  form.reset();
});


resetBtn.addEventListener("click", () => {
  form.reset();
  editId = null;
});


filters.forEach(r => r.addEventListener("change", render));


function render() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  data.forEach(item => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  incomeTotal.textContent = `₹${income}`;
  expenseTotal.textContent = `₹${expense}`;
  balance.textContent = `₹${income - expense}`;

  const filter = document.querySelector("input[name='filter']:checked").value;

  data.forEach(item => {
    if (filter !== "all" && item.type !== filter) return;

    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center p-2 border rounded " +
      (item.type === "income" ? "border-green-500" : "border-red-500");

    li.innerHTML = `
      <span>${item.desc} - ₹${item.amount}</span>
      <div class="space-x-2 text-sm">
        <button onclick="editItem(${item.id})" class="text-blue-600">Edit</button>
        <button onclick="deleteItem(${item.id})" class="text-red-600">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}


/* EDIT */
function editItem(id) {
  const item = data.find(i => i.id === id);
  desc.value = item.desc;
  amount.value = item.amount;
  document.querySelector(`input[value="${item.type}"]`).checked = true;
  editId = id;
}

/* DELETE */
function deleteItem(id) {
  data = data.filter(i => i.id !== id);
  save();
}

/* SAVE */
function save() {
  localStorage.setItem("data", JSON.stringify(data));
  render();
}
