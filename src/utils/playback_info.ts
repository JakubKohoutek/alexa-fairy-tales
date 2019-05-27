import {PlaybackInfo} from '../interceptors/persistent_attributes';

export const setNextFile = (playbackInfo: PlaybackInfo): void => {
  playbackInfo.offsetInMilliseconds = 0;
  playbackInfo.currentIndex =
    (playbackInfo.currentIndex + 1) % playbackInfo.playlist.length;
};

export const setPrevFile = (playbackInfo: PlaybackInfo): void => {
  playbackInfo.offsetInMilliseconds = 0;
  const previousIndex = playbackInfo.currentIndex - 1;
  const playlistLength = playbackInfo.playlist.length;
  playbackInfo.currentIndex = previousIndex < 0 ? playlistLength - 1 : previousIndex;
};
