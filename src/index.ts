import * as Alexa from 'ask-sdk';

import errorHandler from './handlers/error';
import launchHandler from './handlers/launch';
import sessionEndedHandler from './handlers/sessionEnded';
import cancelStopIntent from './intents/cancel_stop';
import helpIntent from './intents/help';
import playIntent from './intents/play';

export const handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    launchHandler,
    sessionEndedHandler,
    cancelStopIntent,
    helpIntent,
    playIntent,
    errorHandler
  )
  .lambda();
