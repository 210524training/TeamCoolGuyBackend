export default {
    type: "object",
    properties: {
      text: { type: 'string' },
      created_at: { type: 'string' },
      created_by: { type: 'string' },
    },
    required: ['text', 'created_at', 'created_by']
  } as const;
  