const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description:
        'A simple API documentation using swagger-ui-express and swagger-jsdoc',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./../routes/*.ts'],
};

export default options;
