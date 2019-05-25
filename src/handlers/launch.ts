import * as Alexa from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const launchHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'LaunchRequest',

  handle: (handlerInput: Alexa.HandlerInput): Response => {
    const textToTell = 'Welcome to the Fairy Tales skill';
    return handlerInput.responseBuilder
      .speak(textToTell)
      .reprompt(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default launchHandler;
