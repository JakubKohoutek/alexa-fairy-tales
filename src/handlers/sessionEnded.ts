import * as Alexa from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const sessionEndedHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'SessionEndedRequest',

  handle: (handlerInput: Alexa.HandlerInput): Response =>
    handlerInput.responseBuilder.getResponse()
};

export default sessionEndedHandler;
