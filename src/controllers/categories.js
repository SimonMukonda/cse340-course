import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId
} from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };
