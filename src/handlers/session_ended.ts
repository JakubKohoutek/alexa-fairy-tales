import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const sessionEndedHandler = {
  canHandle: (handlerInput: HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'SessionEndedRequest',

  handle: (handlerInput: HandlerInput): Response =>
    handlerInput.responseBuilder.getResponse()
};

export default sessionEndedHandler;
