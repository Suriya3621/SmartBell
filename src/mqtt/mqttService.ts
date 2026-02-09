import mqtt from "mqtt";
import type { MqttClient } from "mqtt";

let client: MqttClient | null = null;
let connectionStatus: "connected" | "disconnected" = "disconnected";

export const CONTROL_TOPIC = "gbhss/bell/control";
export const STATUS_TOPIC = "gbhss/bell/status";

export const connectMQTT = (
  onMessage: (topic: string, msg: string) => void,
  onConnect?: () => void,
) => {
  const MQTT_URL = "wss://broker.hivemq.com:8884/mqtt";

  client = mqtt.connect(MQTT_URL);

  client.on("connect", () => {
    console.log("✅ MQTT Connected");
    connectionStatus = "connected";
    client?.subscribe(STATUS_TOPIC);
    onConnect?.();
  });

  client.on("message", (topic, payload) => {
    onMessage(topic, payload.toString());
  });

  client.on("close", () => {
    connectionStatus = "disconnected";
  });

  client.on("error", (err) => {
    console.error("❌ MQTT Error", err);
    connectionStatus = "disconnected";
  });
};

export const disconnectMQTT = () => {
  if (client) {
    client.end(true);
    client = null;
    connectionStatus = "disconnected";
    console.log("🔌 MQTT Disconnected");
  }
};

export const getConnectionStatus = () => {
  return connectionStatus;
};

export const publish = (message: string) => {
  if (!client || !client.connected) return;
  client.publish(CONTROL_TOPIC, message);
};
