const http = require("http");

// ------------------------------------------------------------
// In-memory data -- resets every time the server restarts.
// Each task is { id, title, done }.
// ------------------------------------------------------------
let tasks = [
  { id: 1, title: "Learn the http module", done: false },
  { id: 2, title: "Build a tiny API with no framework", done: false },
];
let nextId = 3;

// ------------------------------------------------------------
// Helper: send a JSON response with the right status + headers
// ------------------------------------------------------------
function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

// ------------------------------------------------------------
// Helper: read and parse a JSON request body, chunk by chunk
// ------------------------------------------------------------
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

// ------------------------------------------------------------
// The server: this function runs for EVERY incoming request
// ------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // ---------- GET /tasks : list all tasks ----------
  if (method === "GET" && url === "/tasks") {
    return sendJson(res, 200, tasks);
  }

  // Regex that pulls the id out of URLs like /tasks/7
  // (used by both GET /tasks/:id and DELETE /tasks/:id)
  const singleTaskMatch = url.match(/^\/tasks\/(\d+)$/);

  // ---------- GET /tasks/:id : get one task ----------
  if (method === "GET" && singleTaskMatch) {
    const id = Number(singleTaskMatch[1]);
    const task = tasks.find((t) => t.id === id);
    if (!task) return sendJson(res, 404, { error: "Task not found" });
    return sendJson(res, 200, task);
  }

  // ---------- DELETE /tasks/:id : delete a task ----------
  // [TRY IT YOURSELF #1]
  if (method === "DELETE" && singleTaskMatch) {
    const id = Number(singleTaskMatch[1]);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return sendJson(res, 404, { error: "Task not found" });

    // splice removes the item and returns an array of removed items
    const [deletedTask] = tasks.splice(index, 1);
    return sendJson(res, 200, deletedTask);
  }

  // ---------- POST /tasks : create a task ----------
  if (method === "POST" && url === "/tasks") {
    // [TRY IT YOURSELF #2] Reject anything that isn't JSON with 415.
    // Header names are lowercase in Node; "includes" allows
    // values like "application/json; charset=utf-8".
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("application/json")) {
      return sendJson(res, 415, {
        error: "Content-Type must be application/json",
      });
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      return sendJson(res, 400, { error: "Invalid JSON body" });
    }

    if (!body.title || typeof body.title !== "string") {
      return sendJson(res, 400, { error: "'title' is required" });
    }

    const newTask = { id: nextId++, title: body.title, done: false };
    tasks.push(newTask);
    return sendJson(res, 201, newTask);
  }

  // ---------- Catch-all: no route matched ----------
  // Without this, unknown URLs would hang forever.
  sendJson(res, 404, { error: `No route for ${method} ${url}` });
});

// ------------------------------------------------------------
// Start listening
// ------------------------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Tasks API (raw http module) listening on http://localhost:${PORT}`);
});