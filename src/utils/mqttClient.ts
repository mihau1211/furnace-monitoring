import mqtt from 'mqtt';
import { MonitoringDataService } from '../models/services/monitoringData.service';

const monitoringDataService = new MonitoringDataService();

let mqttServer = !process.env.MQTT_SERVER ? 'http://localhost' : `http://${process.env.MQTT_SERVER}`;

const client = mqtt.connect(mqttServer);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

const subscribeToTopic = (topic: string) => {
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Failed to subscribe to topic ${topic}. ${err}`);
        } else {
            console.log(`Subscribed to topic ${topic}`);
        }
    });
};

client.on('message', (topic, message) => {
    try {
        const messageStr = message.toString();
        const data = JSON.parse(messageStr);

        const monitoringData = {
            furnaceId: data.furnaceId,
            temperature: data.temperature,
            timestamp: data.timestamp
        };
        monitoringDataService.saveMonitoringData(monitoringData);
    } catch (err) {
        console.error('Unable to add new record via MQTT. Skipping.');
    }
});

export default {
    subscribeToTopic,
};