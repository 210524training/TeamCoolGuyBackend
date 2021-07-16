import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        cors: true,
        path: 'store/featured',
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ]
}
