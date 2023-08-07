/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const sleeves = 7;

  for (let i = 0; i < sleeves; i++) {
    const augs = ns.sleeve.getSleevePurchasableAugs(i);
    augs.sort((a, b) => b.cost - a.cost);
    for (const aug of augs) {
      const installed = ns.sleeve.purchaseSleeveAug(i, aug.name);
      if (installed) {
        ns.tprint("Installed " + aug.name + " on sleeve " + i);
      } else {
        ns.tprint("Failed to install " + aug.name + " on sleeve " + i);
      }
    }
    ns.tprint("___________________________________________________________");
  }
}
