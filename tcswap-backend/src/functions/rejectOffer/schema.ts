export default {
    type: "object",
    properties: {
      offerID: { type: 'number' },
      username: { type: 'number' },
    },
    required: ['offerID']
  } as const;
  