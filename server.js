require("dotenv").config();
const express = require("express");
const connectMongoDB = require("./src/config/db");
const mainRouter = require("./src/routes");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
connectMongoDB(process.env.MONGODB_URL);
app.use("/api", mainRouter);

app.use("/api", mainRouter);

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("Testing route.");
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
