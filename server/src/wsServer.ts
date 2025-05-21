import WebSocket from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
  let userId: string | undefined;
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'init' && typeof data.userId === 'string') {
        userId = data.userId;
        if (typeof userId === 'string') {
          clients.set(userId, ws);
        }
      } else if (data.type === 'chat') {
        // data: { type: 'chat', from, to, content }
        const msgObj = {
          type: 'chat',
          from: data.from,
          content: data.content,
          time: Date.now()
        };
        // 推送给接收方
        const toWs = clients.get(data.to);
        if (toWs && toWs.readyState === WebSocket.OPEN) {
          toWs.send(JSON.stringify(msgObj));
        }
        // 始终推送给发送方（自己），即使 from==to
        const fromWs = clients.get(data.from);
        if (fromWs && fromWs.readyState === WebSocket.OPEN) {
          fromWs.send(JSON.stringify(msgObj));
        }
      }
    } catch (e) {
      console.error('ws message error:', e);
    }
  });
  ws.on('close', function () {
    if (userId) clients.delete(userId);
  });
});

server.listen(3002, '0.0.0.0', () => {
  console.log('WebSocket server running on ws://0.0.0.0:3002');
});