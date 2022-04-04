import React, { useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as R from 'ramda';
import { appWindow } from '@tauri-apps/api/window';
import Message from './components/Message';
import { codes, devServer } from './constants';
import Connect from './pages/connect';
import Home from './pages/home';
import { JoinRequest } from './utils/types';
import useMessages from './hooks/messages';
import { isValid, notNil } from './utils';
import useModal from './hooks/modal';
import useConnection from './hooks/connection';
import useRoom from './hooks/room';
import useUsers from './hooks/users';

/**
 * App main function, here lies most states and every WebSocket listeners.
 * Returns the shell style, app router and messages.
 */
const App = () => {
  const connection = useConnection(devServer);
  const users = useUsers();
  const room = useRoom();
  const messages = useMessages();
  const joinRequestModal = useModal();
  const [joinRequests, setJoinRequests] = useState<Array<JoinRequest>>([]);

  // Set the WebSocket to use on app start.
  // Listen for the app closing to close the WebSocket.
  useEffect(() => {
    try {
      const socket = new WebSocket(devServer);
      connection.setWebSocket(socket);

      appWindow.listen('tauri://close-requested', () => {
        if (notNil(connection.webSocket)) {
          const definedSocket = connection.webSocket as WebSocket;
          definedSocket.close(1000);
        }
        appWindow.close();
      });
    } catch (e: unknown) {
      const knowError = e as Error;
      messages.add(knowError.message, 'error');
    }
  }, []);

  // Every WebSocket listeners, only refreshed with key app state change.
  useEffect(() => {
    if (R.isNil(connection.webSocket)) return () => { };

    // Connection is up.
    connection.webSocket.onopen = (event) => {
      console.log('onopen: ', event);
      connection.setIsUp(true);
      connection.send(users.current.uuid);
    };

    // Server is sending data.
    connection.webSocket.onmessage = (event) => {
      const { data } = event;
      const { code, payload } = JSON.parse(data);
      console.log(code, payload);

      if (code === codes.response.error) {
        messages.add(payload.error, 'error');
      }

      if (code === codes.response.connection) {
        users.setCurrent({ ...users.current, id: payload.userId });
      }

      if (code === codes.response.roomCreation) {
        messages.clear();
        room.setCurrent({
          ...room.current,
          id: payload.roomId,
          ownerId: users.current.id,
        });
        users.set([users.current]);
      }

      if (code === codes.response.joinRoom) {
        if (!payload.isPrivate) {
          room.setCurrent({
            ...room.current,
            name: payload.roomName,
            id: payload.roomId,
            isPrivate: payload.isPrivate,
          });
        }

        if (payload.isPrivate) {
          messages.clear('Waiting for the host...', 'info', 9999);

          room.setPending({
            ...room.current,
            name: payload.roomName,
            id: payload.roomId,
            isPrivate: payload.isPrivate,
          });
        }
      }

      if (code === codes.response.denied) {
        if (payload.requestCode === codes.request.joinRoom) {
          messages.clear('Connection to the room denied by the host.', 'error');
        }
      }

      if (code === codes.response.quitRoom) {
        messages.clear();
        room.resetCurrent();
        users.set([]);
      }

      if (code === codes.response.changeUserName && isValid(room.current.name)) {
        messages.clear();
        users.setCurrent({ ...users.current, name: payload.username });
      }

      if (code === codes.response.newPeers) {
        messages.clear();
        room.setCurrent({ ...room.current, ownerId: payload.ownerId });
        users.set(payload.peers);

        if (room.pending.isPrivate) {
          room.setCurrent({ ...room.pending, ownerId: payload.ownerId });
          room.resetPending();
        }
      }

      if (code === codes.response.joinRequest) {
        if (joinRequests.length === 0) {
          joinRequestModal.toggle();
        }
        setJoinRequests(joinRequests.concat({
          requesterId: payload.requesterId,
          requesterUsername: payload.requesterUsername,
          roomId: payload.roomId,
        }));
      }
    };

    // Connection errors.
    connection.webSocket.onerror = (event) => {
      console.log('onerror: ', event);
    };

    // Connection is closed.
    connection.webSocket.onclose = (event) => {
      console.log('onclose: ', event);
      connection.setIsUp(false);

      if (users.current.id.length > 0) {
        messages.add('Connection lost', 'error');
      }
    };

    // Reset listeners on unmount.
    return () => {
      if (R.isNil(connection.webSocket)) return;

      connection.webSocket.onopen = null;
      connection.webSocket.onmessage = null;
      connection.webSocket.onerror = null;
      connection.webSocket.onclose = null;
    };
  }, [users, room, messages, connection]);

  return (
    <div className="text-foreground bg-background-800 h-screen cursor-default relative">
      <div className="z-50 absolute left-[50%] translate-x-[-50%] flex flex-col items-center min-w-[300px]">
        {messages.get.map((message) => <Message message={message} />)}
      </div>

      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={(
              <Connect
                connection={connection}
                users={users}
                messages={messages}
              />
            )}
          />
          <Route
            path="/home"
            element={(
              <Home
                connection={connection}
                users={users}
                room={room}
                joinRequestModal={joinRequestModal}
                joinRequests={joinRequests}
                setJoinRequests={setJoinRequests}
              />
            )}
          />
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default App;
