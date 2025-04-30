import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'task-manager-app',
  brokers: ['kafka:9092'],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'task-manager-group' });

export default kafka;
