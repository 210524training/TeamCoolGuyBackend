import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        cors: true,
<<<<<<< HEAD
        path: 'store/viewStores',
=======
        path: 'store/viewstores',
      
>>>>>>> 15d47eea540d90d92d52e8777a2489354c661318
      }
    }
  ],
}
