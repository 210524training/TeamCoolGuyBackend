import 'source-map-support/register';
import DAOMessage  from '@libs/DAO/DAOMessage'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const getMessages: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  try {
    const messages = await DAOMessage.getMessage();
    return formatJSONResponse({
      messages,
      event
    })
  } catch(err) {
    return formatJSONResponse({
      statusCode: 400,
      message: `There were some complications: ${err}`
    })
  }
}

export const main = middyfy(getMessages);
