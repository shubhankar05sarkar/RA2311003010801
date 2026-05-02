# Notification System Design

## Stage 1

The problem is that users see too many notifications and miss the ones that actually matter. I needed a way to always show the top N most relevant ones without storing anything in a database.

I gave each notification a score based on type and age. Placements are most important (weight 3), Results next (weight 2), Events last (weight 1). I multiplied this by a decay factor so older notifications lose relevance over time — `weight * Math.exp(-0.1 * hoursAgo)`. This way a very recent Result can outrank an old Placement, which feels more useful.

Since the question mentioned new notifications keep arriving, I used a min-heap of size N instead of sorting the whole list every time. The heap keeps track of the N best-scored notifications seen so far. For each new notification, if its score beats the smallest in the heap, it replaces it. This is O(M log N) and only holds N items in memory at any point. For a live stream this is much better than re-sorting.

To run: `node src/index.js 10` (or 15, 20 etc.)
