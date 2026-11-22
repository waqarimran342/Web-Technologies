
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let tasks = [
  { id: 1, title: "Learn EJS", done: false },
  { id: 2, title: "Add a shared layout", done: false },
];

let nextId = 3;

// Home page
app.get("/", (req, res) => {
  res.render("index", { title: "My Tasks", tasks });
});

// Add a task
app.post("/tasks", (req, res) => {
  const title = (req.body.title || "").trim();

  if (title) {
    tasks.push({ id: nextId++, title, done: false });
  }

  res.redirect("/");
});

// Toggle task status
app.post("/tasks/:id/toggle", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));

  if (task) {
    task.done = !task.done;
  }

  res.redirect("/");
});

// Delete a task
app.post("/tasks/:id/delete", (req, res) => {
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));

  res.redirect("/");
});

// Display edit form
app.get("/tasks/:id/edit", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return res.redirect("/");
  }

  res.render("edit", { title: "Edit Task", task });
});

// Update task title
// HTML forms cannot directly send PUT, so we use POST
app.post("/tasks/:id/edit", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  const title = (req.body.title || "").trim();

  if (task && title) {
    task.title = title;
  }

  res.redirect("/");
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { title: "About This App" });
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`EJS Tasks app listening on http://localhost:${PORT}`);
});
