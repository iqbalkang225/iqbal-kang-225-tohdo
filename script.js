const projects = document.querySelector('.projects');
const addProject = document.querySelector('.add-project');
const createTodo = document.querySelector('.create-todo');
const todoAdd = document.querySelector('.todo-add');
const dateEl = document.querySelector('.date');
const projectType = document.querySelector('.project-type');
const projectsAvailable = document.querySelector('.projects-avaiable');
const todosContainer = document.querySelector('.todos');
const overlay = document.querySelector('.overlay');
const selectedProjectEl = document.querySelector('.selected-project-name');
const todoCancelBtn = document.querySelector('.todo-cancel');
const newTodoBox = document.querySelector('.new-todo-box');
const selectedColorEl = document.querySelector('.selected-project-color');
const searchEl = document.querySelector('.search-box');
const priorityEl = document.querySelector('.priority');
const hamburgerIcon = document.querySelector('.icons > *:first-child');
const closeIcon = document.querySelector('.close-icon');
const selectedProjectTitle = document.querySelector('.selected-project-title');
const filtersEl = document.querySelector('.filters');

const defaultProjects = [
  { color: '#BC96E6', name: 'All', count: 0 },
  { color: '#a3892e', name: 'Shopping', count: 0 },
  { color: 'orangered', name: 'Vacation', count: 0 },
  { color: '#ED217C', name: 'Assignment', count: 0 },
  { color: '#ED6A5A', name: 'Workout', count: 0 },
];

class Todo {
  constructor(title, desc, date, priority = 'Low', belongsTo, completed = 'No') {
    this.title = title;
    this.desc = desc;
    this.date = date;
    this.priority = priority;
    this.belongsTo = belongsTo;
    this.completed = completed;
    this.id = Math.floor(Math.random() * 50) + 1;
  }
}

class Project {
  constructor(color = 'black', name, count = 0) {
    this.color = color;
    this.name = name;
    this.count = count;
  }
}

class App {
  constructor() {
    this.todos = [];
    this.projects = defaultProjects;
    this.selectedProject = this.projects[0];
    this.belongsTo = 'All';

    this.getLocalStorage();

    this.renderProjects(projects);

    addProject.addEventListener('click', this.createNewProject.bind(this));

    createTodo.addEventListener('click', (e) => {
      this.newTodo(e);
    });

    projectType.addEventListener('click', (e) => {
      this.assignToProject(e);
    });

    projects.addEventListener('click', (e) => {
      this.filterTodos(e);
    });

    todosContainer.addEventListener('click', (e) => {
      this.deleteTodo(e);
    });

    searchEl.addEventListener('submit', (e) => {
      this.searchTodo(e);
    });

    hamburgerIcon.addEventListener('click', () => {
      this.toggleNav();
    });

    closeIcon.addEventListener('click', () => {
      this.toggleNav();
    });

    filtersEl.addEventListener('click', (e) => {
      this.filterTasks(e);
    });
  }

  ///////////////////////
  // Displaying available projects
  ///////////////////////

  renderProjects(container) {
    this.projects.forEach((projectItem) => {
      const project = document.createElement('li');
      project.setAttribute('class', 'project');
      project.setAttribute('data-selection', projectItem.name);
      container.appendChild(project);

      const projectColor = document.createElement('div');
      projectColor.setAttribute('class', `project-color`);
      projectColor.style.backgroundColor = `${projectItem.color}`;
      project.appendChild(projectColor);

      const projectName = document.createElement('span');
      projectName.setAttribute('class', 'project-name');
      projectName.textContent = projectItem.name;
      project.appendChild(projectName);

      const projectNumber = document.createElement('span');
      projectNumber.setAttribute('class', 'project-number');
      projectNumber.setAttribute('data-belongsto', projectItem);
      projectNumber.textContent = this.projectsCount(projectItem.name);
      project.appendChild(projectNumber);
    });
  }

  projectsCount(projectName) {
    if (projectName === 'All') return this.todos.length;
    return this.todos.filter((todo) => todo.belongsTo === projectName).length;
  }

  ///////////////////////
  // Adding new projects
  ///////////////////////

  createNewProject() {
    const newProjectPopup = document.querySelector('.new-project-popup');
    const newProjectInput = document.querySelector('.new-project-input');
    const newProjectCancel = document.querySelector('.new-project-cancel');
    const newProjectAdd = document.querySelector('.new-project-add');

    this.openPopup(newProjectPopup, overlay); // 1. Open popup window upon
    newProjectInput.focus();

    newProjectCancel.addEventListener('click', () => {
      //2. Close popup if Cancel button is clicked
      this.closePopup(newProjectPopup, overlay);
      return;
    });

    newProjectAdd.addEventListener('click', (e) => {
      //3. Event listener for Add Button
      e.stopImmediatePropagation();

      if (!newProjectInput.value) return; //4. Value REQUIRED validation

      const projectIndex = this.projects.findIndex(
        //5. Check if Project already exists
        (project) => project.name.toLocaleLowerCase() === newProjectInput.value.toLocaleLowerCase()
      );

      if (projectIndex === -1) {
        //6. If not, push it into projects array after capitalizing name
        const project = new Project(this.generateRandomColor(), this.capitalizeWord(newProjectInput.value));
        this.projects.push(project);
      }

      this.setLocalStorage('projects');

      projects.textContent = ''; //7. Clear out Projects container before displaying new projects list

      this.renderProjects(projects); //8. Display all projects (including the newly added one)

      this.closePopup(newProjectPopup, overlay); //9. Close the popup window.
    });

    overlay.addEventListener('click', () => {
      this.closePopup(newProjectPopup, overlay);
    });

    newProjectInput.value = ''; //10. Clearing out input field
  }

