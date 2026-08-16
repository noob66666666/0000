import { giveAll } from './give_items.js';

export function useKitBox(player) {
  if (!player) return { granted: 0, dropped: 0, failed: 0 };

  const result = giveAll(player);
  console.warn(
    `[KitBox] granted=${result.granted} dropped=${result.dropped} failed=${result.failed}`
  );
  return result;
}
