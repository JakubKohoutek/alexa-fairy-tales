import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const launchHandler = {
  canHandle: (handlerInput: HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'LaunchRequest',

  handle: (handlerInput: HandlerInput): Response => {
    const textToTell = 'Welcome to the Fairy Tales skill. You can tell me to play.';

    return handlerInput.responseBuilder
      .speak(textToTell)
      .reprompt(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default launchHandler;
