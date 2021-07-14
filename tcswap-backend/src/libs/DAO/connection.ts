const host = 'database-1.c37ikd3aravz.us-east-2.rds.amazonaws.com';
const username ='postgres';
const password = 'password';

const connectionString = `postgresql://${username}:${password}@${host}`;

export default connectionString;