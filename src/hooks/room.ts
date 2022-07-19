import * as R from 'ramda';
import { useReducer } from 'react';

const useRoom = () => {
  const baseRoom = {
    uri: '',
    id: 0,
    name: '',
  };

  enum RoomActionList {
    SET_URI_AND_ID = 'SET_URI_AND_ID',
    SET_NAME = 'SET_NAME',
  }

  const roomReducer = (
    state: typeof baseRoom,
    action: {
      type: keyof typeof RoomActionList;
      payload: Partial<typeof baseRoom>;
    },
  ) => {
    switch (action.type) {
      case RoomActionList.SET_URI_AND_ID: {
        const { uri } = action.payload;
        if (!uri) throw new Error('Missing uri');

        const id = Number(uri.split('/').pop());
        if (!id) throw new Error('Missing id in uri');

        return {
          ...state,
          uri,
          id,
        };
      }
      case RoomActionList.SET_NAME: {
        const { name } = action.payload;
        if (R.isNil(name)) throw new Error('Missing name');

        return {
          ...state,
          name,
        };
      }
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };

  const [get, dispatch] = useReducer(roomReducer, baseRoom);

  return { get, dispatch };
};

export default useRoom;
