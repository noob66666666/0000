import { useKitBox } from "../core/kitbox_logic.js";

export const KITBOX_COMPONENT_ID = "kitbox:use_kitbox";

export function registerKitBoxComponent(itemComponentRegistry) {
  itemComponentRegistry.registerCustomComponent(KITBOX_COMPONENT_ID, {
    onUse(event) {
      if (!event.source) return;
      useKitBox(event.source);
    }
  });
}
