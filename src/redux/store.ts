import { applyMiddleware, compose, createStore } from 'redux';
import { rootReducer } from './root.reducer';
import { createEpicMiddleware } from 'redux-observable';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import epic from '../epics'

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const getStore = () => {
  const epicsMiddleware = createEpicMiddleware({ dependencies: { openTrappApi: OpenTrappRestAPI } })
  const store = createStore(
      rootReducer,
      composeEnhancers(
          applyMiddleware(
              epicsMiddleware
          )
      )
  );
  epicsMiddleware.run(epic);
  return store;
}
