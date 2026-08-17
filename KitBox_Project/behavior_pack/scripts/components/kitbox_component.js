import { system } from "@minecraft/server";
import { useKitBox } from "../core/kitbox_logic.js";

export const KITBOX_COMPONENT_ID = "kitbox:use_kitbox";

export function registerKitBoxComponent(itemComponentRegistry) {
  if (!itemComponentRegistry) {
    throw new Error("KitBox item component registry is unavailable");
  }

  itemComponentRegistry.registerCustomComponent(KITBOX_COMPONENT_ID, {
    onUse(event) {
      const player = event?.source;
      if (!player) return;

      // Defer inventory/storage mutation until the gameplay tick so the
      // custom-component callback is not doing state-changing work inline.
      system.run(() => {
        try {
          useKitBox(player);
        } catch (error) {
          console.warn(`[KitBox] Failed during use: ${error}`);
        }
      });
    }
  });
}
