// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allows us to accept JSON data in the body

// Define a simple test route
app.get('/', (req, res) => res.send('API Running'));

// Define Routes (we will create these files next)
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/match', require('./routes/api/match'));
app.use('/api/analysis', require('./routes/api/analysis'));
app.use('/api/jobs', require('./routes/api/jobs'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));