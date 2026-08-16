import { ARMOR } from "../data/armor.js";
import { WEAPONS } from "../data/weapons.js";
import { TOOLS } from "../data/tools.js";
import { MISC } from "../data/misc.js";

// Keep a stable delivery order so the player receives combat gear first,
// then tools, then supplies. Armor remains grouped by slot and protection set.
export const EQUIPMENT_SETS = Object.freeze([
  ...WEAPONS,
  ...TOOLS,
  ...MISC,
  ...ARMOR,
]);

export function getEquipmentDefinitions() {
  return EQUIPMENT_SETS;
}
