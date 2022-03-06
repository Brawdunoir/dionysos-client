/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import * as R from 'ramda';
import Button from '../components/Button';
import Input from '../components/Input';
import { requestData } from '../utils';
import { SetUser, User, sendFunction } from '../utils/types';
import { codes } from '../constants';

const gtZero = (x: string) => R.gt(R.length(x), 0);

const ltFifty = (x: string) => R.lt(R.length(x), 50);

const isValid = R.allPass([gtZero, ltFifty]);

const requestNCO = (username: string, user: User) => requestData(
  codes.request.connection,
  { username, salt: user.salt },
);

const sendUsername = (
  isValidUsername: boolean,
  send: sendFunction,
  username: string,
  user: User,
  setUser: SetUser,
) => R.ifElse(
  () => isValidUsername,
  () => {
    send(requestNCO(username, user));
    setUser({ ...user, name: username });
  },
  () => null,
);

type connectProps = {
  send: sendFunction,
  user: User,
  setUser: SetUser,
  serverUrl: string,
  setServerUrl: React.Dispatch<React.SetStateAction<string>>,
  isConnected: boolean,
}

const Connect = ({
  send, user, setUser, serverUrl, setServerUrl, isConnected,
}: connectProps) => {
  const [username, setUsername] = useState('');

  const isValidUsername = username !== '' ? isValid(username) : false;
  const validAndConnected = isValidUsername && isConnected;
  const buttonText = isConnected ? 'Join' : 'Waiting for the server...';

  return (
    <div className="bg-neutral-800 space-y-6 w-[600px] rounded-lg relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex justify-between flex-col p-6">
      <h1 className="text-center font-medium text-2xl">Welcome to Dyonisos</h1>
      <div>
        <h2 className="mb-2">Set here your server URL</h2>
        <Input value={serverUrl} setValue={setServerUrl} />
      </div>
      <div>
        <h2 className="mb-2">Choose your username</h2>
        <Input value={username} setValue={setUsername} />
      </div>
      <div className="flex justify-between">
        <div />
        <Button to="/home" text={buttonText} colorless={!validAndConnected} disabled={!validAndConnected} onClick={sendUsername(validAndConnected, send, username, user, setUser)} />
      </div>
    </div>
  );
};

export default Connect;
