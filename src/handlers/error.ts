import * as Alexa from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const errorHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput, error: Error): boolean => true,
  handle: (handlerInput: Alexa.HandlerInput, error: Error): Response => {
    console.error(`Error handled: ${error}`);
    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please try again.")
      .getResponse();
  }
};

export default errorHandler;
