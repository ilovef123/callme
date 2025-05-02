// TypeScript 版 WebSocket 服务端
import { WebSocketServer, WebSocket } from 'ws'

const wss = new WebSocketServer({ port: 3002 })

// 在线用户映射 userId -> ws
const clients = new Map<string, WebSocket>()

wss.on('connection', function connection(ws: WebSocket) {
  let userId: string | null = null
  ws.on('message', function incoming(message: string) {
    try {
      const data = JSON.parse(message)
      if (data.type === 'init' && typeof data.userId === 'string') {
        userId = data.userId
        if (typeof userId === 'string') {
          clients.set(userId, ws)
        }
      } else if (data.type === 'chat') {
        // data: { type: 'chat', from, to, content }
        // 转发给目标用户
        const toWs = clients.get(data.to)
        if (toWs && toWs.readyState === WebSocket.OPEN) {
          toWs.send(JSON.stringify({
            type: 'chat',
            from: data.from,
            content: data.content,
            time: Date.now()
          }))
        }
      }
    } catch (e) { }
  })
  ws.on('close', function () {
    if (typeof userId === 'string') clients.delete(userId)
  })
})

console.log('WebSocket server running on ws://localhost:3002')
