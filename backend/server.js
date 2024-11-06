const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.get("/", (req, res) => {
  res.send("hi... hello hru..........................");
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const expenseRoutes = require('./routes/expenseRoute');
app.use('/api/expenses', expenseRoutes);


// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running 
    on port ${PORT}`);
});
