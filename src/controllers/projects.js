import { getAllProjects } from '../models/projects.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        res.status(500).send('Error loading projects');
    }
};

export { showProjectsPage };
 