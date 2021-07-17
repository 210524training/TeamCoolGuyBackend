import 'source-map-support/register';
import DAOMessage from '@libs/DAO/DAOMessage'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';


const addCardToCollection: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { text, created_at, created_by } = event.body;

    try {
        const addMessageResult = await DAOMessage.addMessage(text, created_at, created_by);
        return formatJSONResponse({
          addMessageResult,
          event
        })
      } catch(err) {
        return formatJSONResponse({
          statusCode: 400,
          message: `Error while trying to add card to collection: ${err}`
        })
      }
}

export const main = middyfy(addCardToCollection);