export interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  retry?: {
    enabled?: boolean;
    retries?: number;
    retryDelay?: number;
  };
}
