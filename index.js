const http = require("http");

require("dotenv").config();
const { initDB } = require("./db.js");
const app = require("./app");

// console.log("Process: ", process.env);

initDB();

const port = process.env.PORT || "3001";
app.set("port", port);
const server = http.createServer(app);
server.listen(port);
server.on("error", (err) => {
  console.error(err);
});
server.on("listening", () => {
  console.log(`Server listening on ${server.address().port}`);
});
