export const getProductSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    message: { type: 'string' },
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'integer' },
        category: { type: 'string' },
        mainImage: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            localPath: { type: 'string' },
            _id: { type: 'string' }
          },
          required: ['url', '_id']
        },
        subImages: { type: 'array' },
        owner: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      },
      required: ['_id', 'name', 'price', 'stock', 'category', 'mainImage']
    }
  },
  required: ['statusCode', 'data', 'success']
};
