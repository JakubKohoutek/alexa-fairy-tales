import sessionEndedHandler from './session_ended';

describe('sessionEndedHandler', () => {
  it('should handle SessionEndedRequest', () => {
    const input = {
      requestEnvelope: {request: {type: 'SessionEndedRequest'}}
    } as any;

    expect(sessionEndedHandler.canHandle(input)).toBe(true);
  });

  it('should not handle other request types', () => {
    const input = {
      requestEnvelope: {request: {type: 'LaunchRequest'}}
    } as any;

    expect(sessionEndedHandler.canHandle(input)).toBe(false);
  });

  it('should return an empty response', () => {
    const mockResponse = {};
    const input = {
      responseBuilder: {
        getResponse: jest.fn().mockReturnValue(mockResponse)
      }
    } as any;

    const result = sessionEndedHandler.handle(input);

    expect(result).toBe(mockResponse);
  });
});
