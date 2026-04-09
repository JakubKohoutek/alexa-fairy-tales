import cancelStopHandler from './cancel_stop';

describe('cancelStopHandler', () => {
  it('should handle AMAZON.CancelIntent', () => {
    const input = {
      requestEnvelope: {
        request: {type: 'IntentRequest', intent: {name: 'AMAZON.CancelIntent'}}
      }
    } as any;

    expect(cancelStopHandler.canHandle(input)).toBe(true);
  });

  it('should handle AMAZON.StopIntent', () => {
    const input = {
      requestEnvelope: {
        request: {type: 'IntentRequest', intent: {name: 'AMAZON.StopIntent'}}
      }
    } as any;

    expect(cancelStopHandler.canHandle(input)).toBe(true);
  });

  it('should not handle other intents', () => {
    const input = {
      requestEnvelope: {
        request: {type: 'IntentRequest', intent: {name: 'AMAZON.HelpIntent'}}
      }
    } as any;

    expect(cancelStopHandler.canHandle(input)).toBe(false);
  });

  it('should return a goodbye message', () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const input = {
      responseBuilder: {
        speak: jest.fn().mockReturnThis(),
        withSimpleCard: jest.fn().mockReturnThis(),
        getResponse: mockGetResponse
      }
    } as any;

    cancelStopHandler.handle(input);

    expect(input.responseBuilder.speak).toHaveBeenCalledWith('Good night.');
    expect(mockGetResponse).toHaveBeenCalled();
  });
});
