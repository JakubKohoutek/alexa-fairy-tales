import launchHandler from './launch';

describe('launchHandler', () => {
  const mockGetResponse = jest.fn().mockReturnValue({});
  const mockHandlerInput = {
    requestEnvelope: {
      request: {type: 'LaunchRequest'}
    },
    responseBuilder: {
      speak: jest.fn().mockReturnThis(),
      reprompt: jest.fn().mockReturnThis(),
      withSimpleCard: jest.fn().mockReturnThis(),
      getResponse: mockGetResponse
    }
  } as any;

  it('should handle LaunchRequest', () => {
    expect(launchHandler.canHandle(mockHandlerInput)).toBe(true);
  });

  it('should not handle other request types', () => {
    const other = {
      requestEnvelope: {request: {type: 'IntentRequest'}}
    } as any;

    expect(launchHandler.canHandle(other)).toBe(false);
  });

  it('should return a welcome message', () => {
    launchHandler.handle(mockHandlerInput);

    expect(mockHandlerInput.responseBuilder.speak).toHaveBeenCalledWith(
      expect.stringContaining('Welcome')
    );
    expect(mockGetResponse).toHaveBeenCalled();
  });
});
