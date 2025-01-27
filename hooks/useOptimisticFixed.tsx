import { useOptimistic } from 'react';

// this is a modified version of useOptimistic, to be used only for arrays
// it temporarily fixes a bug with useOptimistic, where it shows both the optimistic and the initial state
// see documented here: https://github.com/facebook/react/issues/28574

type Action<T> =
  | { type: 'add'; item: T } // No `key` required for 'add'
  | { type: 'delete'; item: T; key: keyof T }; // `key` is required for 'delete'

export function useOptimisticItems<T>(passthrough: T[]) {
  return useOptimistic(passthrough, (state: T[], action: Action<T>) => {
    switch (action.type) {
      case 'add':
        if (!state.includes(action.item)) {
          return [...state, action.item];
        } else {
          return state;
        }
      case 'delete':
        return state.filter(
          (item) => item[action.key] !== action.item[action.key]
        );
      default:
        return state;
    }
  });
}
