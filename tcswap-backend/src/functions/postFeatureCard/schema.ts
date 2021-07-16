export default {
  type: "object",
  properties: {
    storeName: { type: 'string' },
    featuredCardId: { type: 'number' }
  },
  required: ['storeName', 'featuredCardId']
} as const;
