
export default interface IMessage {
  _id: string,
  text: string,
  createdAt: string,
  user: { 
    _id: 'string',
    name: 'string'
 },
}