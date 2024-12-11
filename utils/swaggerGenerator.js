const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Function to generate dynamic Swagger options
const generateSwaggerOptions = (models) => {
  // Define base Swagger configuration
  const baseConfig = {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic API with Swagger',
      version: '1.0.0',
      description: 'API documentation dynamically generated from models',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  // Generate paths for each model
  const paths = {};
  models.forEach((model) => {
    const modelName = model.name.toLowerCase();

    // CRUD Endpoints
    paths[`/${modelName}`] = {
      get: {
        summary: `Get all ${model.name}s`,
        tags: [model.name],
        responses: {
          200: {
            description: `List of ${model.name}s`,
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${model.name}` },
                },
              },
            },
          },
        },
      },
      post: {
        summary: `Create a new ${model.name}`,
        tags: [model.name],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${model.name}` },
            },
          },
        },
        responses: {
          201: {
            description: `${model.name} created successfully`,
          },
        },
      },
    };

    paths[`/${modelName}/{id}`] = {
      get: {
        summary: `Get a single ${model.name} by ID`,
        tags: [model.name],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: `${model.name} details`,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/${model.name}` },
              },
            },
          },
        },
      },
      put: {
        summary: `Update a ${model.name} by ID`,
        tags: [model.name],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${model.name}` },
            },
          },
        },
        responses: {
          200: {
            description: `${model.name} updated successfully`,
          },
        },
      },
      delete: {
        summary: `Delete a ${model.name} by ID`,
        tags: [model.name],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          204: {
            description: `${model.name} deleted successfully`,
          },
        },
      },
    };
  });

  // Generate schemas for each model
  const components = {
    schemas: {},
  };
  models.forEach((model) => {
    components.schemas[model.name] = {
      type: 'object',
      properties: model.fields.reduce((fields, field) => {
        fields[field.name] = { type: field.type };
        return fields;
      }, {}),
    };
  });

  return { ...baseConfig, paths, components };
};

module.exports = { generateSwaggerOptions };
