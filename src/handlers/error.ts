import * as Alexa from 'ask-sdk';

const errorHandler = {
  canHandle: (): boolean => true,

  handle: (handlerInput: Alexa.HandlerInput, error?: Error) => {
    console.error(`Error handled: ${error}`);
    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please try again')
      .getResponse();
  }
};

export default errorHandler;
