import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import {
  DiscoveryService,
  MetadataScanner,
  Reflector,
} from '@nestjs/core';

import { ConsumeMessage } from 'amqplib';

import { RabbitMQService } from './rabbitmq.service';

import { ConsumerOptions } from './interfaces/consumer-options.interface';

import { RABBITMQ_CONSUMER } from './rabbitmq.constants';

@Injectable()
export class RabbitMQExplorer
  implements OnModuleInit
{
  private readonly logger = new Logger(
    RabbitMQExplorer.name,
  );

  constructor(
    private readonly discoveryService: DiscoveryService,

    private readonly metadataScanner: MetadataScanner,

    private readonly reflector: Reflector,

    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async onModuleInit() {
    const providers =
      this.discoveryService.getProviders();

    for (const wrapper of providers) {
      const instance = wrapper.instance;

      if (!instance) {
        continue;
      }

      const prototype =
        Object.getPrototypeOf(instance);

      await this.metadataScanner.scanFromPrototype(
        instance,
        prototype,

        async (methodName: string) => {
          const methodRef = prototype[methodName];

          const metadata =
            this.reflector.get<ConsumerOptions>(
              RABBITMQ_CONSUMER,
              methodRef,
            );

          if (!metadata) {
            return;
          }

          await this.registerConsumer(
            metadata,
            instance[methodName].bind(instance),
          );
        },
      );
    }
  }

  private async registerConsumer(
    options: ConsumerOptions,

    handler: (
      payload: unknown,
      message: ConsumeMessage,
    ) => Promise<void>,
  ) {
    const channel =
      await this.rabbitmqService.getChannel();

    await channel.assertExchange(
      options.exchange,

      options.exchangeType || 'topic',

      {
        durable: true,
      },
    );

    await channel.assertQueue(
      options.queue,
      {
        durable:
          options.queueOptions?.durable ??
          true,
      },
    );

    await channel.bindQueue(
      options.queue,
      options.exchange,
      options.routingKey,
    );

    await channel.consume(
      options.queue,

      async (message: ConsumeMessage | null) => {
        if (!message) {
          return;
        }

        try {
          const payload = JSON.parse(
            message.content.toString(),
          );

          await handler(
            payload,
            message,
          );

          channel.ack(message);
        } catch (error) {
          this.logger.error(error);

          channel.nack(
            message,
            false,
            false,
          );
        }
      },
    );

    this.logger.log(
      `Consumer registered: ${options.queue}`,
    );
  }
}