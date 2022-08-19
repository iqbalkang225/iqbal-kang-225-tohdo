const projects = document.querySelector(".projects");
const addProject = document.querySelector(".add-project");
const createTodo = document.querySelector(".create-todo");
const todoAdd = document.querySelector(".todo-add");
const dateEl = document.querySelector(".date");
const projectType = document.querySelector(".project-type");
const projectsAvailable = document.querySelector(".projects-avaiable");
const todosContainer = document.querySelector(".todos");
const overlay = document.querySelector(".overlay");
const selectedProjectEl = document.querySelector(".selected-project-name");
const todoCancelBtn = document.querySelector(".todo-cancel");
const newTodoBox = document.querySelector(".new-todo-box");

class Todo {
  constructor(title, desc, date, priority, belongsTo) {
    this.title = title;
    this.desc = desc;
    this.date = date;
    this.priority = priority;
    this.belongsTo = belongsTo;
    this.id = Math.floor(Math.random() * 50) + 1;
  }
}

class Project {
  constructor(color = "black", name, count = 0) {
    this.color = color;
    this.name = name;
    this.count = count;
  }
}

class App {
  constructor() {
    this.todos = [];
    this.projects = [
      { color: "red", name: "All", count: 0 },
      { color: "blue", name: "Shopping", count: 0 },
      { color: "orangered", name: "Vacation", count: 0 },
      { color: "pink", name: "Assignment", count: 0 },
      { color: "violet", name: "Workout", count: 0 },
    ];

    // this.projects = [
    //   "All",
    //   "Shopping",
    //   "Vacation",
    //   "Assignment",
    //   "Workout",
    //   "Vacation",
    //   "Assignment",
    // ];
    this.belongsTo = "All";
    this.selectedProject = "All";

    this.renderProjects(projects);

    addProject.addEventListener("click", this.createNewProject.bind(this));
    createTodo.addEventListener("click", (e) => {
      this.newTodo(e);
    });
    projectType.addEventListener("click", (e) => {
      this.assignToProject(e);
    });
    projects.addEventListener("click", (e) => {
      this.filterTodos(e);
    });
    todosContainer.addEventListener("click", (e) => {
      this.deleteTodo(e);
    });
  }

  renderProjects(container) {
    this.projects.forEach((project) => {
      this.displayProject(container, project);
    });
  }

  // Displaying projects on the side panel after removing duplication
  displayProject(container, projectItem) {
    const project = document.createElement("li");
    project.setAttribute("class", "project");
    container.appendChild(project);

    const projectColor = document.createElement("div");
    // projectColor.setAttribute("class", `project-color project-color--${idx}`);
    projectColor.setAttribute("class", `project-color`);
    projectColor.style.backgroundColor = `${projectItem.color}`;
    project.appendChild(projectColor);

    const projectName = document.createElement("span");
    projectName.setAttribute("class", "project-name");
    projectName.textContent = projectItem.name;
    project.appendChild(projectName);

    const projectNumber = document.createElement("span");
    projectNumber.setAttribute("class", "project-number");
    projectNumber.setAttribute("data-belongsto", projectItem);
    projectNumber.textContent = projectItem.count;
    project.appendChild(projectNumber);
  }

