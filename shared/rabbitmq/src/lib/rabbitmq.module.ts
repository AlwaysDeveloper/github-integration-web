import {
  DynamicModule,
  Global,
  Module,
  Provider,
} from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';

import { RabbitMQExplorer } from './rabbitmq.explorer';

import { RabbitMQService } from './rabbitmq.service';

import {
  RabbitMQModuleOptions,
} from './interfaces/rabbit-module-options.interface';

import { RABBITMQ_OPTIONS } from './rabbitmq.constants';

@Global()
@Module({})
export class RabbitMQModule {
  static forRoot(
    options: RabbitMQModuleOptions,
  ): DynamicModule {
    return {
      module: RabbitMQModule,

      imports: [DiscoveryModule],

      providers: [
        {
          provide: RABBITMQ_OPTIONS,
          useValue: options,
        },

        RabbitMQService,

        RabbitMQExplorer,
      ],

      exports: [RabbitMQService],
    };
  }

  static forRootAsync(options: {
    imports?: any[];

    inject?: any[];

    useFactory: (
      ...args: any[]
    ) =>
      | Promise<RabbitMQModuleOptions>
      | RabbitMQModuleOptions;
  }): DynamicModule {
    const optionsProvider: Provider = {
      provide: RABBITMQ_OPTIONS,

      useFactory: options.useFactory,

      inject: options.inject || [],
    };

    return {
      module: RabbitMQModule,

      imports: [
        DiscoveryModule,
        ...(options.imports || []),
      ],

      providers: [
        optionsProvider,

        RabbitMQService,

        RabbitMQExplorer,
      ],

      exports: [RabbitMQService],
    };
  }
}