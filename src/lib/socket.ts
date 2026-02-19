// Socket.io Client Library
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

interface SocketEvents {
  'problem:new': (data: ProblemNotification) => void
  'problem:update': (data: ProblemUpdate) => void
  'chat:message': (data: ChatMessage) => void
  'notification:new': (data: NotificationData) => void
  'joined:area': (data: { area: string }) => void
}

interface ProblemNotification {
  problemId: string
  type: string
  title: string
  timestamp: Date
}

interface ProblemUpdate {
  problemId: string
  status: string
  acceptedById?: string
}

interface ChatMessage {
  problemId: string
  message: string
  senderId: string
  senderName: string
  timestamp: Date
}

interface NotificationData {
  type: string
  title: string
  message: string
  timestamp: Date
}

// Get or create socket connection
export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io('/?XTransformPort=3002', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
    
    socket.on('connect', () => {
      console.log('[Socket] Connected')
    })
    
    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
    })
    
    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error)
    })
  }
  
  return socket
}

// Disconnect socket
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Join area room
export function joinArea(lat: number, lng: number): void {
  const s = getSocket()
  s.emit('join:area', { lat, lng })
}

// Join problem room
export function joinProblemRoom(problemId: string): void {
  const s = getSocket()
  s.emit('join:problem', problemId)
}

// Leave problem room
export function leaveProblemRoom(problemId: string): void {
  const s = getSocket()
  s.emit('leave:problem', problemId)
}

// Send chat message
export function sendChatMessage(
  problemId: string,
  message: string,
  senderId: string,
  senderName: string
): void {
  const s = getSocket()
  s.emit('chat:message', {
    problemId,
    message,
    senderId,
    senderName
  })
}

// Notify new problem
export function notifyNewProblem(
  problemId: string,
  type: string,
  title: string,
  lat: number,
  lng: number
): void {
  const s = getSocket()
  s.emit('problem:new', {
    problemId,
    type,
    title,
    lat,
    lng
  })
}

// Update problem status
export function updateProblemStatus(
  problemId: string,
  status: string,
  acceptedById?: string
): void {
  const s = getSocket()
  s.emit('problem:update', {
    problemId,
    status,
    acceptedById
  })
}

// Subscribe to events
export function subscribe<K extends keyof SocketEvents>(
  event: K,
  callback: SocketEvents[K]
): () => void {
  const s = getSocket()
  s.on(event, callback)
  
  // Return unsubscribe function
  return () => {
    s.off(event, callback)
  }
}

// Unsubscribe from event
export function unsubscribe<K extends keyof SocketEvents>(
  event: K,
  callback?: SocketEvents[K]
): void {
  const s = getSocket()
  s.off(event, callback)
}