  // Adding new project on the side panel
  createNewProject() {
    const newProjectPopup = document.querySelector(".new-project-popup");
    const newProjectInput = document.querySelector(".new-project-input");
    const newProjectCancel = document.querySelector(".new-project-cancel");
    const newProjectAdd = document.querySelector(".new-project-add");

    this.openPopup(newProjectPopup, overlay);
    newProjectInput.focus();

    newProjectCancel.addEventListener("click", () => {
      this.closePopup(newProjectPopup, overlay);
      return;
    });

    newProjectAdd.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      if (!newProjectInput.value) return;

      // Checking if project already exists
      const projectIndex = this.projects.findIndex(
        (project) => project.name === newProjectInput.value
      );

      if (projectIndex === -1) {
        const project = new Project("red", newProjectInput.value);
        this.projects.push(project);
      }

      projects.textContent = "";

      this.renderProjects(projects);

      this.closePopup(newProjectPopup, overlay);
    });

    overlay.addEventListener("click", () => {
      this.closePopup(newProjectPopup, overlay);
    });

    newProjectInput.value = "";
  }

  // Creating new todo item
  newTodo(e) {
    const newTodoTitle = document.querySelector(".new-todo-title");
    const newTodoDesc = document.querySelector(".new-todo-description");

    let title, desc, date;

    this.closePopup(createTodo);
    this.openPopup(newTodoBox);
    newTodoTitle.focus();

    this.btnSwtich(true, 0.6);

    newTodoTitle.addEventListener("input", () => {
      title = newTodoTitle.value;
      if (title) this.btnSwtich(false, 1);
      else this.btnSwtich(true, 0.6);
    });

    todoCancelBtn.addEventListener("click", () => {
      this.openPopup(createTodo);
      this.closePopup(newTodoBox);
    });

    newTodoBox.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      title = newTodoTitle.value;
      desc = newTodoDesc.value;
      date = dateEl.value;

      const todo = new Todo(title, desc, date, "high", this.belongsTo);

      this.todos.push(todo);

      this.openPopup(createTodo);
      this.closePopup(newTodoBox);

      if (this.selectedProject === this.belongsTo) this.displayNewTodo(todo);

      // Incrementing todos count
      this.projects.find((project) => {
        return project.name === this.belongsTo;
      }).count++;
      this.projects[0].count = this.todos.length;

      projects.textContent = "";
      this.renderProjects(projects);

      // projects.textContent = "";
      // this.renderProjects(projects);
      // this.assignToProject();
      newTodoTitle.value = newTodoDesc.value = "";
      dateEl.value = "";
    });
  }

  displayNewTodo(todo) {
    let html = `
        <div class="todo-box">

          <div class="check"></div>

          <p class="todo-title">${todo.title}</p>

          <div class="todo-options">
            <i class="fa-solid fa-flag priority"></i>
            <i class="fa-solid fa-pen edit"></i>
            <i class="fa-solid fa-trash todo-delete" data-id="${todo.id}"></i>
          </div>

          <p class="todo-description">${todo.desc}</p>

          <p class="todo-date">${todo.date}</p>

        </div>
        `;

    todosContainer.insertAdjacentHTML("beforeend", html);
  }

  assignToProject(e) {
    const selectedColorEl = document.querySelector(".selected-project-color");

    selectedColorEl.style.backgroundColor = "red";

    projectsAvailable.textContent = "";
    this.renderProjects(projectsAvailable);
    this.openPopup(projectsAvailable);

    if (e.target.classList.contains("project-name")) {
      this.updateProjectName(e);
    }
  }

  //////////////////////
  updateProjectName(e) {
    this.belongsTo = e.target.textContent;
    this.closePopup(projectsAvailable);
    selectedProjectEl.textContent = e.target.textContent;
  }
  ////////////////////

  updateColor() {}

  filterTodos(e) {
    this.closePopup(newTodoBox);
    this.openPopup(createTodo);

    const selectedProjectTitle = document.querySelector(
      ".selected-project-title"
    );

    if (e.target.classList.contains("project-name")) {
      this.selectedProject = e.target.textContent;
      selectedProjectTitle.textContent = this.selectedProject;

      this.updateProjectName(e);

      if (e.target.textContent === "All") {
        todosContainer.textContent = "";
        this.todos.forEach((todo) => this.displayNewTodo(todo));
        return;
      }

      let filtertedTodos = this.todos.filter(
        (todo) => todo.belongsTo === e.target.textContent
      );

      todosContainer.textContent = "";

      filtertedTodos.forEach((todo) => {
        this.displayNewTodo(todo);
      });
    }
  }

  deleteTodo(e) {
    if (e.target.classList.contains("todo-delete")) {
      const todoId = +e.target.dataset.id;

      const deleteIndex = this.todos.findIndex((todo) => todo.id === todoId);

      this.todos.splice(deleteIndex, 1);

      //////////////////////////need to rework
      ////////////////////////
      this.projects.find((project) => {
        return project.name === this.belongsTo;
      }).count--;
      this.projects[0].count = this.todos.length;

      projects.textContent = "";
      this.renderProjects(projects);
      ////////////////////////////////
      ///////////////////need to rework

      e.target.closest(".todo-box").remove();
    }
  }

  closePopup(container, overlay) {
    container.classList.add("hide-element");
    if (overlay) overlay.classList.add("hide-element");
  }

  openPopup(container, overlay) {
    container.classList.remove("hide-element");
    if (overlay) overlay.classList.remove("hide-element");
  }

  btnSwtich(status, opacity) {
    todoAdd.style.opacity = opacity;
    todoAdd.disabled = status;
  }
}

const app = new App();
