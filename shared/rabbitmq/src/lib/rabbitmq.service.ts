import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';

import * as amqp from 'amqplib';

import { ConfirmChannel } from 'amqplib';

import { RABBITMQ_OPTIONS } from './rabbitmq.constants';

import type { RabbitMQModuleOptions } from './interfaces/rabbit-module-options.interface';

import { PublishOptions } from './interfaces/publish-options.interface';

@Injectable()
export class RabbitMQService implements OnApplicationShutdown {
  private readonly logger = new Logger(RabbitMQService.name);

  private connection?: amqp.ChannelModel;

  private channel?: ConfirmChannel;

  private initialized = false;

  private connecting?: Promise<void>;

  constructor(
    @Inject(RABBITMQ_OPTIONS)
    private readonly options: RabbitMQModuleOptions,
  ) {}

  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.connecting) {
      return this.connecting;
    }

    this.connecting = (async () => {
      this.connection = await amqp.connect(this.options.uri);

      this.channel = await this.connection.createConfirmChannel();

      if (this.options.prefetchCount) {
        await this.channel.prefetch(this.options.prefetchCount);
      }

      for (const exchange of this.options.exchanges || []) {
        await this.channel.assertExchange(
          exchange.name,
          exchange.type || 'topic',
          {
            durable: exchange.durable ?? true,
          },
        );
      }

      this.initialized = true;

      this.logger.log('RabbitMQ connected');
    })();

    return this.connecting;
  }

  async getChannel(): Promise<ConfirmChannel> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    return this.channel;
  }

  async publish<T>(options: PublishOptions<T>): Promise<void> {
    const channel = await this.getChannel();

    this.logger.log(
      `Publishing -> exchange=${options.exchange}, routingKey=${options.routingKey}`,
    );

    return new Promise((resolve, reject) => {
      const published = channel.publish(
        options.exchange,
        options.routingKey,
        Buffer.from(JSON.stringify(options.message)),
        {
          persistent: options.persistent ?? true,
        },
        (error) => {
          if (error) {
            this.logger.error(error);

            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  }

  async onApplicationShutdown() {
    await this.channel?.close();

    await this.connection?.close();

    this.logger.log('RabbitMQ connection closed');
  }
}
