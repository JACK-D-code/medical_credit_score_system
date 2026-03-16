import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import providerPatientRoutes from './routes/provider-patient.routes';
import scoreRoutes from './routes/score.routes';
import providerRoutes from './routes/provider.routes';
import dashboardRoutes from './routes/dashboard.routes';
import profileRoutes from './routes/profile.routes';
import billingRoutes from './routes/billing.routes';
import adminRoutes from './routes/admin.routes';
import claimsRoutes from './routes/claims.routes';
import posRoutes from './routes/pos.routes';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

// Initialize Socket.IO
export const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || origin.startsWith('http://localhost:')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }
});

app.set('io', io);

// Socket connection handling
io.on('connection', (socket) => {
    console.log(`[socket] Client connected: ${socket.id}`);

    // When a patient connects, they join a room specific to their PH-ID
    socket.on('join_phid_room', (phid: string) => {
        if (phid) {
            socket.join(`room_${phid}`);
            console.log(`[socket] Client ${socket.id} joined room: room_${phid}`);
        }
    });

    socket.on('join_user_room', (userId: string) => {
        if (userId) {
            socket.join(`user_room_${userId}`);
            console.log(`[socket] Client ${socket.id} joined user_room: user_room_${userId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[socket] Client disconnected: ${socket.id}`);
    });
});

app.use(cors({
    origin: (origin, callback) => {
        // Allow all local origins during development
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/provider/patients', providerPatientRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/pos', posRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', message: 'Medical Credit Score System API is running' });
});

httpServer.listen(port, () => {
    console.log(`[server]: API Server is running at http://localhost:${port}`);
    console.log(`[server]: WebSocket server initialized on same port.`);
});
