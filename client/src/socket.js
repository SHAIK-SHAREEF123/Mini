import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Use your server URL if deployed

export default socket;
