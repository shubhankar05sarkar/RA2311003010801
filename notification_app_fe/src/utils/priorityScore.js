const weights = { Placement: 3, Result: 2, Event: 1 };

function score(n) {
  const w = weights[n.Type] ?? 0;
  const hrs = (Date.now() - new Date(n.Timestamp).getTime()) / 3600000;
  return w * Math.exp(-0.1 * hrs);
}

export function getTopN(notifications, n) {
  return [...notifications]
    .map(item => ({ ...item, _s: score(item) }))
    .sort((a, b) => b._s - a._s)
    .slice(0, n)
    .map(({ _s, ...rest }) => rest);
}
