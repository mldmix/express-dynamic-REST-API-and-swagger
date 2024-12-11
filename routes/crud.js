const express = require('express');

module.exports = (Model, associations = {}) => {
  const router = express.Router();

  // GET all records with relationships
  router.get('/', async (req, res) => {
    try {
      const options = {};
      if (Object.keys(associations).length > 0) {
        options.include = Object.values(associations).map((relation) => ({
          model: relation.model,
          as: relation.as,
        }));
      }
      const items = await Model.findAll(options);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET a single record with relationships
  router.get('/:id', async (req, res) => {
    try {
      const options = { where: { id: req.params.id } };
      if (Object.keys(associations).length > 0) {
        options.include = Object.values(associations).map((relation) => ({
          model: relation.model,
          as: relation.as,
        }));
      }
      const item = await Model.findOne(options);
      item ? res.json(item) : res.status(404).send('Not Found');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Nested route for related records
  Object.entries(associations).forEach(([relationName, relation]) => {
    router.get(`/:id/${relationName}`, async (req, res) => {
      try {
        const parent = await Model.findByPk(req.params.id);
        if (!parent) return res.status(404).send('Not Found');

        const relatedItems = await parent[`get${relationName[0].toUpperCase() + relationName.slice(1)}`]();
        res.json(relatedItems);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

  return router;
};
