"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const websocket_service_1 = require("./services/websocket.service");
// Load environment variables
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Initialize WebSocket service
const websocketService = new websocket_service_1.WebSocketService();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/credit-scores', require('./routes/credit-score.routes'));
app.use('/api/activities', require('./routes/activity.routes'));
app.use('/api/providers', require('./routes/provider.routes'));
app.use('/api/billing', require('./routes/billing.routes'));
app.use('/api/emi', require('./routes/emi.routes'));
app.use('/api/charity', require('./routes/charity.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.message
        });
    }
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid authentication credentials'
        });
    }
    if (error.name === 'ForbiddenError') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Insufficient permissions'
        });
    }
    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            error: 'Not Found',
            message: 'Resource not found'
        });
    }
    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});
// Initialize WebSocket
websocketService.initialize(server);
// Database connection and server start
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        // Start server
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 WebSocket server initialized`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Server shut down successfully');
        process.exit(0);
    });
});
process.on('SIGINT', async () => {
    console.log('🔄 SIGINT received, shutting down gracefully');
    server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Server shut down successfully');
        process.exit(0);
    });
});
// Start the server
startServer();
exports.default = app;
