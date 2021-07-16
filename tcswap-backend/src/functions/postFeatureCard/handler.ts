import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { DAOStore } from '@libs/DAO/DAOStore';

const StoreAPI = new DAOStore


const postFeaturedCard: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { storeName, featuredCardId } = event.body;
  const isSet = StoreAPI.setFeatured(storeName, featuredCardId);
  
  return formatJSONResponse({
    message: isSet,
    event,
  });
}

export const main = middyfy(postFeaturedCard);
