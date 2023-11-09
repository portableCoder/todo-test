export type Todo = {

    todoId: string,
    content: string
}
export async function getTodos(): Promise<Todo[]> {
    const res = await fetch("http://localhost:5000/get_todos", {
        method: "GET",

    })
    const dat = await res.json()
    return dat.data as Todo[]
}
export async function postTodo(content: string) {
    const res = await fetch("http://localhost:5000/add_todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content
        })

    })
    const dat = await res.json()
    return dat.data as Todo
}
export async function deleteTodo(todoId: string) {
    const res = await fetch("http://localhost:5000/delete_todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            todoId
        })

    })
    const dat = await res.json()
    return dat.data as Todo
}