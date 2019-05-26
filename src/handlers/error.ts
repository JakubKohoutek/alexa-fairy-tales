import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const errorHandler = {
  canHandle: (): boolean => true,

  handle: (handlerInput: HandlerInput, error: Error): Response => {
    console.error(`Error handled: ${error}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please try again.")
      .getResponse();
  }
};

export default errorHandler;