  selectProject(e) {
    this.belongsTo = e.target.dataset.selection;
    return (this.selectedProject = this.projects.find((project) => project.name === e.target.dataset.selection));
  }

  filterTodos(e) {
    this.closePopup(newTodoBox);
    this.openPopup(createTodo);

    if (e.target.classList.contains('project')) {
      this.selectProject(e);

      selectedProjectTitle.textContent = this.selectedProject.name;

      this.updateProjectsInfo(e, this.selectedProject);

      todosContainer.textContent = '';

      if (this.selectedProject.name === 'All') {
        this.todos.forEach((todo) => this.displayNewTodo(todo));
        return;
      }
    }

    this.todos
      .filter((todo) => this.selectedProject.name === todo.belongsTo)
      .forEach((todo) => this.displayNewTodo(todo));
  }

  filterTasks(e) {
    const filter = e.target.dataset.filter;
    const title = e.target.dataset.title;

    selectedProjectTitle.textContent = title;

    if (e.target.classList.contains('filter') && filter === 'completed') {
      todosContainer.textContent = '';
      // this.todos.forEach((todo) => console.log(todo.completed, filter));
      return this.todos
        .filter((todo) => todo.completed.toLowerCase() === filter)
        .forEach((completedTodo) => this.displayNewTodo(completedTodo));
    }

    todosContainer.textContent = '';
    this.todos
      .filter((todo) => todo.priority.toLowerCase() === filter)
      .forEach((priority) => this.displayNewTodo(priority));
  }

  ////////////////////
  // Updating available projects info inside new todo creation box
  //////////////////////
  updateProjectsInfo(e, selectedProject) {
    this.closePopup(projectsAvailable);
    selectedProjectEl.textContent = this.belongsTo;
    selectedColorEl.style.backgroundColor = selectedProject.color;
  }

  assignToProject(e) {
    projectsAvailable.textContent = '';
    this.renderProjects(projectsAvailable);
    this.openPopup(projectsAvailable);

    if (e.target.classList.contains('project')) {
      this.belongsTo = e.target.dataset.selection;

      this.updateProjectsInfo(e, this.selectedProject);
    }
  }

  ///////////////////////
  // Creating a new todo item
  ///////////////////////

