export interface RabbitMQExchangeOptions {
  name: string;

  type?:
    | 'direct'
    | 'topic'
    | 'fanout'
    | 'headers';

  durable?: boolean;
}

export interface RabbitMQModuleOptions {
  uri: string;

  prefetchCount?: number;

  exchanges?: RabbitMQExchangeOptions[];
}