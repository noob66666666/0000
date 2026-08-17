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
a const BOXES = Object.freeze([
  { id: 'kitbox:tools_box', definitions: [...TOOLS, ...WEAPONS] },
  { id: 'kitbox:equipment_box', definitions: ARMOR },
  { id: 'kitbox:supplies_box', definitions: MISC },
]);

function describeError(error) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  return String(error);
}

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
  console.warn(`[KitBox] Creating storage box: ${boxDefinition.id}`);

  let box;
  try {
    box = new ItemStack(boxDefinition.id, 1);
    console.warn(`[KitBox] ItemStack created: ${box.typeId}`);
  } catch (error) {
    throw new Error(`new ItemStack failed for ${boxDefinition.id}: ${describeError(error)}`);
  }

  let inventory;
  try {
    inventory = box.getComponent('minecraft:inventory');
    console.warn(`[KitBox] inventory component: ${inventory ? 'found' : 'missing'}`);
  } catch (error) {
    throw new Error(`getComponent(minecraft:inventory) failed for ${boxDefinition.id}: ${describeError(error)}`);
  }

  if (!inventory?.container) {
    throw new Error(`Storage item has no dynamic inventory: ${boxDefinition.id}`);
  }

  console.warn(`[KitBox] container size for ${boxDefinition.id}: ${inventory.container.size}`);

  for (const definition of boxDefinition.definitions) {
    try {
      addDefinitionToContainer(inventory.container, definition);
    } catch (error) {
      throw new Error(`Adding ${definition.id ?? definition.item} to ${boxDefinition.id} failed: ${describeError(error)}`);
    }
  }

  console.warn(`[KitBox] Storage box filled: ${boxDefinition.id}`);
  return box;
}

function addBoxToPlayer(player, inventory, box) {
  try {
    const remaining = inventory.addItem(box);
    if (!remaining || remaining.amount <= 0) {
      console.warn(`[KitBox] Storage box granted: ${box.typeId}`);
      return { granted: 1, dropped: 0, failed: 0 };
    }

    if (player?.dimension && player?.location) {
      try {
        player.dimension.spawnItem(remaining, player.location);
        console.warn(`[KitBox] Storage box dropped: ${remaining.typeId}`);
        return { granted: 0, dropped: remaining.amount, failed: 0 };
      } catch (error) {
        console.warn(`[KitBox] Failed to drop storage box ${remaining.typeId}: ${describeError(error)}`);
      }
    }

    return { granted: 0, dropped: 0, failed: remaining.amount };
  } catch (error) {
    console.warn(`[KitBox] inventory.addItem failed for ${box.typeId}: ${describeError(error)}`);
    return { granted: 0, dropped: 0, failed: 1 };
  }
}

export function giveAll(player) {
  const inventory = getInventory(player);
  if (!inventory) {
    console.warn('[KitBox] Player inventory component/container is unavailable.');
    return { granted: 0, dropped: 0, failed: BOXES.length };
  }

  const result = { granted: 0, dropped: 0, failed: 0 };

  for (const boxDefinition of BOXES) {
    try {
      const box = createFilledBox(boxDefinition);
      const boxResult = addBoxToPlayer(player, inventory, box);
      result.granted += boxResult.granted;
      result.dropped += boxResult.dropped;
      result.failed += boxResult.failed;
    } catch (error) {
      console.warn(`[KitBox] FAILED ${boxDefinition.id}: ${describeError(error)}`);
      result.failed += 1;
    }
  }

  console.warn(`[KitBox] giveAll result: granted=${result.granted}, dropped=${result.dropped}, failed=${result.failed}`);
  return result;
}
