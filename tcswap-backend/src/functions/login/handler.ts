import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import DAOUser from '@libs/DAO/DAOUser';

import schema from './schema';

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const {username, password} = event.body;
  const user = await DAOUser.verifyLogin(username, password);
  let loginResult= true;
  let statusCode = 200;
  let messageOut = "login successful!";

  if(!user){
    statusCode = 404;
    messageOut = "login failed!";
    loginResult = false;
  }

  

  return formatJSONResponse({
    statusCode,
    message: messageOut,
    event,
    user,
    loginResult,
  });
}

export const main = middyfy(login);
