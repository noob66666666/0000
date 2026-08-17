import { ItemStack } from '@minecraft/server';
import { ARMOR } from '../data/armor.js';
import { WEAPONS } from '../data/weapons.js';
import { TOOLS } from '../data/tools.js';
import { MISC } from '../data/misc.js';
import { createEquipment } from './equipment_factory.js';
import { getInventory } from './inventory.js';

// 玩家使用 KitBox 後只取得三個儲存盒：
// 1. 工具 + 武器
// 2. 防具
// 3. 其他物品 / 補給
const BOXES = Object.freeze([
  { id: 'kitbox:tools_box', definitions: [...TOOLS, ...WEAPONS] },
  { id: 'kitbox:equipment_box', definitions: ARMOR },
  { id: 'kitbox:supplies_box', definitions: MISC },
]);

function addDefinitionToContainer(container, definition) {
  const item = createEquipment({
    ...definition,
    count: definition.count ?? definition.amount ?? 1,
  });

  const remaining = container.addItem(item);
  if (remaining && remaining.amount > 0) {
    throw new Error(`Storage box is full while adding ${definition.id ?? definition.item}`);
  }
}

function createFilledBox(boxDefinition) {
  // Create the storage item directly. The storage component supplies the
  // item's dynamic inventory; no ordinary entity/block inventory is needed.
  const box = new ItemStack(boxDefinition.id, 1);
  const inventory = box.getComponent('minecraft:inventory');

  if (!inventory?.container) {
    throw new Error(`Storage item has no dynamic inventory: ${boxDefinition.id}`);
  }

  for (const definition of boxDefinition.definitions) {
    addDefinitionToContainer(inventory.container, definition);
  }

  return box;
}

function addBoxToPlayer(player, inventory, box) {
  const remaining = inventory.addItem(box);
  if (!remaining || remaining.amount <= 0) {
    return { granted: 1, dropped: 0, failed: 0 };
  }

  if (player?.dimension && player?.location) {
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
      console.warn(`[KitBox] Failed to create storage box ${boxDefinition.id}: ${error}`);
      result.failed += 1;
    }
  }

  return result;
}
