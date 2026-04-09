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

export const play = async (handlerInput: HandlerInput, resume: boolean): Promise<Response> => {
  const {
    currentIndex,
    offsetInMilliseconds,
    playlist
  } = await handlerInput.attributesManager.getPersistentAttributes();

  if (!playlist || playlist.length === 0) {
    return handlerInput.responseBuilder
      .speak('No audio files are available to play.')
      .getResponse();
  }

  const safeIndex = currentIndex >= 0 && currentIndex < playlist.length ? currentIndex : 0;
  const currentAudioFile: AudioFile = playlist[safeIndex];
  const textToTell = resume ? '' : `Playing ${currentAudioFile.title}`;

  return handlerInput.responseBuilder
    .speak(textToTell)
    .withShouldEndSession(true)
    .addAudioPlayerPlayDirective(
      'REPLACE_ALL',
      currentAudioFile.url,
      currentAudioFile.title,
      offsetInMilliseconds
    )
    .getResponse();
};
