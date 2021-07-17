import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import DAOUser from '@libs/DAO/DAOUser';

import schema from './schema';
import User from '@libs/models/user';

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const {username, password, firstname, lastname, role} = event.body;

  const userRole = (role==='store owner') ? ('store owner') : ('player');
  const user:User = {
    username,
    password,
    firstname,
    lastname,
    role: userRole,
  }
  let registerResult= await DAOUser.registerUser(user);
  let statusCode = 200;
  let messageOut = "register successful!";

  if(!user){
    statusCode = 404;
    messageOut = "register failed!";
    registerResult = false;
  }
  return formatJSONResponse({
    statusCode,
    message: messageOut,
    event,
    user,
    registerResult,
  });
}

export const main = middyfy(register);
