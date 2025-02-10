const net = require("net");

// Create the server
const server = net.createServer((socket) => {
  console.log("Client connected:", socket.remoteAddress);

  socket.on("data", (data) => {
    const message = data.toString().trim();
    console.log("Message received:", message);

    try {
      const response = require("./responses/" + message);
      socket.write(response?.default);
    } catch (error) {
      socket.write("Unknown command\n");
      console.error(error);
    }
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

server.listen(4028, "0.0.0.0", () => {
  console.log("TCP server listening on port 4028");
});
