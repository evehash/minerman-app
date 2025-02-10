const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 80;

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    const apiPath = req.url.replace("/api/", ""); // Extract path
    const filePath = path.join(__dirname, "responses", `${apiPath}.json`);

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("File not found\n");
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  } else if (req.method === "POST" && req.url.startsWith("/api/system/restart")) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    //res.end("System restart acknowledged\n");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
