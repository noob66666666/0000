import { ItemStack, system } from '@minecraft/server';

const TEST_ITEM_ID = 'minecraft:apple';
const TEST_COUNT = 1;
const TEST_BLOCK_ID = 'minecraft:shulker_box';

function findAirAbove(player) {
  const base = player.location;
  for (let dy = 2; dy <= 8; dy += 1) {
    const location = {
      x: Math.floor(base.x),
      y: Math.floor(base.y) + dy,
      z: Math.floor(base.z),
    };
    const block = player.dimension.getBlock(location);
    if (block?.isAir) return location;
  }
  return undefined;
}

function runShulkerProbe(player) {
  const location = findAirAbove(player);
  if (!location) {
    player.sendMessage('[KitBox] 潛影盒測試失敗：玩家上方沒有可用的空氣方塊。');
    return;
  }

  let placed = false;
  try {
    player.dimension.setBlockType(location, TEST_BLOCK_ID);
    placed = true;

    const block = player.dimension.getBlock(location);
    const inventoryComponent = block?.getComponent('minecraft:inventory');
    const container = inventoryComponent?.container;
    if (!container) throw new Error('原生潛影盒沒有可用的 inventory container');

    container.setItem(0, new ItemStack(TEST_ITEM_ID, TEST_COUNT));

    const itemStack = block.getItemStack(1, true);
    if (!itemStack) throw new Error('Block.getItemStack(1, true) 回傳 undefined');
    if (itemStack.typeId !== TEST_BLOCK_ID) {
      throw new Error(`產生的 ItemStack 類型錯誤：${itemStack.typeId}`);
    }

    const remaining = player.getComponent('minecraft:inventory')?.container?.addItem(itemStack);
    if (remaining?.amount > 0) {
      player.dimension.spawnItem(remaining, player.location);
    }

    player.sendMessage('[KitBox] 原生潛影盒測試：已建立、填入蘋果、轉成帶資料 ItemStack 並交給玩家。請放置並打開這個潛影盒，確認蘋果是否仍在。');
    console.warn('[KitBox] Shulker probe passed ItemStack creation stage. Manual placement/open test required.');
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    player.sendMessage(`[KitBox] 原生潛影盒測試失敗：${message}`);
    console.warn(`[KitBox] Shulker probe failed: ${message}`);
  } finally {
    if (placed) {
      try {
        player.dimension.setBlockType(location, 'minecraft:air');
      } catch (error) {
        const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
        console.warn(`[KitBox] Shulker probe cleanup failed: ${message}`);
      }
    }
  }
}

export function scheduleShulkerProbe() {
  system.run(() => {
    const overworldPlayers = playerList('minecraft:overworld');
    const player = overworldPlayers[0];
    if (player) runShulkerProbe(player);
  });
}

function playerList(dimensionId) {
  const { world } = requireWorld();
  return world.getDimension(dimensionId).getPlayers();
}

function requireWorld() {
  return require('@minecraft/server');
}
