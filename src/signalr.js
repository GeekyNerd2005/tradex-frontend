// src/signalr.js or hooks/useSignalR.ts
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const buildSignalRConnection = (userId) => {
  const connection = new HubConnectionBuilder()
    .withUrl("https://tradex-backend.onrender.com/portfolioHub", {
      accessTokenFactory: () => localStorage.getItem("token") // if JWT protected
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  return connection;
};

export default buildSignalRConnection;
