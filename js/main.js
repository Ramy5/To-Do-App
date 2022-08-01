"use strict";
const createTask = document.querySelector(".create-task");
const tasksField = document.querySelector(".tasks");
const btnAddTask = document.querySelector(".btn-add");
const btnClearAll = document.querySelector(".btn-clear");
let content = document.createElement("div");
let arrayOfTasks = [];

// foucs on input to createTask
window.addEventListener("load", () => createTask.focus());

// if i press enter key create task
createTask.addEventListener("keyup", (e) => {
  if (e.key === "Enter") btnAddTask.click();
});

// if there is item in local Storage
if (localStorage.getItem("tasks"))
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));

getDataFromLocal();

btnAddTask.addEventListener("click", function () {
  if (createTask.value !== "") {
    addTasksToArray(createTask.value);
    createTask.value = "";
    createTask.focus();
  }
});

// if i press content then create done class
tasksField.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("content") ||
    e.target.classList.contains("date") ||
    e.target.classList.contains("label") ||
    e.target.classList.contains("input")
  ) {
    for (let i = 0; i < arrayOfTasks.length; i++) {
      if (arrayOfTasks[i].id == e.target.getAttribute("data-id")) {
        arrayOfTasks[i].complete == false
          ? (arrayOfTasks[i].complete = true)
          : (arrayOfTasks[i].complete = false);
      }
    }
    addToLocal(arrayOfTasks);
    content.classList.toggle("done");
  }
});

// function to add tasks to array
function addTasksToArray(createTask) {
  const taskData = {
    id: Date.now(),
    title: createTask,
    complete: false,
    date: `${new Date().getHours()}:${new Date().getMinutes()} 📅 ${new Date().getUTCDate()}-${new Date().getUTCMonth()}-${new Date().getUTCFullYear()}`,
  };

  arrayOfTasks.push(taskData);
  createTasks(arrayOfTasks);
  addToLocal(arrayOfTasks);
}

// function for create task and add it in page
function createTasks(arrayOfTasks) {
  tasksField.textContent = "";
  arrayOfTasks.forEach((arr, i) => {
    // create content
    let content = document.createElement("div");
    content.classList = "content";
    content.setAttribute("data-id", arr.id);
    // create task div
    let task = document.createElement("div");
    task.classList.add("task");
    let input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("check");
    input.setAttribute("data-id", arr.id);
    input.title = "done?";
    task.appendChild(input);

    let label = document.createElement("label");
    label.textContent = `${++i}- ${arr.title}`;
    label.classList.add("label");
    task.appendChild(label);
    label.setAttribute("data-id", arr.id);
    content.appendChild(task);

    // create content date
    let contentDate = document.createElement("div");
    contentDate.classList.add("content-date");
    let date = document.createElement("p");
    date.classList.add("date");
    date.setAttribute("data-id", arr.id);
    date.textContent = arr.date;
    contentDate.appendChild(date);
    let buttonDel = document.createElement("button");
    buttonDel.classList.add("del");
    buttonDel.type = "button";
    buttonDel.textContent = "Delete";
    buttonDel.setAttribute("data-id", arr.id);
    contentDate.appendChild(buttonDel);
    content.appendChild(contentDate);

    tasksField.appendChild(content);

    // if i pressed on delete button
    buttonDel.addEventListener("click", function (e) {
      content.remove();
      arrayOfTasks = arrayOfTasks.filter(
        (el) => el.id != e.target.getAttribute("data-id") // return all except the element with the same id i pressed
      );
      addToLocal(arrayOfTasks);
    });

    if (arr.complete) {
      content.classList = "content done";
      input.click();
    }
    content.addEventListener("click", function () {
      content.classList.toggle("done");
      input.click();
    });
    label.addEventListener("click", () => content.classList.toggle("done"));
    date.addEventListener("click", () => content.classList.toggle("done"));
  });
}
// function for add array content to localStorage
function addToLocal(arrayOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// function to get data from localStorage
function getDataFromLocal() {
  let data = localStorage.getItem("tasks");
  if (data) createTasks(JSON.parse(data));
}

// button for clear all
btnClearAll.addEventListener("click", function () {
  tasksField.textContent = "";
  localStorage.clear();
});
