import AudioFiles from '../utils/audio_files';
import {
  audioPlayerEventHandler,
  nextHandler,
  previousHandler,
  resumePlaybackHandler,
  shuffleOffHandler,
  shuffleOnHandler,
  startOverHandler,
  startPlaybackHandler,
  stopPlaybackHandler
} from './audio_player';

jest.mock('../utils/audio_files');

describe('startPlaybackHandler', () => {
  it('should handle PlaybackController.PlayCommandIssued', () => {
    const input = {
      requestEnvelope: {request: {type: 'PlaybackController.PlayCommandIssued'}}
    } as any;

    expect(startPlaybackHandler.canHandle(input)).toBe(true);
  });

  it('should handle PlayAudio intent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'PlayAudio'}}}
    } as any;

    expect(startPlaybackHandler.canHandle(input)).toBe(true);
  });

  it('should not handle other intents', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.StopIntent'}}}
    } as any;

    expect(startPlaybackHandler.canHandle(input)).toBe(false);
  });
});

describe('resumePlaybackHandler', () => {
  it('should handle AMAZON.ResumeIntent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.ResumeIntent'}}}
    } as any;

    expect(resumePlaybackHandler.canHandle(input)).toBe(true);
  });
});

describe('stopPlaybackHandler', () => {
  it.each([
    'AMAZON.StopIntent',
    'AMAZON.CancelIntent',
    'AMAZON.PauseIntent'
  ])('should handle %s', (intentName) => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: intentName}}}
    } as any;

    expect(stopPlaybackHandler.canHandle(input)).toBe(true);
  });

  it('should return a stop directive', () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const input = {
      responseBuilder: {
        addAudioPlayerStopDirective: jest.fn().mockReturnThis(),
        getResponse: mockGetResponse
      }
    } as any;

    stopPlaybackHandler.handle(input);

    expect(input.responseBuilder.addAudioPlayerStopDirective).toHaveBeenCalled();
  });
});

describe('startOverHandler', () => {
  it('should handle AMAZON.StartOverIntent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.StartOverIntent'}}}
    } as any;

    expect(startOverHandler.canHandle(input)).toBe(true);
  });
});

describe('nextHandler', () => {
  it('should handle PlaybackController.NextCommandIssued', () => {
    const input = {
      requestEnvelope: {request: {type: 'PlaybackController.NextCommandIssued'}}
    } as any;

    expect(nextHandler.canHandle(input)).toBe(true);
  });

  it('should handle AMAZON.NextIntent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.NextIntent'}}}
    } as any;

    expect(nextHandler.canHandle(input)).toBe(true);
  });
});

describe('previousHandler', () => {
  it('should handle PlaybackController.PreviousCommandIssued', () => {
    const input = {
      requestEnvelope: {request: {type: 'PlaybackController.PreviousCommandIssued'}}
    } as any;

    expect(previousHandler.canHandle(input)).toBe(true);
  });

  it('should handle AMAZON.PreviousIntent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.PreviousIntent'}}}
    } as any;

    expect(previousHandler.canHandle(input)).toBe(true);
  });
});

describe('shuffleOnHandler', () => {
  it('should handle AMAZON.ShuffleOnIntent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.ShuffleOnIntent'}}}
    } as any;

    expect(shuffleOnHandler.canHandle(input)).toBe(true);
  });

  it('should not handle other intents', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.NextIntent'}}}
    } as any;

    expect(shuffleOnHandler.canHandle(input)).toBe(false);
  });

  it('should enable shuffle and reshuffle playlist keeping current track', async () => {
    const shuffledList = [
      {title: 'story2', url: 'http://example.com/story2.mp3'},
      {title: 'story1', url: 'http://example.com/story1.mp3'}
    ];
    (AudioFiles.getShuffledList as jest.Mock).mockReturnValue(shuffledList);

    const playbackInfo = {
      currentIndex: 0,
      offsetInMilliseconds: 1000,
      playlist: [
        {title: 'story1', url: 'http://example.com/story1.mp3'},
        {title: 'story2', url: 'http://example.com/story2.mp3'}
      ],
      shuffleMode: false
    };
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.ShuffleOnIntent'}}},
      attributesManager: {
        getPersistentAttributes: jest.fn().mockResolvedValue(playbackInfo)
      },
      responseBuilder: {
        speak: jest.fn().mockReturnThis(),
        withShouldEndSession: jest.fn().mockReturnThis(),
        addAudioPlayerPlayDirective: jest.fn().mockReturnThis(),
        getResponse: jest.fn().mockReturnValue({})
      }
    } as any;

    await shuffleOnHandler.handle(input);

    expect(playbackInfo.shuffleMode).toBe(true);
    expect(playbackInfo.playlist).toBe(shuffledList);
    expect(playbackInfo.currentIndex).toBe(1);
  });
});

