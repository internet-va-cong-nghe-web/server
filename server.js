const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const config = require('config');
const mongoURL = config.get('mongoURL'); 
const userRoutes = require('./routes/api/users');
const authRoutes = require('./routes/api/auth');
const {check, validationResult} = require('express-validator');
// database connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, console.log(`Listenin
g on port ${PORT}...`));
