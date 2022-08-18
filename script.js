const projects = document.querySelector(".projects");
const addProject = document.querySelector(".add-project");
const createTodo = document.querySelector(".create-todo");
const todoAdd = document.querySelector(".todo-add");
const dateEl = document.querySelector(".date");
const projectType = document.querySelector(".project-type");
const projectsAvailable = document.querySelector(".projects-avaiable");

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

class App {
  constructor() {
    this.todos = [];
    this.projects = [
      "Personal",
      "Shopping",
      "Vacation",
      "Assignment",
      "Workout",
      "Vacation",
      "Assignment",
    ];
    this.belongsTo = "";

    this.renderProjects(projects);

    addProject.addEventListener("click", this.createNewProject.bind(this));
    createTodo.addEventListener("click", (e) => {
      this.newTodo(e);
    });
    projectType.addEventListener("click", (e) => {
      this.chooseProject(e);
    });
  }

  // Removing duplicates from all avaialable projects
  renderProjects(container) {
    const uniqueProjects = this.projects.filter(
      (item, pos) => this.projects.indexOf(item) === pos
    );
    uniqueProjects.forEach((project) =>
      this.displayProject(container, project)
    );
  }

  // Displaying projects on the side panel after removing duplication
  displayProject(container, projectItem) {
    const project = document.createElement("li");
    project.setAttribute("class", "project");
    container.appendChild(project);

    const projectColor = document.createElement("div");
    projectColor.setAttribute("class", "project-color");
    project.appendChild(projectColor);

    const projectName = document.createElement("span");
    projectName.setAttribute("class", "project-name");
    projectName.textContent = projectItem;
    project.appendChild(projectName);

    const projectNumber = document.createElement("span");
    projectNumber.textContent = "5";
    project.appendChild(projectNumber);
  }

  // Adding new project on the side panel
  createNewProject() {
    const newProjectPopup = document.querySelector(".new-project-popup");
    const newProjectInput = document.querySelector(".new-project-input");
    const newProjectCancel = document.querySelector(".new-project-cancel");
    const newProjectAdd = document.querySelector(".new-project-add");

    newProjectPopup.style.display = "block"; //change later

    newProjectAdd.addEventListener("click", () => {
      this.projects.push(newProjectInput.value);

      projects.textContent = "";

      this.renderProjects(projects);

      newProjectPopup.style.display = "none"; //change later
    });
  }

  // Creating new todo item
  newTodo(e) {
    const newTodoBox = document.querySelector(".new-todo-box");
    const newTodoTitle = document.querySelector(".new-todo-title");
    const newTodoDesc = document.querySelector(".new-todo-description");
    const todosContainer = document.querySelector(".todos");

    let title, desc, date;
    createTodo.classList.add("hide-element");
    newTodoBox.classList.add("display-popup");

    this.btnSwtich(true, 0.6);

    newTodoTitle.addEventListener("input", () => {
      title = newTodoTitle.value;
      if (title) this.btnSwtich(false, 1);
      else this.btnSwtich(true, 0.6);
    });

    newTodoBox.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      title = newTodoTitle.value;
      desc = newTodoDesc.value;
      date = dateEl.value;

      const todo = new Todo(title, desc, date, "high", this.belongsTo);

      this.todos.push(todo);
      console.log(todo);

      createTodo.classList.remove("hide-element");
      newTodoBox.classList.remove("display-popup");

      let html = `
        <div class="todo-box">

          <div class="check"></div>

          <p class="todo-title">${title}</p>

          <div class="todo-options">
            <i class="fa-solid fa-flag priority"></i>
            <i class="fa-solid fa-pen edit"></i>
            <i class="fa-solid fa-trash delete"></i>
          </div>

          <p class="todo-description">${desc}</p>

          <p class="todo-date">${date}</p>

        </div>
        `;

      todosContainer.insertAdjacentHTML("beforeend", html);
      newTodoTitle.value = "";
    });
  }

  chooseProject(e) {
    const selectedProject = document.querySelector(".selected-project-name");
    this.displayPopup(projectsAvailable);
    projectsAvailable.textContent = "";
    projectsAvailable.classList.add("display-popup");
    this.renderProjects(projectsAvailable);

    if (e.target.classList.contains("project-name")) {
      this.belongsTo = e.target.textContent;
      this.closePopup(projectsAvailable);
      selectedProject.textContent = e.target.textContent;
    }
  }

  closePopup(container) {
    container.classList.add("hide-element");
  }

  displayPopup(container) {
    container.classList.remove("hide-element");
  }

  btnSwtich(status, opacity) {
    todoAdd.style.opacity = opacity;
    todoAdd.disabled = status;
  }
}

const app = new App();
