import { EnchantmentTypes, ItemStack } from '@minecraft/server';

function getEnchantmentType(id) {
  const normalizedId = id.startsWith('minecraft:') ? id : `minecraft:${id}`;
  return EnchantmentTypes.get(normalizedId);
}

function validateDefinition(def) {
  if (!def || typeof def !== 'object') {
    throw new Error('Equipment definition is missing');
  }
  if (typeof def.item !== 'string' || def.item.length === 0) {
    throw new Error('Equipment definition is missing item id');
  }

  const amount = def.count ?? def.amount ?? 1;
  if (!Number.isInteger(amount) || amount < 1 || amount > 255) {
    throw new Error(`Invalid item amount ${amount} for ${def.item}`);
  }

  const enchantments = def.enchantments ?? [];
  if (!Array.isArray(enchantments)) {
    throw new Error(`Invalid enchantments definition for ${def.item}`);
  }

  return { amount, enchantments };
}

export function createEquipment(def) {
  const { amount, enchantments } = validateDefinition(def);
  const item = new ItemStack(def.item, amount);

  if (enchantments.length === 0) return item;

  const enchantable = item.getComponent('minecraft:enchantable');
  if (!enchantable) {
    throw new Error(`Item is not enchantable: ${def.item}`);
  }

  for (const entry of enchantments) {
    if (!Array.isArray(entry) || entry.length !== 2) {
      throw new Error(`Invalid enchantment entry for ${def.item}`);
    }

    const [id, level] = entry;
    if (typeof id !== 'string' || id.length === 0 || !Number.isInteger(level) || level < 1) {
      throw new Error(`Invalid enchantment ${id} ${level} for ${def.item}`);
    }

    const type = getEnchantmentType(id);
    if (!type) throw new Error(`Unknown enchantment: ${id}`);

    const enchantment = { type, level };
    if (!enchantable.canAddEnchantment(enchantment)) {
      throw new Error(`Illegal enchantment ${id} ${level} for ${def.item}`);
    }

    enchantable.addEnchantment(enchantment);
  }

  return item;
}
