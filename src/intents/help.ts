import * as Alexa from 'ask-sdk';

const helpIntent = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent',

  handle: (handlerInput: Alexa.HandlerInput) => {
    const textToTell = 'You can tell me to play';
    return handlerInput.responseBuilder
      .speak(textToTell)
      .reprompt(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default helpIntent;
