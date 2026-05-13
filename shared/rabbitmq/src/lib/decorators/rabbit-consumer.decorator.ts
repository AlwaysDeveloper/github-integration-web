import { SetMetadata } from '@nestjs/common';

import { ConsumerOptions } from '../interfaces/consumer-options.interface';

import { RABBITMQ_CONSUMER } from '../rabbitmq.constants';

export const RabbitConsumer = (
  options: ConsumerOptions,
) => SetMetadata(RABBITMQ_CONSUMER, options);