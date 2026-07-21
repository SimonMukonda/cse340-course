import db from './db.js';

const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category
    ORDER BY name ASC;
  `;

  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getCategoryById = async (id) => {
  const query = `
    SELECT category_id, name
    FROM category
    WHERE category_id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM category c
    JOIN project_category pc
      ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT p.project_id,
           p.title,
           p.date,
           p.location,
           o.name AS organization_name
    FROM project p
    JOIN organization o
      ON p.organization_id = o.organization_id
    JOIN project_category pc
      ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.date ASC;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows;
};

// Assign a single category to a project
const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO project_category (project_id, category_id)
    VALUES ($1, $2);
  `;
  await db.query(query, [projectId, categoryId]);
};

// Update all category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
  // Remove existing assignments
  const deleteQuery = `
    DELETE FROM project_category
    WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  // Add new assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

// Insert a new category
const createCategory = async (name) => {
  const query = `
    INSERT INTO category (name)
    VALUES ($1)
    RETURNING category_id;
  `;
  const result = await db.query(query, [name]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create category');
  }

  return result.rows[0].category_id;
};

// Update an existing category
const updateCategory = async (id, name) => {
  const query = `
    UPDATE category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;
  const result = await db.query(query, [name, id]);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  return result.rows[0].category_id;
};

export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
  createCategory,
  updateCategory
};
