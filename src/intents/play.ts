import * as Alexa from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const playIntent = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    handlerInput.requestEnvelope.request.intent.name === 'PlayIntent',

  handle: (handlerInput: Alexa.HandlerInput): Response => {
    const textToTell = 'I will read a fairy tail to you eventually';
    return handlerInput.responseBuilder
      .speak(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default playIntent;
