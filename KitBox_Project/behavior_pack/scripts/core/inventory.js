export function getInventory(player) {
    const component = player.getComponent("minecraft:inventory");
    return component ? component.container : undefined;
}