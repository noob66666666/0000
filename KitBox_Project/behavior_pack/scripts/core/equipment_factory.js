import { ItemStack } from '@minecraft/server';
export function createEquipment(def){return new ItemStack(def.item,def.count??1);}
