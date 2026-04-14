// get common success product schema
export const productSuccessSchema = {
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
        category: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
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
        updatedAt: { type: 'string', format: 'date-time' },
        __v: { type: 'integer' }
      },
      required: ['_id', 'name', 'price', 'category', 'mainImage']
    }
  },
  required: ['statusCode', 'data', 'success', 'message']
};

// get delete product schema
export const productDeleteSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    message: { type: 'string' },
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        deletedProduct: {
          type: 'object',
          // Используем те же поля, что и в основном продукте
          properties: {
            _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
            name: { type: 'string' },
            price: { type: 'number' }
          },
          required: ['_id', 'name']
        }
      },
      required: ['deletedProduct']
    }
  },
  required: ['statusCode', 'data', 'success']
};

// single item in getAllProducts
const productItemSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    stock: { type: 'integer' },
    category: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
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
    updatedAt: { type: 'string', format: 'date-time' },
    __v: { type: 'integer' }
  },
  required: ['_id', 'name', 'price', 'category']
};

// get all products full schema
export const productListSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    message: { type: 'string' },
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: productItemSchema
        },
        totalProducts: { type: 'integer' },
        limit: { type: 'integer' },
        page: { type: 'integer' },
        totalPages: { type: 'integer' },
        serialNumberStartFrom: { type: 'integer' },
        hasPrevPage: { type: 'boolean' },
        hasNextPage: { type: 'boolean' },
        prevPage: { type: ['null', 'integer'] },
        nextPage: { type: ['null', 'integer'] }
      },
      required: ['products', 'totalProducts', 'limit', 'page']
    }
  },
  required: ['statusCode', 'data', 'success']
};

// get create product without access schema
export const productWithoutAccessSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer' },
    data: { type: 'null' },
    success: { type: 'boolean' },
    errors: {
      type: 'array',
      items: {}
    },
    message: { type: 'string' }
  },
  required: ['statusCode', 'data', 'success', 'errors', 'message']
};
