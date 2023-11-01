/* eslint-disable prettier/prettier */
export enum RabbitMQ {
  ProductQueue = 'products',
}

export enum ProductMSG {
  CREATE = 'CREATE_PRODUCT',
  FIND_ALL = 'FIND_PRODUCTS',
  FIND_ONE = 'FIND_PRODUCT',
  UPDATE = 'UPDATE_PRODUCT',
  DELETE = 'DELETE_PRODUCT',
}
