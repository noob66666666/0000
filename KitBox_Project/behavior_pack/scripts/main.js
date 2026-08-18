import { system } from "@minecraft/server";
import { registerKitBoxComponent } from "./components/kitbox_component.js";
import { registerNativeShulkerTest } from "./tests/native_shulker_test.js";

system.beforeEvents.startup.subscribe((initEvent) => {
  registerKitBoxComponent(initEvent.itemComponentRegistry);
});

registerNativeShulkerTest();
