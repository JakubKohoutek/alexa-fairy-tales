import * as Alexa from 'ask-sdk';

const cancelStopIntent = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'),

  handle: (handlerInput: Alexa.HandlerInput) => {
    const textToTell = 'Good night.';
    return handlerInput.responseBuilder
      .speak(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default cancelStopIntent;