describe('shuffleOffHandler', () => {
  it('should handle AMAZON.ShuffleOffIntent', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.ShuffleOffIntent'}}}
    } as any;

    expect(shuffleOffHandler.canHandle(input)).toBe(true);
  });

  it('should disable shuffle and restore original playlist keeping current track', async () => {
    const originalList = [
      {title: 'story1', url: 'http://example.com/story1.mp3'},
      {title: 'story2', url: 'http://example.com/story2.mp3'}
    ];
    (AudioFiles.getList as jest.Mock).mockReturnValue(originalList);

    const playbackInfo = {
      currentIndex: 0,
      offsetInMilliseconds: 1000,
      playlist: [
        {title: 'story2', url: 'http://example.com/story2.mp3'},
        {title: 'story1', url: 'http://example.com/story1.mp3'}
      ],
      shuffleMode: true
    };
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest', intent: {name: 'AMAZON.ShuffleOffIntent'}}},
      attributesManager: {
        getPersistentAttributes: jest.fn().mockResolvedValue(playbackInfo)
      },
      responseBuilder: {
        speak: jest.fn().mockReturnThis(),
        withShouldEndSession: jest.fn().mockReturnThis(),
        addAudioPlayerPlayDirective: jest.fn().mockReturnThis(),
        getResponse: jest.fn().mockReturnValue({})
      }
    } as any;

    await shuffleOffHandler.handle(input);

    expect(playbackInfo.shuffleMode).toBe(false);
    expect(playbackInfo.playlist).toBe(originalList);
    expect(playbackInfo.currentIndex).toBe(1);
  });
});

describe('audioPlayerEventHandler', () => {
  it('should handle AudioPlayer events', () => {
    const input = {
      requestEnvelope: {request: {type: 'AudioPlayer.PlaybackStarted'}}
    } as any;

    expect(audioPlayerEventHandler.canHandle(input)).toBe(true);
  });

  it('should not handle non-AudioPlayer events', () => {
    const input = {
      requestEnvelope: {request: {type: 'IntentRequest'}}
    } as any;

    expect(audioPlayerEventHandler.canHandle(input)).toBe(false);
  });

  it('should handle PlaybackStarted event', async () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const input = {
      requestEnvelope: {request: {type: 'AudioPlayer.PlaybackStarted'}},
      responseBuilder: {getResponse: mockGetResponse},
      attributesManager: {
        getPersistentAttributes: jest.fn().mockResolvedValue({
          currentIndex: 0,
          offsetInMilliseconds: 0,
          playlist: []
        })
      }
    } as any;

    await audioPlayerEventHandler.handle(input);

    expect(mockGetResponse).toHaveBeenCalled();
  });

  it('should handle PlaybackFailed without throwing', async () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const input = {
      requestEnvelope: {request: {type: 'AudioPlayer.PlaybackFailed'}},
      responseBuilder: {getResponse: mockGetResponse},
      attributesManager: {
        getPersistentAttributes: jest.fn().mockResolvedValue({
          currentIndex: 0,
          offsetInMilliseconds: 0,
          playlist: []
        })
      }
    } as any;

    await audioPlayerEventHandler.handle(input);

    expect(mockGetResponse).toHaveBeenCalled();
  });

  it('should throw on unexpected audio player events', async () => {
    const input = {
      requestEnvelope: {request: {type: 'AudioPlayer.UnknownEvent'}},
      responseBuilder: {getResponse: jest.fn()},
      attributesManager: {
        getPersistentAttributes: jest.fn().mockResolvedValue({
          currentIndex: 0,
          offsetInMilliseconds: 0,
          playlist: []
        })
      }
    } as any;

    await expect(audioPlayerEventHandler.handle(input)).rejects.toThrow('Unexpected audio player event');
  });

  it('should save offset on PlaybackStopped', async () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const playbackInfo = {
      currentIndex: 0,
      offsetInMilliseconds: 0,
      playlist: []
    };
    const input = {
      requestEnvelope: {
        request: {
          type: 'AudioPlayer.PlaybackStopped',
          offsetInMilliseconds: 5000
        }
      },
      responseBuilder: {getResponse: mockGetResponse},
      attributesManager: {
        getPersistentAttributes: jest.fn().mockResolvedValue(playbackInfo)
      }
    } as any;

    await audioPlayerEventHandler.handle(input);

    expect(playbackInfo.offsetInMilliseconds).toBe(5000);
  });
});
