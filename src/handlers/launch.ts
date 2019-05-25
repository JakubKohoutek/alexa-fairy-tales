import * as Alexa from 'ask-sdk';

const launchHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type === 'LaunchRequest',

  handle: (handlerInput: Alexa.HandlerInput) => {
    const textToTell = 'Welcome to the Fairy Tales sklill';
    return handlerInput.responseBuilder
      .speak(textToTell)
      .reprompt(textToTell)
      .withSimpleCard('Fairy Tales', textToTell)
      .getResponse();
  }
};

export default launchHandler;
