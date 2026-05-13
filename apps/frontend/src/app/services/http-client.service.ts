import { HttpClient } from "@github-web-integration/http-client";
import Cookies from "js-cookie";

const httpClient = new HttpClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    retry: {
        enabled: false
    }
});

httpClient.getAxios().interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

httpClient.getAxios().interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("access_token");
      window.location.href = `/login?redirectTo=${window.location.pathname}`;
    }
    return Promise.reject(error);
  }
);

export default httpClient;