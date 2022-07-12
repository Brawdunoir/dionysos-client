import { useReducer } from 'react';

const useSettings = () => {
  const initialSettings = {
    server: 'https://dionysos-test.yannlacroix.fr',
  };

  enum SettingsActionList {
    SET_SERVER = 'SET_SERVER',
    SET_SERVER_DEFAULT = 'SET_SERVER_DEFAULT',
  }

  type SettingsAction = {
    type: keyof typeof SettingsActionList;
    payload: {
      server?: typeof initialSettings.server;
    };
  }

  const settingsReducer = (
    state: typeof initialSettings,
    action: SettingsAction,
  ) => {
    switch (action.type) {
      case SettingsActionList.SET_SERVER:
        return {
          ...state,
          ...action.payload,
        };
      case SettingsActionList.SET_SERVER_DEFAULT:
        return {
          ...state,
          server: initialSettings.server,
        };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };

  const [get, dispatch] = useReducer(settingsReducer, initialSettings);

  return { get, dispatch };
};

export default useSettings;