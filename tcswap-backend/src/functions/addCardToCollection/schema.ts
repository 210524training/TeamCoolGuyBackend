export default {
    type: "object",
    properties: {
      cardID: { type: 'string' },
      game: { type: 'string' },
      condition: { type: 'string' },
    },
    required: ['cardID', 'game', 'condition']
  } as const;
  