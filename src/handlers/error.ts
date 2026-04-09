import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';
import {logger} from '../utils/logger';

const errorHandler = {
  canHandle: (): boolean => true,

  handle: (handlerInput: HandlerInput, error: Error): Response => {
    logger.error(`Error handled: ${error}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please try again.")
      .getResponse();
  }
};

export default errorHandler;
