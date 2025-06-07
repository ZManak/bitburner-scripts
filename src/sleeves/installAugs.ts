//edited - excluded sleeves with shock
/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const sleeves = 8;
  let totalCost = 0;

  for (let i = 0; i < sleeves; i++) {
    const augs = ns.sleeve.getSleevePurchasableAugs(i);
    totalCost += augs.reduce((acc, aug) => acc + aug.cost, 0);
  }

  const shouldProceed = await ns.prompt(
    `Proceed by ${ns.formatNumber(totalCost)}`
  );
  if (!shouldProceed) return;

  for (let i = 0; i < sleeves; i++) {
    if (ns.sleeve.getSleeve(i).shock === 0) {
      const augs = ns.sleeve.getSleevePurchasableAugs(i);
      for (const aug of augs) {
        const installed = ns.sleeve.purchaseSleeveAug(i, aug.name);
        const message = installed
          ? `Installed ${aug.name} on sleeve ${i}`
          : `Failed to install ${aug.name} on sleeve ${i}`;
        ns.tprint(message);
      }
    }
    ns.tprint("___________________________________________________________");
  }
}
