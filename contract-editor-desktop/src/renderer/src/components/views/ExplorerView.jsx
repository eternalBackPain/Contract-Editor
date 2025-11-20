import React, { useEffect } from 'react';
import { useViews } from '../../contexts/ViewsContext';

const sampleTree = [
  { name: 'src', children: [{ name: 'App.tsx' }, { name: 'index.tsx' }] },
  { name: 'package.json' },
];

export default function ExplorerView() {
  const { setBadge } = useViews();

  // Example: set a badge for this view (e.g., number of changes)
  useEffect(() => {
    setBadge('explorer', 3);
    return () => setBadge('explorer', undefined);
  }, [setBadge]);

  return (
    <div className="explorer-view" role="region" aria-label="Explorer">
      <ul className="file-tree">
        {sampleTree.map((n, idx) => (
          <li key={idx}>
            <div className="folder">{n.name}</div>
            {Array.isArray(n.children) && (
              <ul>
                {n.children.map((c, i) => <li key={i} className="file">{c.name}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}