import * as Alexa from 'ask-sdk';

const sessionEndedHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'SessionEndedRequest',

  handle: (handlerInput: Alexa.HandlerInput) =>
    handlerInput.responseBuilder.getResponse()
};

export default sessionEndedHandler;
