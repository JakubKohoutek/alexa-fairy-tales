import {SkillBuilders} from 'ask-sdk';
import bodyParser from 'body-parser';
import express from 'express';

import {
  audioPlayerEventHandler,
  nextHandler,
  startOverHandler,
  startPlaybackHandler,
  stopPlaybackHandler
} from './handlers/audio_player';
import errorHandler from './handlers/error';
import launchHandler from './handlers/launch';
import sessionEndedHandler from './handlers/session_ended';
import cancelStopIntent from './intents/cancel_stop';
import helpIntent from './intents/help';
import playIntent from './intents/play';
import {
  loadPersistentAttributes,
  savePersistentAttributes
} from './interceptors/persistent_attributes';

import MemoryPersistenceAdapter from './utils/persistence_adapter';

import AudioFiles from './utils/audio_files';

export const skill = SkillBuilders.custom()
  .addRequestHandlers(
    launchHandler,
    sessionEndedHandler,
    cancelStopIntent,
    helpIntent,
    audioPlayerEventHandler,
    startPlaybackHandler,
    stopPlaybackHandler,
    startOverHandler,
    nextHandler,
    playIntent
  )
  .addRequestInterceptors(loadPersistentAttributes)
  .addResponseInterceptors(savePersistentAttributes)
  .addErrorHandlers(errorHandler)
  .withPersistenceAdapter(new MemoryPersistenceAdapter())
  .create();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public_media'));

app.post('/', async (req, res) => {
  const response = await skill.invoke(req.body);
  res.send(response);
});

app.get('/', (req, res) => {
  res.send('Skill handler is up and running.');
});

app.listen(3000, async () => {
  try {
    await AudioFiles.load();
  } catch (error) {
    console.error('Could not read media files', error);
  }

  console.info('Skill handler is listening on port 3000!');
});
