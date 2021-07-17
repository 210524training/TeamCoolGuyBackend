export default {
    type: "object",
    properties: {
      id: {type: 'string'},
      text: { type: 'string' },
      created_at: { type: 'string' },
      created_by: { type: 'string' },
    },
    required: ['id', 'text', 'created_at', 'created_by']
  } as const;
  