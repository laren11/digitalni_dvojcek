import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../../context/userContext";
import { socket } from "../../socket";
import { ConnectionState } from "../socketio/ConnectionState";
import { ConnectionManager } from "../socketio/ConnectionManager";
import { Events } from "../socketio/Events";
import { MyForm } from "../socketio/MyForm";
function Home(props) {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  //Navigacija, glede na vrednost v UserContext
  useEffect(() => {
    if (userData.user) {
      navigate("/");
    }
    if (!userData.user) {
      navigate("/login");
    }
  }, [userData]);

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
    <>
      <div>
        {userData.user ? (
          <h1>Welcome {userData.user.displayName}</h1>
        ) : (
          <>
            <h2>You are not logged in</h2>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
      <div>
        <ConnectionState isConnected={isConnected} />
        <Events events={fooEvents} />
        <ConnectionManager />
        <MyForm />
      </div>
    </>
  );
}
export default Home;
