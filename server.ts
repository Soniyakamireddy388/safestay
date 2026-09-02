import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory backing store for live REST endpoints
const demoStats = {
  systemUptime: process.uptime(),
  startTime: new Date().toISOString(),
  aiAcousticThreshold: 90,
  twilioStatus: 'DEMO_MODE',
  mysqlStatus: 'CONNECTED_DEMO_POOL',
};

// 1. System Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'SafeStay - Smart Hostel Management Network',
    version: '1.0.0',
    admin: 'Soniya Kamireddy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ...demoStats,
  });
});

// 2. Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  if (!email && !role) {
    return res.status(400).json({ error: 'Email or role required' });
  }
  res.json({
    token: `safestay_jwt_${Date.now()}`,
    message: 'Authentication successful',
    user: {
      name: role === 'ADMIN' ? 'Soniya Kamireddy' : role === 'WARDEN' ? 'Ramesh Chandra' : 'Rahul Sharma',
      role: role || 'ADMIN',
      email: email || 'soniya@safestay.in',
    },
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, studentId, wardId } = req.body;
  res.status(201).json({
    message: 'Registration submitted successfully. Approval status: PENDING.',
    user: {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role || 'STUDENT',
      studentId,
      wardId,
      approvalStatus: 'PENDING',
      createdAt: new Date().toISOString(),
    },
  });
});

// 3. AI Acoustic Distress Analysis Endpoint (Section 26)
app.post('/api/ai/analyze-audio', (req, res) => {
  const { location, room, isDistressSimulation, soundLabel } = req.body;
  const isDanger = Boolean(isDistressSimulation);
  const distressProbability = isDanger ? +(90 + Math.random() * 8).toFixed(1) : +(8 + Math.random() * 20).toFixed(1);
  const confidence = +(88 + Math.random() * 10).toFixed(1);

  res.json({
    status: isDanger ? 'DANGER' : 'SAFE',
    distressProbability,
    confidence,
    detectedAt: new Date().toISOString(),
    location: location || 'Block A – Floor 2 Corridor',
    room: room || 'A-204',
    soundType: soundLabel || (isDanger ? 'High-Frequency Distress Scream Signature' : 'Ambient Conversation / Footsteps'),
    disclaimer: 'AI detection indicates a potential distress event and requires human verification. It does not confirm that an emergency has occurred.',
  });
});

// 4. Emergency Manual Panic Alert Endpoint (Section 27)
app.post('/api/emergency/manual', (req, res) => {
  const { studentName, studentId, room, hostelBlock } = req.body;
  const alertId = `EMG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  res.status(201).json({
    id: alertId,
    timestamp: new Date().toISOString(),
    source: 'MANUAL_PANIC',
    status: 'New',
    studentName: studentName || 'Rahul Sharma',
    studentId: studentId || 'STU-2024-089',
    room: room || 'A-204',
    hostelBlock: hostelBlock || 'Block A',
    twilioSmsDispatched: true,
    message: 'Emergency panic alert broadcasted to Warden and Administrator Soniya Kamireddy.',
  });
});

// 5. Setup Vite middleware or static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SafeStay Server] Running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start SafeStay server:', err);
});
