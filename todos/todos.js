import {
    checkAuth,
    createTodo,
    completeTodo,
    getTodos,
    logout,
    deleteAllTodos,
} from '../fetch-utils.js';
import { renderTodo } from '../render-utils.js';

checkAuth();

const todosEl = document.querySelector('.todos');
const todoForm = document.querySelector('.todo-form');
const logoutButton = document.querySelector('#logout');
const deleteButton = document.querySelector('.delete-button');

// let some todo state (an array)
let todoState = [];

todoForm.addEventListener('submit', async (e) => {
    // on submit,
    e.preventDefault();
    console.log('clicking');
    // create a todo in supabase using form data
    const formData = new FormData(todoForm);

    const todo = formData.get('todo');

    await createTodo(todo);
    // reset the form DOM element
    todoForm.reset();
    // and display the todos
    displayTodos();
});

async function displayTodos() {
    // clear the container (.textContent = '')
    todosEl.textContent = '';
    // fetch the user's todos from supabase
    const response = await getTodos();

    const todoState = response.data;
    console.log('todos', todoState);
    // loop through the user's todos
    for (let todo of todoState) {
        // for each todo, render a new todo DOM element using your render function
        const newTodoEl = renderTodo(todo);
        // then add an event listener to each todo
        newTodoEl.addEventListener('click', async () => {
            // on click, update the todo in supabase
            await completeTodo(todo.id);
            // then (shockingly!) call displayTodos() to refresh the list
            displayTodos();
            // append the rendered todo DOM element to the todosEl
        });
        todosEl.append(newTodoEl);
    }
}

window.addEventListener('load', async () => {
    // fetch the todos and store in state
    const fetchTodos = await getTodos();
    todoState = fetchTodos.data;

    // call displayTodos
    displayTodos();
});

logoutButton.addEventListener('click', () => {
    logout();
});

deleteButton.addEventListener('click', async () => {
    // delete all todos
    // then refetch and display the updated list of todos
});
