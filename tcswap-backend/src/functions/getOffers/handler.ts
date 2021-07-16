import 'source-map-support/register';
import { DAOOffer } from '../../libs/DAO/DAOOffer'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const OfferAPI = new DAOOffer

const getOffers: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const { username } = event.pathParameters

  try {
    const data = await OfferAPI.getUserOffers(username)
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

export const main = middyfy(getOffers);
