"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const provider_patient_routes_1 = __importDefault(require("./routes/provider-patient.routes"));
const score_routes_1 = __importDefault(require("./routes/score.routes"));
const provider_routes_1 = __importDefault(require("./routes/provider.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const billing_routes_1 = __importDefault(require("./routes/billing.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const claims_routes_1 = __importDefault(require("./routes/claims.routes"));
const pos_routes_1 = __importDefault(require("./routes/pos.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const port = process.env.PORT || 5000;
// Initialize Socket.IO
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || origin.startsWith('http://localhost:')) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }
});
app.set('io', exports.io);
// Socket connection handling
exports.io.on('connection', (socket) => {
    console.log(`[socket] Client connected: ${socket.id}`);
    // When a patient connects, they join a room specific to their PH-ID
    socket.on('join_phid_room', (phid) => {
        if (phid) {
            socket.join(`room_${phid}`);
            console.log(`[socket] Client ${socket.id} joined room: room_${phid}`);
        }
    });
    socket.on('join_user_room', (userId) => {
        if (userId) {
            socket.join(`user_room_${userId}`);
            console.log(`[socket] Client ${socket.id} joined user_room: user_room_${userId}`);
        }
    });
    socket.on('disconnect', () => {
        console.log(`[socket] Client disconnected: ${socket.id}`);
    });
});
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow all local origins during development
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
// Main API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/patients', patient_routes_1.default);
app.use('/api/provider/patients', provider_patient_routes_1.default);
app.use('/api/scores', score_routes_1.default);
app.use('/api/providers', provider_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/billing', billing_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/claims', claims_routes_1.default);
app.use('/api/pos', pos_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', message: 'Medical Credit Score System API is running' });
});
httpServer.listen(port, () => {
    console.log(`[server]: API Server is running at http://localhost:${port}`);
    console.log(`[server]: WebSocket server initialized on same port.`);
});
