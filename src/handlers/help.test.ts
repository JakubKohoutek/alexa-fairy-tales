import helpHandler from './help';

describe('helpHandler', () => {
  it('should handle AMAZON.HelpIntent', () => {
    const input = {
      requestEnvelope: {
        request: {type: 'IntentRequest', intent: {name: 'AMAZON.HelpIntent'}}
      }
    } as any;

    expect(helpHandler.canHandle(input)).toBe(true);
  });

  it('should not handle other intents', () => {
    const input = {
      requestEnvelope: {
        request: {type: 'IntentRequest', intent: {name: 'PlayAudio'}}
      }
    } as any;

    expect(helpHandler.canHandle(input)).toBe(false);
  });

  it('should return a help response', () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const input = {
      requestEnvelope: {
        request: {type: 'IntentRequest', intent: {name: 'AMAZON.HelpIntent'}}
      },
      responseBuilder: {
        speak: jest.fn().mockReturnThis(),
        reprompt: jest.fn().mockReturnThis(),
        withSimpleCard: jest.fn().mockReturnThis(),
        getResponse: mockGetResponse
      }
    } as any;

    helpHandler.handle(input);

    expect(input.responseBuilder.speak).toHaveBeenCalledWith(expect.stringContaining('play'));
    expect(mockGetResponse).toHaveBeenCalled();
  });
});
