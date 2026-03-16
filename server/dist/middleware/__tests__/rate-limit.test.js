"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rate_limit_1 = require("../rate-limit");
describe('Rate Limit Middleware', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let jsonMock;
    let statusMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockNext = jest.fn();
        mockRequest = {
            ip: '127.0.0.1',
            socket: {
                remoteAddress: '127.0.0.1',
            },
        };
        mockResponse = {
            json: jsonMock,
            status: statusMock,
        };
        jest.clearAllMocks();
    });
    it('should allow requests within rate limit', async () => {
        await (0, rate_limit_1.rateLimitLogin)(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(statusMock).not.toHaveBeenCalled();
    });
    it('should block requests after exceeding rate limit', async () => {
        // Make 5 requests (the limit)
        for (let i = 0; i < 5; i++) {
            await (0, rate_limit_1.rateLimitLogin)(mockRequest, mockResponse, mockNext);
        }
        // Reset mocks
        jest.clearAllMocks();
        // 6th request should be blocked
        await (0, rate_limit_1.rateLimitLogin)(mockRequest, mockResponse, mockNext);
        expect(statusMock).toHaveBeenCalledWith(429);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Too many login attempts',
            message: expect.stringContaining('Too many login attempts'),
        }));
        expect(mockNext).not.toHaveBeenCalled();
    });
    it('should use IP address from request', async () => {
        const customIp = '192.168.1.100';
        mockRequest = {
            ...mockRequest,
            ip: customIp,
        };
        await (0, rate_limit_1.rateLimitLogin)(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
    it('should handle missing IP address gracefully', async () => {
        mockRequest = {
            ip: undefined,
            socket: undefined,
        };
        await (0, rate_limit_1.rateLimitLogin)(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});
