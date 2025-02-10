const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const mongoConnection = process.env.MONGO_CONNECTION;

app.use(
  cors({
    origin: "*",
  })
);

// Middleware routes
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected To MongoDB"))
  .catch((err) => console.error("Error while connecting to database"));

// Routes middleware
app.use("/api", authRoutes);
app.use("/api", groupRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
