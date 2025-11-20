import React from 'react';
import { useViews } from './ViewsContext';

export default function ActivityBar() {
  const { state, openView, toggleView } = useViews();
  const viewList = Object.values(state.views);

  return (
    <aside className="activity-bar" role="toolbar" aria-label="Activity Bar">
      {viewList.map(v => (
        <button
          key={v.id}
          className={`activity-item ${state.activeViewId === v.id ? 'active' : ''}`}
          onClick={() => openView(v.id)}
          title={v.title}
          aria-pressed={state.activeViewId === v.id}
        >
          <span className="icon">{v.icon}</span>
          {state.badges[v.id] ? <span className="badge">{state.badges[v.id]}</span> : null}
        </button>
      ))}

      <div className="activity-bottom">
        <button className="activity-item" onClick={() => toggleView(viewList[0]?.id)}>
          ⋯
        </button>
      </div>
    </aside>
  );
}