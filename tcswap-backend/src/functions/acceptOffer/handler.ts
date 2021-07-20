import 'source-map-support/register';
import { DAOOffer } from '../../libs/DAO/DAOOffer'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import Offer from '@libs/models/offer';

const OfferAPI = new DAOOffer

const acceptOffer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const offer = event.body.Offer as Offer;

  try {
    const success = await OfferAPI.makeTrade(offer)
    return formatJSONResponse({
      message: success,
      event
    })
  } catch(err) {
    return formatJSONResponse({
      statusCode: 400,
      message: `Error while attempting offer change: ${err}`
    })
  }
}

export const main = middyfy(acceptOffer);
