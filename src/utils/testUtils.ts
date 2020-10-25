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

export function ignoreHtmlTags(text: string) {
  return (content, node) => {
    const hasText = node => node.textContent === text;
    const childrenDontHaveText = Array.from(node.children)
        .every(child => !hasText(child));
    return hasText(node) && childrenDontHaveText;
  }
}
