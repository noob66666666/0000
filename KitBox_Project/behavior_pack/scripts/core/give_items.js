import { ARMOR } from '../data/armor.js';
import { TOOLS } from '../data/tools.js';
import { MISC } from '../data/misc.js';
import { createEquipment } from './equipment_factory.js';
import { getInventory } from './inventory.js';

const BOXES = Object.freeze([
  { id: 'kitbox:equipment_box', definitions: ARMOR },
  { id: 'kitbox:tools_box', definitions: TOOLS },
  { id: 'kitbox:supplies_box', definitions: MISC },
]);

function addDefinitionToContainer(container, definition) {
  const item = createEquipment(definition);
  const remaining = container.addItem(item);
  if (remaining?.amount > 0) {
    throw new Error(`Storage box is full while adding ${definition.id ?? definition.item}`);
  }
}

function createFilledBox(boxDefinition) {
  const box = createEquipment({
    id: boxDefinition.id,
    item: boxDefinition.id,
    count: 1,
  });

  const inventory = box.getComponent('minecraft:inventory');
  if (!inventory?.container) {
    throw new Error(`Storage item has no inventory component: ${boxDefinition.id}`);
  }

  for (const definition of boxDefinition.definitions) {
    addDefinitionToContainer(inventory.container, definition);
  }

  return box;
}

function addBoxToPlayer(player, inventory, box) {
  const remaining = inventory.addItem(box);
  if (!remaining) return { granted: 1, dropped: 0, failed: 0 };

  if (remaining.amount > 0 && player?.dimension && player?.location) {
    try {
      player.dimension.spawnItem(remaining, player.location);
      return { granted: 0, dropped: remaining.amount, failed: 0 };
    } catch (error) {
      console.warn(`[KitBox] Failed to drop storage box ${remaining.typeId}: ${error}`);
    }
  }

  return { granted: 0, dropped: 0, failed: remaining.amount };
}

export function giveAll(player) {
  const inventory = getInventory(player);
  if (!inventory) return { granted: 0, dropped: 0, failed: 0 };

  const result = { granted: 0, dropped: 0, failed: 0 };

  for (const boxDefinition of BOXES) {
    try {
      const box = createFilledBox(boxDefinition);
      const boxResult = addBoxToPlayer(player, inventory, box);
      result.granted += boxResult.granted;
      result.dropped += boxResult.dropped;
      result.failed += boxResult.failed;
    } catch (error) {
      console.warn(`[KitBox] Failed to create ${boxDefinition.id}: ${error}`);
      result.failed += 1;
    }
  }

  return result;
}
