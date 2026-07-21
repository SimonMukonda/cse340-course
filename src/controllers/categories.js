import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation rules for categories (server-side)
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

// Controller for categories list page
const showCategoriesPage = async (req, res) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
  } catch (error) {
    console.error('Error loading categories:', error);
    res.status(500).send('Error loading categories');
  }
};

// Controller for category details page
const showCategoryDetailsPage = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    const title = 'Category Details';
    res.render('category', { title, category, projects });
  } catch (error) {
    console.error('Error loading category details:', error);
    res.status(500).send('Error loading category details');
  }
};

// Show assign categories form
const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = 'Assign Categories to Project';

  res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

// Handle assign categories form submission
const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

  await updateCategoryAssignments(projectId, categoryIdsArray);

  req.flash('success', 'Categories updated successfully.');
  res.redirect(`/project/${projectId}`);
};

// Show new category form
const showNewCategoryForm = (req, res) => {
  const title = 'Add New Category';
  res.render('new-category', { title });
};

// Handle new category form submission
const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect('/new-category');
  }

  const { name } = req.body;

  try {
    const newCategoryId = await createCategory(name);
    req.flash('success', 'New category created successfully!');
    res.redirect(`/category/${newCategoryId}`);
  } catch (error) {
    console.error('Error creating category:', error);
    req.flash('error', 'There was an error creating the category.');
    res.redirect('/new-category');
  }
};

// Show edit category form
const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    req.flash('error', 'Category not found.');
    return res.redirect('/categories');
  }

  const title = 'Edit Category';
  res.render('edit-category', { title, category });
};

// Handle edit category form submission
const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;

  try {
    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error('Error updating category:', error);
    req.flash('error', 'There was an error updating the category.');
    res.redirect(`/edit-category/${categoryId}`);
  }
};

export { 
  showCategoriesPage, 
  showCategoryDetailsPage, 
  showAssignCategoriesForm, 
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
};

