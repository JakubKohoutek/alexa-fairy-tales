import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const cancelStopIntent = {
  canHandle: (handlerInput: HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'),

  handle: (handlerInput: HandlerInput): Response => {
    const textToTell = 'Good night.';

    return handlerInput.responseBuilder
      .speak(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default cancelStopIntent;
