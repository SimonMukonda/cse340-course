import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

// Constant for number of upcoming projects to show
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Controller for the projects list page
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).send('Error loading projects');
    }
};

// Controller for a single project details page
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        const title = 'Service Project Details';
        res.render('project', { title, project, categories });
    } catch (error) {
        console.error('Error loading project details:', error);
        res.status(500).send('Error loading project details');
    }
};

export { showProjectsPage, showProjectDetailsPage };
