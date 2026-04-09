import errorHandler from './error';

describe('errorHandler', () => {
  it('should handle any error', () => {
    expect(errorHandler.canHandle()).toBe(true);
  });

  it('should return an error response', () => {
    const mockGetResponse = jest.fn().mockReturnValue({});
    const input = {
      responseBuilder: {
        speak: jest.fn().mockReturnThis(),
        getResponse: mockGetResponse
      }
    } as any;

    errorHandler.handle(input, new Error('test error'));

    expect(input.responseBuilder.speak).toHaveBeenCalledWith(
      expect.stringContaining('Sorry')
    );
    expect(mockGetResponse).toHaveBeenCalled();
  });
});
