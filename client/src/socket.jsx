import { io } from "socket.io-client";
const url = import.meta.env.VITE_BACKEND_URL;

export const initSocket = async () => {
  const option = {
    "force new connection": true,
    reconnectionAttempt: "infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io(url, option);
};
