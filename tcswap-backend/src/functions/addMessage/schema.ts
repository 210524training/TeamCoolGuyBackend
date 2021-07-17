export default {
    type: "object",
    properties: {
      _id: { type: 'string' },
      text: { type: 'string' },
      created_at: { type: 'string' },
      created_by: { type: 'string' },
    },
    required: ['text', 'created_at', 'created_by']
  } as const;
  