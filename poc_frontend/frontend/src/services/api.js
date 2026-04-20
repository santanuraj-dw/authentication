import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = () => {
  failedQueue.forEach((prom) => prom.resolve());
  failedQueue = [];
};

// console.log(processQueue)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log("original request: ",originalRequest)
    // console.log("original retry: ",originalRequest)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push({ resolve: () => resolve(api(originalRequest)) });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue();
        isRefreshing = false;
        // console.log(processQueue())
        return api(originalRequest);
      } catch (error) {
        isRefreshing = false;
        window.location.href = "/";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
