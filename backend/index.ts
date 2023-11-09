// app.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
const bodyParser = require('body-parser');

// Connection URL and database name
const url = 'mongodb://0.0.0.0:27017/'; // Change this to your MongoDB server URL
const dbName = 'todos'; // Change this to your database name

// Create a new MongoClient
let client = new MongoClient(url);


// Function to connect to the MongoDB server
async function connectToMongoDB() {
    try {
        // Connect to the server
        await client.connect();
        console.log("MONGODB CONNECTED")

    } finally {

    }
}

connectToMongoDB().catch((e) => {
    console.error("FAILED TO CONNECT", e)
})


const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json())
// Your API routes go here
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello, World!' });
});
app.post('/add_todo', async (req, res) => {
    const content = req.body.content;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection('todos');

        // Create a document with the "content" property
        const document = { content };

        // Insert the document into the "todos" collection
        const result = await collection.insertOne(document);

        console.log('Inserted document with id:', result.insertedId);

        res.status(201).json({
            data: {
                content,
                todoId: result.insertedId.toString()
            }
        });
    } catch (error) {
        console.error('Error creating a todo item:', error);
        res.status(500).json({ error: 'Failed to create a todo item' });
    }
});


app.get('/get_todos', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('todos');

        // Find all documents in the "todos" collection
        const todos = await collection.find({}).toArray();

        // Map the results to include only "id" and "content"
        const mappedTodos = todos.map((todo) => {
            return { todoId: todo._id, content: todo.content };
        });

        res.status(200).json({ data: mappedTodos });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});
app.post('/delete_todo', async (req, res) => {
    const todoId = req.body.todoId;

    if (!todoId) {
        return res.status(400).json({ error: 'todoId is required' });
    }
    console.log(todoId)

    try {
        const db = client.db(dbName);
        const collection = db.collection('todos');

        // Use the `deleteOne` method to delete a document by its ID
        const result = await collection.deleteOne({ _id: new ObjectId(todoId) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Todo deleted successfully' });
        } else {
            console.log("not found")
            res.status(404).json({ error: 'Todo with the specified ID not found' });
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete the todo' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const cleanup = (event: any) => { // SIGINT is sent for example when you Ctrl+C a running process from the command line.
    client.close(); // Close MongodDB Connection when Process ends
    process.exit(); // Exit with default success-code '0'.
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);