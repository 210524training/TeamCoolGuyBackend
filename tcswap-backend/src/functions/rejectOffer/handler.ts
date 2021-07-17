import 'source-map-support/register';
import { DAOOffer } from '../../libs/DAO/DAOOffer'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const OfferAPI = new DAOOffer

const rejectOffer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { offerID } = event.body

  try {
    const success = await OfferAPI.alterOfferStatus(offerID, 'rejected')
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

export const main = middyfy(rejectOffer);
