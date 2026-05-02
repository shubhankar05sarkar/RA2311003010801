import { Log } from 'logging-middleware';

const weights = { Placement: 3, Result: 2, Event: 1 };

function score(notif, now) {
  const w = weights[notif.Type] ?? 0;
  const hoursAgo = (now - new Date(notif.Timestamp).getTime()) / 3600000;
  return w * Math.exp(-0.1 * hoursAgo);
}

export async function getTopNNotifications(notifications, n = 10) {
  await Log('backend', 'info', 'service', `Computing top ${n} from ${notifications.length} total`);

  const now = Date.now();
  const scored = notifications.map(item => ({ ...item, _s: score(item, now) }));

  const heap = [];

  function push(item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p]._s <= heap[i]._s) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  }

  function pop() {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let min = i, l = 2*i+1, r = 2*i+2;
        if (l < heap.length && heap[l]._s < heap[min]._s) min = l;
        if (r < heap.length && heap[r]._s < heap[min]._s) min = r;
        if (min === i) break;
        [heap[i], heap[min]] = [heap[min], heap[i]];
        i = min;
      }
    }
    return top;
  }

  for (const item of scored) {
    if (heap.length < n) {
      push(item);
    } else if (item._s > heap[0]._s) {
      heap[0] = item;
      let i = 0;
      while (true) {
        let min = i, l = 2*i+1, r = 2*i+2;
        if (l < heap.length && heap[l]._s < heap[min]._s) min = l;
        if (r < heap.length && heap[r]._s < heap[min]._s) min = r;
        if (min === i) break;
        [heap[i], heap[min]] = [heap[min], heap[i]];
        i = min;
      }
    }
  }

  const result = [];
  while (heap.length > 0) result.push(pop());
  result.sort((a, b) => b._s - a._s);

  await Log('backend', 'info', 'service', `Priority inbox: ${result.length} notifications ranked`);

  return result.map(({ _s, ...rest }) => rest);
}
