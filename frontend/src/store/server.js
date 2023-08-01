import { actionTypes } from "./actionTypes";

// constants
const GET_SERVERS = "server/GET_SERVERS";
const CREATE_SERVER = "server/CREATE_SERVER";

// regular action creator
const getServers = (servers) => {
  return {
    type: GET_SERVERS,
    servers,
  };
};

const createServer = (server) => {
  return {
    type: CREATE_SERVER,
    server,
  };
};

// thunk action creator
export const thunkGetAllServers = () => async (dispatch) => {
  const res = await fetch(`/api/servers/current`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getServers(data));
    return data;
  }
};

export const thunkCreateServer = (serverForm) => async (dispatch) => {
  const res = await fetch("/api/servers/new", {
    method: "POST",
    body: serverForm,
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(createServer(data));
    return data;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};

const initialState = {
  orderedServers: [],
};

export default function serverReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SERVERS: {
      const newState = { ...state };
      const servers = action.servers.servers;
      const orderedServers = [...state.orderedServers];
      for (let server of servers) {
        if (!newState[server.id]) {
          orderedServers.push(server.id);
        }
        newState[server.id] = server;
      }
      newState.orderedServers = orderedServers;
      return newState;
    }
    case CREATE_SERVER: {
      const newState = { ...state };
      newState[action.server.id] = action.server;
      const orderedServers = [...newState.orderedServers];
      orderedServers.push(action.server.id);
      newState.orderedServers = orderedServers;
      return newState;
    }
    case actionTypes.DELETE_SERVER: {
      const newState = { ...state }
      delete newState[action.payload.serverId]
      newState.orderedServers = newState.orderedServers.filter((id) => id !== action.payload.serverId)
      return newState
    }
    default:
      return state;
  }
}
