import {SkillBuilders} from 'ask-sdk';

import {
  audioPlayerEventHandler,
  nextHandler,
  previousHandler,
  resumePlaybackHandler,
  startOverHandler,
  startPlaybackHandler,
  stopPlaybackHandler
} from './handlers/audio_player';
import cancelStopHandler from './handlers/cancel_stop';
import errorHandler from './handlers/error';
import helpHandler from './handlers/help';
import launchHandler from './handlers/launch';
import sessionEndedHandler from './handlers/session_ended';

import {
  loadPersistentAttributes,
  savePersistentAttributes
} from './interceptors/persistent_attributes';

import MemoryPersistenceAdapter from './utils/persistence_adapter';

export const skill = SkillBuilders.custom()
  .addRequestHandlers(
    launchHandler,
    sessionEndedHandler,
    cancelStopHandler,
    helpHandler,
    audioPlayerEventHandler,
    startPlaybackHandler,
    resumePlaybackHandler,
    stopPlaybackHandler,
    startOverHandler,
    nextHandler,
    previousHandler
  )
  .addRequestInterceptors(loadPersistentAttributes)
  .addResponseInterceptors(savePersistentAttributes)
  .addErrorHandlers(errorHandler)
  .withPersistenceAdapter(new MemoryPersistenceAdapter())
  .create();
