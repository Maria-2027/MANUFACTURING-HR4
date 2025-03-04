const WS_URL = 'ws://localhost:8080';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.subscribers = [];
    }

    connect() {
        this.ws = new WebSocket(WS_URL);
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.subscribers.forEach(callback => callback(message));
        };

        this.ws.onclose = () => {
            setTimeout(() => {
                this.connect();
            }, 3000);
        };
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    sendMessage(message) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
}

export default new WebSocketService();
