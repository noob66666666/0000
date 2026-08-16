import { ItemStack } from '@minecraft/server';

export function createItem(id, count = 1) {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error('Item id is required');
  }
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`Invalid item amount ${count} for ${id}`);
  }
  return new ItemStack(id, count);
}
