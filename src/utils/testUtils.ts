import { rootReducer } from '../redux/root.reducer';
import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { OpenTrappRestAPI } from '../api/OpenTrappAPI';
import epic from '../epics';

export function setupStore(initialState?: any) {
  const epicsMiddleware = createEpicMiddleware({ dependencies: { openTrappApi: OpenTrappRestAPI } })
  const store = createStore(
      rootReducer,
      {...initialState},
      applyMiddleware(
          epicsMiddleware
      )
  );
  epicsMiddleware.run(epic);
  return store;
}

export function ignoreHtmlTags(text: string) {
  return (content, node) => {
    const hasText = node => node.textContent === text;
    const childrenDontHaveText = Array.from(node.children)
        .every(child => !hasText(child));
    return hasText(node) && childrenDontHaveText;
  }
}