  newTodo(e) {
    const newTodoTitle = document.querySelector('.new-todo-title');
    const newTodoDesc = document.querySelector('.new-todo-description');

    let title, desc, date, priority;

    this.closePopup(createTodo); //1. Displaying new todo popup for entering todo details
    this.openPopup(newTodoBox);
    newTodoTitle.focus();

    this.btnSwtich(true, 0.6); //2. Disabling add button - user cannot click it until atleast todo TITLE is filled out

    newTodoTitle.addEventListener('input', () => {
      //3. Event listener for detecting value in the todo TITLE input.
      title = newTodoTitle.value;
      if (title) this.btnSwtich(false, 1);
      else this.btnSwtich(true, 0.6);
    });

    todoCancelBtn.addEventListener('click', () => {
      //4. Close todo filling form if Cancel button is clicked.
      this.openPopup(createTodo);
      this.closePopup(newTodoBox);
    });

    priorityEl.addEventListener('change', (e) => {
      priority = priorityEl.value;
    });

    newTodoBox.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      title = newTodoTitle.value;
      desc = newTodoDesc.value;
      date = dateEl.value;

      const todo = new Todo(title, desc, date, priority, this.belongsTo);

      this.todos.push(todo);

      this.setLocalStorage('todo');

      this.openPopup(createTodo);
      this.closePopup(newTodoBox);

      // if(this.selectedProject === undefined) this.displayNewTodo(todo)

      if (this.selectedProject.name === this.belongsTo || this.selectedProject.name === 'All')
        this.displayNewTodo(todo);

      this.updateTodoCount('add');

      projects.textContent = '';
      this.renderProjects(projects);

      newTodoTitle.value = newTodoDesc.value = '';
      dateEl.value = '';
    });
  }

  updateTodoCount(type) {
    const projectToBeUpdated = this.projects.find((project) => project.name === this.belongsTo);
    if (type === 'add') projectToBeUpdated.count++;
    else projectToBeUpdated.count--;
    this.projects[0].count = this.todos.length;
  }

  ///////////////////////
  // Creating a new todo item upon submitting the todo form
  ///////////////////////

  displayNewTodo(todo) {
    const todoBox = document.createElement('div');
    todoBox.setAttribute('class', 'todo-box');
    todosContainer.appendChild(todoBox);

    const checkMark = document.createElement('div');
    checkMark.setAttribute('class', 'check');
    checkMark.setAttribute('data-id', todo.id);
    todoBox.appendChild(checkMark);

    const todoTitle = document.createElement('p');
    todoTitle.setAttribute('class', 'todo-title');
    todoTitle.textContent = todo.title;
    todoBox.appendChild(todoTitle);
    if (todo.completed === 'completed') {
      todoTitle.style.setProperty('--completed-width', '100%');
      todoTitle.style.color = '#aaa';
    }

    const todoOptions = document.createElement('div');
    todoOptions.setAttribute('class', 'todo-options');
    todoBox.appendChild(todoOptions);

    const belongsToTag = document.createElement('span');
    belongsToTag.setAttribute('class', 'belongs-to-tag');
    belongsToTag.textContent = todo.belongsTo;
    belongsToTag.style.backgroundColor = this.setColor(this.projects, todo.belongsTo).color;
    todoOptions.appendChild(belongsToTag);

    const priorityTag = document.createElement('span');
    priorityTag.setAttribute('class', 'priority-tag');

    if (todo.priority === 'Low') priorityTag.style.background = '#72B01D';
    if (todo.priority === 'Medium') priorityTag.style.background = '#BFAB25';
    if (todo.priority === 'High') priorityTag.style.background = 'red';
    priorityTag.textContent = todo.priority;
    todoOptions.appendChild(priorityTag);

    // const editBtn = document.createElement('i');
    // editBtn.innerHTML = `<i class="fa-solid fa-pen todo-edit">`;
    // todoOptions.appendChild(editBtn);

    const deleteBtn = document.createElement('i');
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash todo-delete" data-id="${todo.id}"></i>`;
    todoOptions.appendChild(deleteBtn);

    const todoDesc = document.createElement('p');
    todoDesc.setAttribute('class', 'todo-description');
    todoDesc.textContent = todo.desc;
    todoBox.appendChild(todoDesc);

    const todoDate = document.createElement('p');
    todoDate.setAttribute('class', 'todo-date');
    todoDate.textContent = todo.date;
    todoBox.appendChild(todoDate);
  }

  setColor(projects, todo) {
    return projects.find((project) => project.name === todo);
  }

  deleteTodo(e) {
    if (e.target.classList.contains('todo-delete')) {
      const todoId = +e.target.dataset.id;

      const deleteIndex = this.todos.findIndex((todo) => todo.id === todoId);

      this.todos.splice(deleteIndex, 1);
      this.setLocalStorage('todo');

      this.updateTodoCount();

      projects.textContent = '';
      this.renderProjects(projects);
      ////////////////////////////////
      ///////////////////need to rework

      e.target.closest('.todo-box').remove();
    }

    if (e.target.classList.contains('check')) {
      const todoId = +e.target.dataset.id;

      e.target.nextElementSibling.style.setProperty('--completed-width', '100%');
      e.target.nextElementSibling.style.color = '#aaa';
      // e.target.addEventListener('transitionend', () => {
      //   e.target.closest('.todo-box').remove();
      // });

      const completedTodo = this.todos.find((todo) => todo.id === todoId);
      completedTodo.completed = 'completed';
      this.setLocalStorage('todo');
    }
  }

  searchTodo(e) {
    e.preventDefault();

    let search = document.querySelector('.search');

    const searchResult = this.todos.filter((todo) => todo.title === search.value);

    selectedProjectTitle.textContent = 'All';

    todosContainer.textContent = '';

    searchResult.forEach((result) => this.displayNewTodo(result));

    search.value = '';
  }

  closePopup(container, overlay) {
    container.classList.add('hide-element');
    if (overlay) overlay.classList.add('hide-element');
  }

  openPopup(container, overlay) {
    container.classList.remove('hide-element');
    if (overlay) overlay.classList.remove('hide-element');
  }

  btnSwtich(status, opacity) {
    todoAdd.style.opacity = opacity;
    todoAdd.disabled = status;
  }

  capitalizeWord(word) {
    return word.slice(0, 1).toUpperCase() + word.slice(1);
  }

  toggleNav() {
    const navigation = document.querySelector('.navigation');
    // const container = document.querySelector('.close-icon');

    navigation.classList.toggle('hide-element');
    closeIcon.classList.toggle('hide-element');
    navigation.classList.toggle('expanded');
  }

  generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  setLocalStorage(item) {
    if (item === 'todo') return localStorage.setItem('todos', JSON.stringify(this.todos));
    else localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  getLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos'));
    const projectsList = JSON.parse(localStorage.getItem('projects'));

    if (!projectsList) this.projects = defaultProjects;
    else this.projects = projectsList;

    if (!todos) this.todos = [];
    else this.todos = todos;
    this.todos.forEach((todo) => this.displayNewTodo(todo));
  }

  resetLocalStorage() {
    localStorage.removeItem('todos');
  }
}

const app = new App();
