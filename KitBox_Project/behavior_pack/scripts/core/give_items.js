import { EQUIPMENT_SETS } from './equipment_sets.js';
import { createEquipment } from './equipment_factory.js';
import { getInventory } from './inventory.js';

function dropRemaining(player, remaining) {
  if (!remaining || remaining.amount <= 0 || !player.dimension) return false;
  try {
    player.dimension.spawnItem(remaining, player.location);
    return true;
  } catch (error) {
    console.warn(`[KitBox] Failed to drop remaining ${remaining.typeId}: ${error}`);
    return false;
  }
}

export function giveAll(player) {
  const inventory = getInventory(player);
  if (!inventory) return { granted: 0, dropped: 0, failed: 0 };

  const result = { granted: 0, dropped: 0, failed: 0 };

  for (const definition of EQUIPMENT_SETS) {
    try {
      const item = createEquipment(definition);
      const remaining = inventory.addItem(item);
      const remainingAmount = remaining?.amount ?? 0;
      result.granted += item.amount - remainingAmount;

      if (remainingAmount > 0) {
        if (dropRemaining(player, remaining)) {
          result.dropped += remainingAmount;
        } else {
          result.failed += remainingAmount;
        }
      }
    } catch (error) {
      result.failed += definition.count ?? definition.amount ?? 1;
      console.warn(`[KitBox] Failed to give ${definition.id}: ${error}`);
    }
  }

  return result;
}
