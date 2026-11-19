const express = require("express");

const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Rewrite the http-module API", done: false },
];
let nextId = 3;

app.get("/tasks", (req, res, next) => {
  try {
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.get("/tasks/:id", (req, res, next) => {
  try {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

app.post("/tasks", (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "'title' is required" });
    }
    const newTask = { id: nextId++, title, done: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// Task 1: validation for PUT
app.put("/tasks/:id", (req, res, next) => {
  try {
    const task = tasks.find((t) => t.id === Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { title, done } = req.body;

    if (title === undefined && done === undefined) {
      return res
        .status(400)
        .json({ error: "Send at least one of 'title' or 'done'" });
    }
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return res
        .status(400)
        .json({ error: "'title' must be a non-empty string" });
    }
    if (done !== undefined && typeof done !== "boolean") {
      return res.status(400).json({ error: "'done' must be true or false" });
    }

    if (title !== undefined) task.title = title;
    if (done !== undefined) task.done = done;

    res.json(task);
  } catch (error) {
    next(error);
  }
});

app.delete("/tasks/:id", (req, res, next) => {
  try {
    const index = tasks.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Task not found" });
    const [deleted] = tasks.splice(index, 1);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

// Task 2: test route that always fails (remove after testing)
app.get("/boom", (req, res, next) => {
  try {
    throw new Error("Something went wrong on purpose");
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

// Task 2: error-handling middleware (4 arguments, registered last)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Tasks API (Express) listening on http://localhost:${PORT}`);
});
