export function spawnKitParticles(player){
  try{
    player.dimension.spawnParticle("minecraft:basic_flame_particle", player.location);
  }catch{}
}
