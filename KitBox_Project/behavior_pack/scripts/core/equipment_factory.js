import { EnchantmentTypes, ItemStack } from '@minecraft/server';

function getEnchantmentType(id) {
  return EnchantmentTypes.get(id.startsWith('minecraft:') ? id : `minecraft:${id}`);
}

export function createEquipment(def) {
  const item = new ItemStack(def.item, def.count ?? def.amount ?? 1);
  const enchantable = item.getComponent('minecraft:enchantable');

  if (enchantable && def.enchantments?.length) {
    for (const [id, level] of def.enchantments) {
      const type = getEnchantmentType(id);
      if (!type) throw new Error(`Unknown enchantment: ${id}`);
      const enchantment = { type, level };
      if (!enchantable.canAddEnchantment(enchantment)) {
        throw new Error(`Illegal enchantment ${id} ${level} for ${def.item}`);
      }
      enchantable.addEnchantment(enchantment);
    }
  }

  return item;
}
