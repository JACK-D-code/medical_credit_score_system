import { Request, Response, NextFunction } from 'express';
import { rateLimitLogin } from '../rate-limit';

describe('Rate Limit Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockNext = jest.fn();

    mockRequest = {
      ip: '127.0.0.1',
      socket: {
        remoteAddress: '127.0.0.1',
      } as any,
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  it('should allow requests within rate limit', async () => {
    await rateLimitLogin(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should block requests after exceeding rate limit', async () => {
    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      await rateLimitLogin(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
    }

    // Reset mocks
    jest.clearAllMocks();

    // 6th request should be blocked
    await rateLimitLogin(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(429);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Too many login attempts',
        message: expect.stringContaining('Too many login attempts'),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should use IP address from request', async () => {
    const customIp = '192.168.1.100';
    mockRequest = {
      ...mockRequest,
      ip: customIp,
    };

    await rateLimitLogin(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle missing IP address gracefully', async () => {
    mockRequest = {
      ip: undefined,
      socket: undefined as any,
    };

    await rateLimitLogin(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
  });
});
