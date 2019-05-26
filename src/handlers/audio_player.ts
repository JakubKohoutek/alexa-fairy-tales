import {HandlerInput} from 'ask-sdk';
import {Response} from 'ask-sdk-model';
import {getOffset, getPlaybackInfo, play} from '../utils/audio_player';

export const startPlaybackHandler = {
  canHandle: (handlerInput: HandlerInput): boolean => {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'PlaybackController.PlayCommandIssued' ||
      (request.type === 'IntentRequest' && request.intent.name === 'PlayAudio')
    );
  },

  handle: async (handlerInput: HandlerInput): Promise<Response> =>
    play(handlerInput, false)
};

export const resumePlaybackHandler = {
  canHandle: (handlerInput: HandlerInput): boolean => {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'IntentRequest' && request.intent.name === 'AMAZON.ResumeIntent'
    );
  },

  handle: async (handlerInput: HandlerInput): Promise<Response> =>
    play(handlerInput, true)
};

export const stopPlaybackHandler = {
  canHandle: (handlerInput: HandlerInput): boolean => {
    const {request} = handlerInput.requestEnvelope;

    return (
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.StopIntent' ||
        request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.PauseIntent')
    );
  },

  handle: (handlerInput: HandlerInput): Response =>
    handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse()
};

export const startOverHandler = {
  canHandle: async (handlerInput: HandlerInput): Promise<boolean> => {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StartOverIntent'
    );
  },

  handle: async (handlerInput: HandlerInput): Promise<Response> => {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    playbackInfo.offsetInMilliseconds = 0;

    return play(handlerInput, false);
  }
};

export const nextHandler = {
  canHandle: async (handlerInput: HandlerInput): Promise<boolean> => {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'PlaybackController.NextCommandIssued' ||
      (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent')
    );
  },

  handle: async (handlerInput: HandlerInput): Promise<Response> => {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    playbackInfo.offsetInMilliseconds = 0;
    playbackInfo.currentIndex =
      (playbackInfo.currentIndex + 1) % playbackInfo.playlist.length;

    return play(handlerInput, false);
  }
};

export const previousHandler = {
  canHandle: async (handlerInput: HandlerInput): Promise<boolean> => {
    const request = handlerInput.requestEnvelope.request;

    return (
      request.type === 'PlaybackController.PreviousCommandIssued' ||
      (request.type === 'IntentRequest' &&
        request.intent.name === 'AMAZON.PreviousIntent')
    );
  },

  handle: async (handlerInput: HandlerInput): Promise<Response> => {
    const playbackInfo = await getPlaybackInfo(handlerInput);
    playbackInfo.offsetInMilliseconds = 0;
    const previousIndex = playbackInfo.currentIndex - 1;
    const playlistLength = playbackInfo.playlist.length;
    playbackInfo.currentIndex = previousIndex < 0 ? playlistLength - 1 : previousIndex;

    return play(handlerInput, false);
  }
};

export const audioPlayerEventHandler = {
  canHandle: (handlerInput: HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.'),

  handle: async (handlerInput: HandlerInput): Promise<Response> => {
    const {requestEnvelope, responseBuilder} = handlerInput;
    const audioPlayerEventName = requestEnvelope.request.type.split('.')[1];
    const playbackInfo = await getPlaybackInfo(handlerInput);

    switch (audioPlayerEventName) {
      case 'PlaybackStarted':
        console.info(audioPlayerEventName);
        break;
      case 'PlaybackFinished':
        console.info(audioPlayerEventName);
        break;
      case 'PlaybackStopped':
        console.info(audioPlayerEventName);
        playbackInfo.offsetInMilliseconds = getOffset(handlerInput);
        break;
      case 'PlaybackNearlyFinished':
        console.info(audioPlayerEventName);
        break;
      case 'PlaybackFailed':
        console.error(`Playback Failed :${handlerInput.requestEnvelope.request}`);
      default:
        throw new Error(`Unexpected audio player event: ${audioPlayerEventName}`);
    }

    return responseBuilder.getResponse();
  }
};
