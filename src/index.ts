import * as Alexa from 'ask-sdk';
import bodyParser from 'body-parser';
import express from 'express';

import {
  AudioPlayerEventHandler,
  StartPlaybackHandler,
  StopPlaybackHandler
} from './handlers/audio_player';
import errorHandler from './handlers/error';
import launchHandler from './handlers/launch';
import sessionEndedHandler from './handlers/session_ended';
import cancelStopIntent from './intents/cancel_stop';
import helpIntent from './intents/help';
import playIntent from './intents/play';

export const skill = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    launchHandler,
    sessionEndedHandler,
    cancelStopIntent,
    helpIntent,
    AudioPlayerEventHandler,
    StartPlaybackHandler,
    StopPlaybackHandler,
    playIntent
  )
  .addErrorHandlers(errorHandler)
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

app.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.info('Skill handler is listening on port 3000!');
});
