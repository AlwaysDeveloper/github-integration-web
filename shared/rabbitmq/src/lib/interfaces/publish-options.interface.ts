export interface PublishOptions<T = unknown> {
  exchange: string;

  routingKey: string;

  message: T;

  persistent?: boolean;

  headers?: Record<string, unknown>;
}