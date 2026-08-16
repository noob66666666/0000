const TOOL_COMMON = [['efficiency', 5], ['unbreaking', 3], ['mending', 1]];

export const TOOLS = [
  { id: 'pickaxe_fortune', item: 'minecraft:netherite_pickaxe', count: 1, enchantments: [...TOOL_COMMON, ['fortune', 3]] },
  { id: 'pickaxe_silk_touch', item: 'minecraft:netherite_pickaxe', count: 1, enchantments: [...TOOL_COMMON, ['silk_touch', 1]] },

  { id: 'shovel_fortune', item: 'minecraft:netherite_shovel', count: 1, enchantments: [...TOOL_COMMON, ['fortune', 3]] },
  { id: 'shovel_silk_touch', item: 'minecraft:netherite_shovel', count: 1, enchantments: [...TOOL_COMMON, ['silk_touch', 1]] },

  { id: 'hoe_fortune', item: 'minecraft:netherite_hoe', count: 1, enchantments: [...TOOL_COMMON, ['fortune', 3]] },
  { id: 'hoe_silk_touch', item: 'minecraft:netherite_hoe', count: 1, enchantments: [...TOOL_COMMON, ['silk_touch', 1]] },

  { id: 'shears', item: 'minecraft:shears', count: 1, enchantments: [['unbreaking', 3], ['mending', 1]] },
  { id: 'fishing_rod', item: 'minecraft:fishing_rod', count: 1, enchantments: [['luck_of_the_sea', 3], ['lure', 3], ['unbreaking', 3], ['mending', 1]] },
  { id: 'flint_and_steel', item: 'minecraft:flint_and_steel', count: 1, enchantments: [['unbreaking', 3], ['mending', 1]] },
];
