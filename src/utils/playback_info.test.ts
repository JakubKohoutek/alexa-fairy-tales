import {PlaybackInfo} from '../interceptors/persistent_attributes';
import {setNextFile, setPrevFile} from './playback_info';

const makePlaybackInfo = (currentIndex: number, length: number): PlaybackInfo => ({
  currentIndex,
  offsetInMilliseconds: 500,
  playlist: Array.from({length}, (_, i) => ({title: `track${i}`, url: `http://example.com/${i}.mp3`})),
  shuffleMode: false
});

describe('setNextFile', () => {
  it('should advance to the next track', () => {
    const info = makePlaybackInfo(0, 3);
    setNextFile(info);

    expect(info.currentIndex).toBe(1);
    expect(info.offsetInMilliseconds).toBe(0);
  });

  it('should wrap around to the beginning', () => {
    const info = makePlaybackInfo(2, 3);
    setNextFile(info);

    expect(info.currentIndex).toBe(0);
  });
});

describe('setPrevFile', () => {
  it('should go to the previous track', () => {
    const info = makePlaybackInfo(2, 3);
    setPrevFile(info);

    expect(info.currentIndex).toBe(1);
    expect(info.offsetInMilliseconds).toBe(0);
  });

  it('should wrap around to the last track', () => {
    const info = makePlaybackInfo(0, 3);
    setPrevFile(info);

    expect(info.currentIndex).toBe(2);
  });
});
