import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { DAOStore } from '@libs/DAO/DAOStore';

const StoreAPI = new DAOStore;

const getFeaturedCard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { username } = event.pathParameters

  try {
    const data = await StoreAPI.getFeatured(username)
    return formatJSONResponse({
      message: data,
      event
    })
  } catch(err) {
    return formatJSONResponse({
      statusCode: 400,
      message: `There were some complications: ${err}`
    })
  }
}

export const main = middyfy(getFeaturedCard);
