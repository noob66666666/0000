import { EQUIPMENT_SETS } from './equipment_sets.js';
import { createEquipment } from './equipment_factory.js';
import { getInventory } from './inventory.js';

export function giveAll(player) {
  const inv = getInventory(player);
  if (!inv) return;

  for (const definition of EQUIPMENT_SETS) {
    try {
      const item = createEquipment(definition);
      const remaining = inv.addItem(item);
      if (remaining && remaining.amount > 0 && player.dimension) {
        player.dimension.spawnItem(remaining, player.location);
      }
    } catch (error) {
      console.warn(`[KitBox] Failed to give ${definition.id}: ${error}`);
    }
  }
}
