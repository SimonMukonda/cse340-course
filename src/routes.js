import express from 'express';

import { showHomePage } from './controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,        
    processEditOrganizationForm,     
    organizationValidation
} from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm,          
    processNewProjectForm,       
    projectValidation,
    showEditProjectForm,         
    processEditProjectForm       
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,       
    processAssignCategoriesForm,
    showNewCategoryForm,            
    processNewCategoryForm,         
    showEditCategoryForm,           
    processEditCategoryForm,       
    categoryValidation              
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Main routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for showing the new organization form page
router.get('/new-organization', showNewOrganizationForm);

// Route for handling new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project form page
router.get('/new-project', showNewProjectForm);

// Route for handling new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Routes to handle the edit project form
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Routes to handle new category form
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Routes to handle edit category form
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;
