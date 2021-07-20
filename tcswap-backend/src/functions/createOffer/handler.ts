import 'source-map-support/register';
import  DAOOffer from '../../libs/DAO/DAOOffer'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import Offer from '@libs/models/offer';



const acceptOffer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const newOffer = event.body.newOffer as Offer;

  try {
    let success = true;
    const offerID = await DAOOffer.createOffer(newOffer.requestor, newOffer.decider);
    if(offerID>0){
      success = false;
      let addDeciderCardResult: boolean;
      let addRequestorCardResult: boolean;

      for(let card of newOffer.requestorCards){
        addRequestorCardResult = await DAOOffer.addToOffer(offerID, card.id, 'requestor');
        if(!addRequestorCardResult) success = false;
      }
      for(let card of newOffer.deciderCards){
        addDeciderCardResult = await DAOOffer.addToOffer(offerID, card.id, 'decider');
        if(!addDeciderCardResult) success = false;
      }
    }else{
      success = false;
    }

    if(!success) throw new Error("failed to make offer")
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
