import * as Alexa from 'ask-sdk';
import {Response} from 'ask-sdk-model';

const audioData = [
  {
    title: 'Episode 1',
    url:
      'https://tunnel.myslenkynezastavis.cz/Mikes-Sevcuv-cunik-uz-take-mluvi.mp3'
  }
];

export const StartPlaybackHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean => {
    const request = handlerInput.requestEnvelope.request;
    if (
      request.type === 'IntentRequest' &&
      request.intent.name === 'PlayAudio'
    ) {
      return true;
    }
    if (request.type === 'PlaybackController.PlayCommandIssued') {
      return true;
    }
    if (request.type === 'IntentRequest') {
      return (
        request.intent.name === 'PlayAudio' ||
        request.intent.name === 'AMAZON.ResumeIntent'
      );
    }
    return false;
  },
  handle: (handlerInput: Alexa.HandlerInput): Response =>
  handlerInput.responseBuilder
    .speak(`Playing ${audioData[0].title}`)
    .withShouldEndSession(true)
    .addAudioPlayerPlayDirective(
      'REPLACE_ALL',
      audioData[0].url,
      audioData[0].title,
      0
    )
    .getResponse()
};

export const StopPlaybackHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean => {
    const {request} = handlerInput.requestEnvelope;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.StopIntent' ||
      request.intent.name === 'AMAZON.CancelIntent' ||
      request.intent.name === 'AMAZON.PauseIntent');
  },
  handle: (handlerInput: Alexa.HandlerInput): Response =>
    handlerInput.responseBuilder
      .addAudioPlayerStopDirective()
      .getResponse()
};

export const AudioPlayerEventHandler = {
  canHandle: (handlerInput: Alexa.HandlerInput): boolean =>
    handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.'),
  handle: async (handlerInput: Alexa.HandlerInput): Promise<Response> => {
    const {requestEnvelope, responseBuilder} = handlerInput;
    const audioPlayerEventName = requestEnvelope.request.type.split('.')[1];

    switch (audioPlayerEventName) {
      case 'PlaybackStarted':
        console.log(audioPlayerEventName);
        break;
      case 'PlaybackFinished':
        console.log(audioPlayerEventName);
        break;
      case 'PlaybackStopped':
        console.log(audioPlayerEventName);
        break;
      case 'PlaybackNearlyFinished':
        console.log(audioPlayerEventName);
        break;
      case 'PlaybackFailed':
        console.error(
          `Playback Failed :${handlerInput.requestEnvelope.request}`
        );
      default:
        throw new Error('Should never reach here!');
    }

    return responseBuilder.getResponse();
  }
};
