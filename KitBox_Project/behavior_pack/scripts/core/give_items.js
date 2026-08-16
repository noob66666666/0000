import { EQUIPMENT_SETS } from './equipment_sets.js';
import { createEquipment } from './equipment_factory.js';
import { getInventory } from './inventory.js';

function dropRemaining(player, remaining) {
  if (!remaining || remaining.amount <= 0 || !player.dimension) return;
  player.dimension.spawnItem(remaining, player.location);
}

export function giveAll(player) {
  const inventory = getInventory(player);
  if (!inventory) return;

  for (const definition of EQUIPMENT_SETS) {
    try {
      const item = createEquipment(definition);
      const remaining = inventory.addItem(item);
      dropRemaining(player, remaining);
    } catch (error) {
      console.warn(`[KitBox] Failed to give ${definition.id}: ${error}`);
    }
  }
}
