import { useReducer } from 'react';
import * as R from 'ramda';

const useSettings = () => {
  const initialSettings = {
    server: 'https://dionysos-test.yannlacroix.fr/api/v0',
  };

  enum SettingsActionList {
    SET_SERVER = 'SET_SERVER',
    SET_SERVER_DEFAULT = 'SET_SERVER_DEFAULT',
  }

  const SettingsError = (err: string) => new Error(`useSettings: ${err}`);

  const settingsReducer = (
    state: typeof initialSettings,
    action: {
      type: keyof typeof SettingsActionList;
      payload: Partial<typeof initialSettings>;
    },
  ) => {
    switch (action.type) {
      case SettingsActionList.SET_SERVER: {
        const { server } = action.payload;
        if (R.isNil(server)) throw SettingsError('missing server');

        return {
          ...state,
          server,
        };
      }
      case SettingsActionList.SET_SERVER_DEFAULT:
        return {
          ...state,
          server: initialSettings.server,
        };
      default:
        throw SettingsError(`Unhandled action type: ${action.type}`);
    }
  };

  const [get, dispatch] = useReducer(settingsReducer, initialSettings);

  return { get, dispatch };
};

export default useSettings;
