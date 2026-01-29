let todos = loadTodos();
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const saved = JSON.parse(localStorage.getItem("todos"));
  return saved || [];
}

function addTodo(text) {
  if (text.trim() === "") return;

  todos.push({
    id: Date.now(),
    text: text.trim(),
    completed: false
  });
  saveTodos();
  renderTodos();
}



function deleteTodo(id) {
  todos= todos.filter(todo=> todo.id !== id);
  saveTodos();
  renderTodos();
}



function renderTodos() {
  const list = document.getElementById("todo-list");
  list.innerHTML = "";

  if (todos.length === 0) {
    list.innerHTML = "<li class='empty'>No tasks yet 👋</li>"
    updateCounter();
    return;
  }

  let filteredTodos = todos;
  if (currentFilter === "active") {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.className = todo.completed ? "completed" : "";

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    checkbox.setAttribute("aria-label", "Mark task as completed");
    deleteBtn.setAttribute("aria-label", "Delete task");


    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);

    span.addEventListener("dblclick", (e) => {
      e.stopPropagation();

      const newText = prompt("Edit task:", todo.text);
      if (newText !== null && newText.trim() !== "") {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
      }
    })
  });
  updateCounter();


}


function updateCounter() {
  const counter = document.getElementById("counter");
  const remaining = todos.filter(todo => !todo.completed).length;

  counter.textContent = remaining === 0
    ? "🎉 No tasks remaining"
    : `${remaining} task${remaining > 1 ? "s" : ""} remaining`;
}



document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.getElementById("todo-input");
  const addBtn = form.querySelector("button");

  function toggleAddButton() {
    addBtn.disabled = input.value.trim() === "";

  }

  input.addEventListener("input", toggleAddButton);
  toggleAddButton();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addTodo(input.value);
    input.value = "";
    toggleAddButton();
    input.focus();

  });

  document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      console.log("Current Filter:", currentFilter);

      document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      renderTodos();
    });
  });
  renderTodos();

});


