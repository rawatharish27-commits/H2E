import { Server } from 'socket.io'
import { createServer } from 'http'

const PORT = 3002

// Create HTTP server
const httpServer = createServer()

// Create Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Store connected users
const connectedUsers = new Map<string, { socketId: string; userId: string; area: string }>()

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  
  if (!token) {
    return next(new Error('Authentication required'))
  }
  
  // In production, verify JWT token here
  // For demo, extract userId from token
  const userId = token.split('.')[0] || 'anonymous'
  socket.data.userId = userId
  
  next()
})

// Connection handler
io.on('connection', (socket) => {
  const userId = socket.data.userId
  console.log(`[Socket] User connected: ${userId}`)
  
  // Join user's area room based on location
  socket.on('join:area', (data: { lat: number; lng: number }) => {
    // Create area grid (1km squares)
    const areaKey = `${Math.round(data.lat * 100)}_${Math.round(data.lng * 100)}`
    
    // Leave previous area
    const rooms = Array.from(socket.rooms)
    rooms.forEach(room => {
      if (room.startsWith('area:')) {
        socket.leave(room)
      }
    })
    
    // Join new area
    socket.join(`area:${areaKey}`)
    socket.data.area = areaKey
    
    // Track user
    connectedUsers.set(socket.id, { socketId: socket.id, userId, area: areaKey })
    
    console.log(`[Socket] User ${userId} joined area ${areaKey}`)
    socket.emit('joined:area', { area: areaKey })
  })
  
  // Join problem room for chat
  socket.on('join:problem', (problemId: string) => {
    socket.join(`problem:${problemId}`)
    console.log(`[Socket] User ${userId} joined problem ${problemId}`)
  })
  
  // Leave problem room
  socket.on('leave:problem', (problemId: string) => {
    socket.leave(`problem:${problemId}`)
  })
  
  // New problem notification
  socket.on('problem:new', (data: {
    problemId: string
    type: string
    title: string
    lat: number
    lng: number
  }) => {
    const areaKey = `${Math.round(data.lat * 100)}_${Math.round(data.lng * 100)}`
    
    // Broadcast to users in the area
    io.to(`area:${areaKey}`).emit('problem:new', {
      problemId: data.problemId,
      type: data.type,
      title: data.title,
      timestamp: new Date()
    })
    
    console.log(`[Socket] New problem broadcast to area ${areaKey}`)
  })
  
  // Problem status update
  socket.on('problem:update', (data: {
    problemId: string
    status: string
    acceptedById?: string
  }) => {
    io.emit('problem:update', data)
  })
  
  // Chat message
  socket.on('chat:message', (data: {
    problemId: string
    message: string
    senderId: string
    senderName: string
  }) => {
    const messageData = {
      ...data,
      timestamp: new Date()
    }
    
    // Broadcast to problem room
    io.to(`problem:${data.problemId}`).emit('chat:message', messageData)
    
    console.log(`[Socket] Chat message in problem ${data.problemId}`)
  })
  
  // Notification
  socket.on('notification:new', (data: {
    userId: string
    type: string
    title: string
    message: string
  }) => {
    // Find user's socket and send notification
    const userSocket = Array.from(connectedUsers.values()).find(u => u.userId === data.userId)
    
    if (userSocket) {
      io.to(userSocket.socketId).emit('notification:new', {
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date()
      })
    }
  })
  
  // Disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id)
    console.log(`[Socket] User disconnected: ${userId}`)
  })
})

// Health endpoint
httpServer.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      connections: connectedUsers.size,
      timestamp: new Date()
    }))
  }
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`[Realtime] Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Realtime] SIGTERM received, shutting down...')
  io.close(() => {
    httpServer.close()
    process.exit(0)
  })
})
