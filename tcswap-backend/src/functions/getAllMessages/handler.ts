import 'source-map-support/register';
import DAOMessage  from '@libs/DAO/DAOMessage'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';



const getAllMessages: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  try {
    const data = await DAOMessage.getMessage()
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

export const main = middyfy(getAllMessages);
