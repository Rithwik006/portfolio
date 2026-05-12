const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // This tells the server to serve your index.html and other files

// Use Environment Variable for MongoDB URI or fallback to local
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB database'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Project Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    githubLink: String,
    liveLink: String,
    techStack: [String]
});

const Project = mongoose.model('Project', projectSchema);

// API Endpoint to get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
});

// Optional: API Endpoint to seed the database with initial data
app.post('/api/seed', async (req, res) => {
    const initialProjects = [
        {
            title: "Imagica",
            description: "An innovative web application built to showcase creative engineering and elegant design.",
            imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            githubLink: "https://github.com/Rithwik006/imagica",
            liveLink: "https://imagica-chi.vercel.app/",
            techStack: ["React", "Three.js", "Python"]
        }
    ];

    try {
        await Project.deleteMany({}); // Clear existing
        await Project.insertMany(initialProjects);
        res.json({ message: 'Database seeded successfully with projects!' });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Run 'curl -X POST http://localhost:${PORT}/api/seed' to populate your database.`);
});
