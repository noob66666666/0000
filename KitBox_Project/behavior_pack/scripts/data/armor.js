const COMMON = [['unbreaking', 3], ['mending', 1]];
const HEAD = [['respiration', 3], ['aqua_affinity', 1]];
const PROTECTION = [
  ['protection', 4, 'protection'],
  ['fire_protection', 4, 'fire'],
  ['blast_protection', 4, 'blast'],
  ['projectile_protection', 4, 'projectile'],
];

function enchants(primary, extra = []) {
  return [primary, ...extra, ...COMMON];
}

export const ARMOR = [
  ...PROTECTION.map(([type, level, id]) => ({
    id: `helmet_${id}`,
    item: 'minecraft:netherite_helmet',
    count: 1,
    enchantments: enchants([type, level], HEAD),
  })),
  ...PROTECTION.map(([type, level, id]) => ({
    id: `chestplate_${id}`,
    item: 'minecraft:netherite_chestplate',
    count: 1,
    enchantments: enchants([type, level]),
  })),
  ...PROTECTION.map(([type, level, id]) => ({
    id: `leggings_${id}`,
    item: 'minecraft:netherite_leggings',
    count: 1,
    enchantments: enchants([type, level], [['swift_sneak', 3]]),
  })),
  ...PROTECTION.flatMap(([type, level, id]) => [
    {
      id: `boots_${id}_depth_strider`,
      item: 'minecraft:netherite_boots',
      count: 1,
      enchantments: enchants([type, level], [['feather_falling', 4], ['depth_strider', 3]]),
    },
    {
      id: `boots_${id}_frost_walker`,
      item: 'minecraft:netherite_boots',
      count: 1,
      enchantments: enchants([type, level], [['feather_falling', 4], ['frost_walker', 2]]),
    },
    {
      id: `boots_${id}_soul_speed`,
      item: 'minecraft:netherite_boots',
      count: 1,
      enchantments: enchants([type, level], [['feather_falling', 4], ['depth_strider', 3], ['soul_speed', 3]]),
    },
  ]),
];
