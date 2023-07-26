import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.singularity.upgradeHomeCores()
    ? ns.tprint("+1 Core")
    : ns.tprint(
        "Failed to upgrade Cores. Cost: " +
          ns.formatNumber(ns.singularity.getUpgradeHomeCoresCost())
      );
}
