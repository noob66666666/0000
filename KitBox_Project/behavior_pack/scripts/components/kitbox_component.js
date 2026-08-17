import { ItemComponentUseEvent } from "@minecraft/server";
import { useKitBox } from "../core/kitbox_logic.js";

export const KITBOX_COMPONENT_ID = "kitbox:use_kitbox";

export function registerKitBoxComponent(itemComponentRegistry) {
  if (!itemComponentRegistry) {
    throw new Error("KitBox item component registry is unavailable");
  }

  itemComponentRegistry.registerCustomComponent(KITBOX_COMPONENT_ID, {
    onUse(event) {
      const useEvent = event;
      const player = useEvent.source;
      if (!player) return;
      useKitBox(player);
    }
  });
}
