import {
  audioPlayerEventHandler,
  nextHandler,
  previousHandler,
  resumePlaybackHandler,
  startOverHandler,
  startPlaybackHandler,
  stopPlaybackHandler
} from './audio_player';

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
