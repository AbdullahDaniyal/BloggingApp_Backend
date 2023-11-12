const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://abdullahdaniyal:superflies1234@cluster0.s5b7diq.mongodb.net/BloggingApp')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error', err));

// Routes
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.use('/admin', adminRoutes);

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
