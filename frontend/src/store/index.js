import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import serverReducer from "./server";
import logger from "redux-logger";
import { singleServerReducer } from "./singleServer";
import { directMessagesReducer } from "./directMessages";

const rootReducer = combineReducers({
  session,
  servers: serverReducer,
  singleServer: singleServerReducer,
  directMessages: directMessagesReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
