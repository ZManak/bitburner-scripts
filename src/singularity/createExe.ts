import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const exe = ns.args[0];
  if (typeof exe !== "string") {
    return;
  } else {
    if (!ns.fileExists(exe, "home") && !ns.singularity.isBusy()) {
      ns.singularity.createProgram(exe, false);
      while (!ns.fileExists(exe, "home")) {
        await ns.sleep(1000);
      }
      ns.print("Created " + exe);
      ns.toast("Created " + exe);
    }
    await ns.sleep(0);
  }
}
