import React, { useState, useEffect } from "react";
import { socket } from "../../socket";
import { ConnectionState } from "../socketio/ConnectionState";
import { ConnectionManager } from "../socketio/ConnectionManager";
import { Events } from "../socketio/Events";
import { MyForm } from "../socketio/MyForm";

const Socketio = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);
  return (
    <div>
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
};

export default Socketio;
