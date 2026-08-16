import { system } from "@minecraft/server";
import { registerKitBoxComponent } from "./components/kitbox_component.js";

system.beforeEvents.startup.subscribe((initEvent) => {
  registerKitBoxComponent(initEvent.itemComponentRegistry);
});
