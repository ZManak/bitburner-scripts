import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.singularity.upgradeHomeRam()
    ? ns.tprint("Upgraded RAM")
    : ns.tprint(
        "Failed to upgrade RAM. Cost: " +
          ns.formatNumber(ns.singularity.getUpgradeHomeRamCost())
      );
}
