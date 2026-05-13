export interface ConsumerOptions {
  exchange: string;

  routingKey: string;

  queue: string;

  exchangeType?:
    | 'direct'
    | 'topic'
    | 'fanout'
    | 'headers';

  queueOptions?: {
    durable?: boolean;
  };
}