import { system } from "@minecraft/server";
import { registerKitBoxComponent } from "./components/kitbox_component.js";
import { scheduleShulkerProbe } from "./core/shulker_probe.js";

system.beforeEvents.startup.subscribe((initEvent) => {
  registerKitBoxComponent(initEvent.itemComponentRegistry);
});

// Temporary native-shulker verification. Remove after the iOS manual test passes.
system.runTimeout(() => {
  scheduleShulkerProbe();
}, 40);
