import React, { createContext, useContext, useReducer } from 'react';

const ViewsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'REGISTER':
      return {
        ...state,
        views: {
          ...state.views,
          [action.view.id]: action.view,
        },
      };

    case 'OPEN':
      return {
        ...state,
        activeViewId: action.id,
      };

    case 'TOGGLE':
      return {
        ...state,
        activeViewId: state.activeViewId === action.id ? undefined : action.id,
      };

    case 'SET_BADGE': {
      const badges = { ...state.badges };
      if (action.count == null) {
        delete badges[action.id];
      } else {
        badges[action.id] = action.count;
      }
      return { ...state, badges };
    }

    default:
      return state;
  }
}

export function ViewsProvider({ children, initialViews = [] }) {
  const [state, dispatch] = useReducer(reducer, {
    views: Object.fromEntries(initialViews.map(v => [v.id, v])),
    activeViewId: initialViews[0] ? initialViews[0].id : undefined,
    badges: {},
  });

  const registerView = view => dispatch({ type: 'REGISTER', view });
  const openView = id => dispatch({ type: 'OPEN', id });
  const toggleView = id => dispatch({ type: 'TOGGLE', id });
  const setBadge = (id, count) => dispatch({ type: 'SET_BADGE', id, count });

  return (
    <ViewsContext.Provider
      value={{ state, registerView, openView, toggleView, setBadge }}
    >
      {children}
    </ViewsContext.Provider>
  );
}

export function useViews() {
  const ctx = useContext(ViewsContext);
  if (!ctx) {
    throw new Error('useViews must be used inside ViewsProvider');
  }
  return ctx;
}
