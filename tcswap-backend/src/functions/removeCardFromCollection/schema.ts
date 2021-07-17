export default {
    type: "object",
    properties: {
      cardID: { type: 'string' },
      condition: { type: 'string' },
    },
    required: ['cardID', 'condition']
  } as const;
  