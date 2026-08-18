import { ItemStack, system } from "@minecraft/server";

const TEST_ITEM = "minecraft:apple";
const TEST_AMOUNT = 1;
const TEST_TAG = "kitbox:native_shulker_test";

function runNativeShulkerTest(player) {
  try {
    const dimension = player.dimension;
    const location = {
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y) - 1,
      z: Math.floor(player.location.z)
    };

    const block = dimension.getBlock(location);
    if (!block) throw new Error("Test block location unavailable");

    block.setType("minecraft:shulker_box");
    const inventory = block.getComponent("minecraft:inventory")?.container;
    if (!inventory) throw new Error("Native shulker inventory unavailable");

    inventory.setItem(0, new ItemStack(TEST_ITEM, TEST_AMOUNT));

    const shulkerStack = block.getItemStack(1, true);
    if (!shulkerStack) throw new Error("getItemStack returned no ItemStack");

    shulkerStack.setDynamicProperty(TEST_TAG, true);

    const playerInventory = player.getComponent("minecraft:inventory")?.container;
    if (!playerInventory) throw new Error("Player inventory unavailable");

    const leftover = playerInventory.addItem(shulkerStack);
    if (leftover) {
      player.dimension.spawnItem(leftover, player.location);
    }

    block.setType("minecraft:air");
    player.sendMessage("KitBox native shulker test: received a native shulker item. Place and open it to verify the stored apple.");
  } catch (error) {
    console.warn(`[KitBox] Native shulker test failed: ${error}`);
    player.sendMessage(`KitBox native shulker test failed: ${error}`);
  }
}

export function registerNativeShulkerTest() {
  system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "kitbox:native_shulker_test") return;
    const player = event.sourceEntity;
    if (!player) return;
    runNativeShulkerTest(player);
  });
}
