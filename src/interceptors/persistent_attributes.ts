import {HandlerInput} from 'ask-sdk';

import AudioFiles, {AudioFile} from '../utils/audio_files';

export interface PlaybackInfo {
  currentIndex: number;
  offsetInMilliseconds: number;
  playlist: AudioFile[];
}

export const loadPersistentAttributes = {
  process: async (handlerInput: HandlerInput): Promise<void> => {
    const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    if (Object.keys(persistentAttributes).length === 0) {
      const initialPlaybackInfo: PlaybackInfo = {
        currentIndex: 0,
        offsetInMilliseconds: 0,
        playlist: AudioFiles.getShuffledList()
      };
      handlerInput.attributesManager.setPersistentAttributes(initialPlaybackInfo);
    }
  }
};

export const savePersistentAttributes = {
  process: async (handlerInput: HandlerInput): Promise<void> => {
    await handlerInput.attributesManager.savePersistentAttributes();
  }
};
