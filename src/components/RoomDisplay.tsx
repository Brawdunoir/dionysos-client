import React from 'react';
import { codes } from '../constants';
import { requestData } from '../utils';
import { Room, SendFunction } from '../utils/types';
import Id from './Id';

const quitRoom = (
  send: SendFunction,
) => send(requestData(
  codes.request.quitRoom,
  {},
));

type RoomDisplayProps = { room: Room, className?: string, send: SendFunction };

/**
 * Display the room name, it's id and the leave button.
 */
const RoomDisplay = ({
  room, className, send,
}: RoomDisplayProps) => (
  <div className={className}>
    <h1 className="text-2xl font-black mb-4 pt-1">{room.name}</h1>
    <div role="button" className="px-4 py-2 absolute right-0 top-3 bg-background-500 hover:bg-background-400 rounded-l-lg cursor-pointer transition-colors font-medium" title="Leave the current room" tabIndex={0} onClick={() => quitRoom(send)} onKeyPress={(event) => { if (event.code === 'Enter') quitRoom(send); }}>
      Leave
    </div>
    <Id id={room.id} copy />
  </div>
);

export default RoomDisplay;
