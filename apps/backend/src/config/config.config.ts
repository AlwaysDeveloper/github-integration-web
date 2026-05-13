import { registerAs } from "@nestjs/config";

export const systemConfig = registerAs("config", () => ({
    amqpUri: process.env.RABBITMQ_URI || 'amqp://admin:admin@localhost:5672'
}));