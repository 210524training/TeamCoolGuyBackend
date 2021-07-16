import 'source-map-support/register';
import { DAOCard } from '../../libs/DAO/DAOCard'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const CardAPI = new DAOCard;

const addCardToCollection: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { username } = event.pathParameters;
    const { cardID, game, condition } = event.body;

    try {
        const success = await CardAPI.addUserCard(username, cardID, game, condition);
        return formatJSONResponse({
          message: success,
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