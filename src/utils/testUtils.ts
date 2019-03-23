import { rootReducer } from '../redux/root.reducer';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

export function setupStore(initialState?: any) {
  return createStore(
      rootReducer,
      {...initialState},
      applyMiddleware(
          thunkMiddleware
      )
  );
}

export const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));
