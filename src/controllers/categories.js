import { getAllCategories } from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        res.status(500).send('Error loading categories');
    }
};


export { showCategoriesPage };
