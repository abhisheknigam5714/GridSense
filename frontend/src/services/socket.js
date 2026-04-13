import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class SocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.maintenanceCallbacks = new Map();
  }

  connect(onConnected, onError) {
    const wsUrl = process.env.REACT_APP_WS_URL || "http://localhost:8080/ws";

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log("WebSocket Connected");
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
        if (onError) onError(frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket Error:", event);
        if (onError) onError(event);
      },
      onDisconnect: () => {
        this.connected = false;
        console.log("WebSocket Disconnected");
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.maintenanceCallbacks.clear();
      this.client.deactivate();
      this.connected = false;
    }
  }

  subscribeToOutages(pincode, callback) {
    if (!this.client || !this.connected) {
      console.warn("WebSocket not connected");
      return null;
    }

    const destination = pincode
      ? `/topic/outages/${pincode}`
      : `/topic/outages`;

    const subscription = this.client.subscribe(destination, (message) => {
      const body = JSON.parse(message.body);

      // Route MAINTENANCE_ALERT to its own registered callback if set
      if (body.type === "MAINTENANCE_ALERT") {
        const maintenanceCb = this.maintenanceCallbacks.get(
          `maintenance-${pincode || "all"}`,
        );
        if (maintenanceCb) {
          maintenanceCb(body);
        } else {
          // Fall through to the default callback if no specific one registered
          callback(body);
        }
        return;
      }

      callback(body);
    });

    const subscriptionId = `outages-${pincode || "all"}`;
    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  // Register a dedicated handler for MAINTENANCE_ALERT messages
  // Usage: socketService.onMaintenanceAlert(pincode, (msg) => { ... })
  onMaintenanceAlert(pincode, callback) {
    const key = `maintenance-${pincode || "all"}`;
    this.maintenanceCallbacks.set(key, callback);
  }

  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
    }
  }

  isConnected() {
    return this.connected;
  }
}

const socketService = new SocketService();
export default socketService;
