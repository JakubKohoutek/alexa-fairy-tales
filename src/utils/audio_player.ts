import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';

import {PlaybackInfo} from '../interceptors/persistent_attributes';
import {AudioFile} from './audio_files';

export const getOffset = (handlerInput: HandlerInput): number => {
  if (handlerInput.requestEnvelope.request.type !== 'AudioPlayer.PlaybackStopped') {
    return 0;
  }

  return handlerInput.requestEnvelope.request.offsetInMilliseconds || 0;
};

export const getPlaybackInfo = async (
  handlerInput: HandlerInput
): Promise<PlaybackInfo> =>
  (await handlerInput.attributesManager.getPersistentAttributes()) as PlaybackInfo;

export const play = async (handlerInput: HandlerInput): Promise<Response> => {
  const {
    currentIndex,
    offsetInMilliseconds,
    playlist
  } = await handlerInput.attributesManager.getPersistentAttributes();
  const currentAudioFile: AudioFile = playlist[currentIndex];

  return handlerInput.responseBuilder
    .speak(`Playing ${currentAudioFile.title}`)
    .withShouldEndSession(true)
    .addAudioPlayerPlayDirective(
      'REPLACE_ALL',
      currentAudioFile.url,
      currentAudioFile.title,
      offsetInMilliseconds
    )
    .getResponse();
};
