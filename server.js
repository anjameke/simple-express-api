const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const validateObjectId = require('./middleware/validateObjectId');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(error => console.error('MongoDB connection error:', error));


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model('User', UserSchema);

const app = express();
app.use(express.json());

// Get user by ID only if ID is properly formatted & exists & age > 21
app.get('/users/:id', validateObjectId, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            age: { $gt: 21 }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found or age is not greater than 21' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});


// Create new users (mainly for testing purposes to populate the DB)
app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const user = new User({ name, email, age });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
