export default interface User{
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    role: 'player'| 'store owner'
};