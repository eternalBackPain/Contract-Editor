import React from 'react';
import { useViews } from '../contexts/ViewsContext';

export default function Sidebar() {
  const { state } = useViews();
  const ActiveComponent = state.activeViewId ? state.views[state.activeViewId]?.component : undefined;
  return (
    <aside className={`sidebar ${state.activeViewId ? 'visible' : 'hidden'}`} aria-label="Sidebar">
      {state.activeViewId ? (
        <div className="view-pane">
          <div className="view-title">{state.views[state.activeViewId].title}</div>
          <div className="view-body">
            {ActiveComponent ? <ActiveComponent /> : null}
          </div>
        </div>
      ) : (
        <div className="sidebar-empty">No view open</div>
      )}
    </aside>
  );
}