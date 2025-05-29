import { io } from "socket.io-client";
import { API_ROOT } from "~/utils/constants";
// create a socket io instance to interact with the base url
// Temporarily disable Socket.IO for CORS testing
export const socketIoInstance = null; // io(API_ROOT);
