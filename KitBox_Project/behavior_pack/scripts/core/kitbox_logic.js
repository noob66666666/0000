import { giveAll } from './give_items.js';

export function useKitBox(player) {
  if (!player) return { granted: 0, dropped: 0, failed: 0 };
  return giveAll(player);
}
