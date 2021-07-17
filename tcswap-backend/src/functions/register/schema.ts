export default {
  type: "object",
  properties: {
    username: { type: 'string' },
    password: { type: 'string'},
    firstname: { type: 'string'},
    lastname: { type: 'string'},
    role: { type: 'string'},
  },
  required: ['username', 'password', 'firstname', 'lastname', 'role']
} as const;
