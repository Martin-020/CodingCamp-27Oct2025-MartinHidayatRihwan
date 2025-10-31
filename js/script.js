const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const filter = document.getElementById("filter");
const todoList = document.getElementById("todo-list");
const deleteAll = document.getElementById("delete-all");
const searchInput = document.getElementById("search-input");
const modeToggle = document.getElementById("mode-toggle");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let darkMode = true;


function animateInputError(input) {
  input.classList.add("ring-2", "ring-red-500");
  input.classList.add("animate-shake");
  setTimeout(() => {
    input.classList.remove("ring-2", "ring-red-500", "animate-shake");
  }, 600);
}


function renderTodos() {
  todoList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  const filtered = todos.filter(todo => {
    const cocokPencarian = todo.text.toLowerCase().includes(searchText);
    if (filter.value === "selesai") return todo.completed && cocokPencarian;
    if (filter.value === "belum") return !todo.completed && cocokPencarian;
    return cocokPencarian;
  });

  if (filtered.length === 0) {
    todoList.innerHTML = `<tr><td colspan="4" class="text-center text-slate-400">Tidak ada tugas ditemukan</td></tr>`;
    return;
  }

  filtered.forEach((todo, index) => {
    const row = document.createElement("tr");
    row.classList.add("todo-item", "bg-slate-700/50", "rounded-lg");
    row.innerHTML = `
      <td class="pl-2 font-medium ${todo.completed ? 'line-through text-slate-400' : ''}">${todo.text}</td>
      <td>${todo.date || '-'}</td>
      <td>
        <span class="${todo.completed ? 'text-green-400' : 'text-yellow-400'} font-semibold">
          ${todo.completed ? 'Selesai' : 'Belum'}
        </span>
      </td>
      <td class="text-center">
        <button onclick="toggleComplete(${index})" class="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 transition text-xs">✔</button>
        <button onclick="deleteTodo(${index})" class="px-2 py-1 bg-red-600 rounded hover:bg-red-700 transition text-xs">🗑</button>
      </td>
    `;
    todoList.appendChild(row);
  });
}


function addTodo() {
  const text = todoInput.value.trim();
  const date = dateInput.value;

  if (!text) {
    alert("Harap isi nama tugas terlebih dahulu!");
    animateInputError(todoInput);
    return;
  }

  if (!date) {
    alert("Harap isi tanggal tugas terlebih dahulu!");
    animateInputError(dateInput);
    return;
  }

  todos.push({ text, date, completed: false });
  localStorage.setItem("todos", JSON.stringify(todos));
  todoInput.value = "";
  dateInput.value = "";

  renderTodos();
}


function toggleTodoStatus(index) {
  if (todos[index].completed) {
    alert("Tugas ini sudah selesai dan tidak dapat diubah kembali!");
    return;
  }

  todos[index].completed = true;
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}


function deleteTodo(index) {
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}


function deleteAllTodos() {
  if (todos.length === 0) {
    alert("Tidak ada tugas yang bisa dihapus!");
    return;
  }

  if (confirm("Yakin ingin menghapus semua tugas?")) {
    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }
}


function toggleMode() {
  darkMode = !darkMode;
  if (darkMode) {
    document.body.classList.remove("light-mode");
    modeToggle.textContent = "☀️";
  } else {
    document.body.classList.add("light-mode");
    modeToggle.textContent = "🌙";
  }
}


addBtn.addEventListener("click", addTodo);
filter.addEventListener("change", renderTodos);
deleteAll.addEventListener("click", deleteAllTodos);
searchInput.addEventListener("input", renderTodos);
modeToggle.addEventListener("click", toggleMode);
renderTodos();
