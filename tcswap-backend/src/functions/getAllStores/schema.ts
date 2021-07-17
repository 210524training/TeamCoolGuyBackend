export default {
  type: "object",
  properties: {
    username: { type: 'string' }
  },
  required: ['store']
} as const;
