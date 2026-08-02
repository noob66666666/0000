import { EQUIPMENT_SETS } from "./equipment_sets.js";
import { createEquipment } from "./equipment_factory.js";
import { getPlayerInventory } from "./inventory.js";
export function giveAll(player){
 const inv=getPlayerInventory(player);
 for(const e of EQUIPMENT_SETS){
   const item=createEquipment(e);
   try{
     const ok=inv.addItem(item);
     if(ok===false && player.dimension){
       player.dimension.spawnItem(item, player.location);
     }
   }catch{
     try{ player.dimension.spawnItem(item, player.location);}catch{}
   }
 }
}
