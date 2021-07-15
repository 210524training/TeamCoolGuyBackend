import 'source-map-support/register';
import DAOCard  from '@libs/DAO/DAOCard'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';



const getCardCollection: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { username } = event.pathParameters

  try {
    const data = await DAOCard.getUserCards(username)
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

export const main = middyfy(getCardCollection);
