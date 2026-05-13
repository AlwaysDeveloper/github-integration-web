import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClientOptions } from './http-client.interface.js';
import axiosRetry from 'axios-retry';

export class HttpClient {
  private client: AxiosInstance;

  constructor(options: HttpClientOptions = {}) {
    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (options.retry?.enabled) {
      axiosRetry(this.client, {
        retries: options.retry.retries ?? 3,
        retryDelay: (retryCount) => {
          return (options.retry?.retryDelay ?? 1000) * 2 ** retryCount;
        },
        retryCondition: (error) => {
          const status = error.response?.status;

          return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            status === 429 ||
            (status !== undefined && status >= 500)
          );
        },
      });
    }
  }

  getAxios() {
    return this.client;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);

    return response.data;
  }

  async post<T, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config,
    );

    return response.data;
  }

  async put<T, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);

    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);

    return response.data;
  }
}
