import { deleteTodo, getTodos, postTodo } from './api'
import './style.css'

document.querySelector<HTMLTextAreaElement>('#add-todo')?.addEventListener("click", addTodo)
const app = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement


async function addTodo() {
  const textarea = document.querySelector("#todo-input") as HTMLTextAreaElement
  const text = textarea.value
  const todo = await postTodo(text)
  await generateTemplate()

  const btn = document.querySelector(`#todo-${todo.todoId}`)
  if (btn) {
    btn.addEventListener("click", async () => {
      await deleteTodo(todo.todoId)
      await generateTemplate()
    })
  }

}
async function refetch() {
  const todos = await getTodos()
  app.innerHTML = `${todos.map((el) => `<div class="flex gap-x-2 items-center justify-between">
  <span class="text-2xl font-semibold">${el.content}</span>
  <button id="todo-${el.todoId}" class="btn"> DELETE TODO </button>
  </div> \n
  `)}`

}
async function generateTemplate() {
  const todos = await getTodos()
  await refetch()
  for (let todo of todos) {
    const btn = document.querySelector(`#todo-${todo.todoId}`)
    console.log(btn)
    if (btn) {
      btn.addEventListener("click", async () => {
        console.log("del todo")
        await deleteTodo(todo.todoId)
        await generateTemplate()
      })
    }
  }
}
generateTemplate()