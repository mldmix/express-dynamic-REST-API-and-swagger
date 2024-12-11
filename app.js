const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models');
const generateCRUDRoutes = require('./routes/crud');
const swaggerUi = require('swagger-ui-express');
const { generateSwaggerOptions } = require('./utils/swaggerGenerator');
const { getModelsFromDatabase } = require('./utils/dbSchema');

const app = express();
app.use(bodyParser.json());

// Example relationships
/* PUT YOUR RELATIONSHIPS TABLES
const relationships = {
  User: {
    posts: { model: models.Post, as: 'posts' },
  },
  Post: {
    user: { model: models.User, as: 'user' },
  },
};*/


// Register CRUD routes dynamically with relationships
Object.keys(models).forEach((modelName) => {
  if (models[modelName].name) {
    app.use(
      `/api/${modelName.toLowerCase()}`,
      generateCRUDRoutes(models[modelName], relationships[modelName] || {})
    );
  }
 /*  const swaggerOptions = generateSwaggerOptions(models);
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions)); */

});


// Start server
const PORT = 3000;
(async () => {
    const models = await getModelsFromDatabase();
    const swaggerOptions = generateSwaggerOptions(models);
  
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
  
    /* app.listen(PORT, () => {
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    }); */
  })();

models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
