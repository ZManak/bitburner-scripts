import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const factions = ns.getPlayer().factions;
    const cash = ns.getServerMoneyAvailable("home");
    const aug = "NeuroFlux Governor";
    const augCost = ns.singularity.getAugmentationPrice(aug);
    factions.forEach((faction) => {
      ns.singularity.getAugmentationsFromFaction;
      if (cash > augCost) {
        ns.singularity.purchaseAugmentation("Daedalus", aug)
          ? ns.print("Purchased " + aug)
          : ns.print("Failed to purchase " + aug);
      } else {
        ns.print("Not more money to purchase " + aug);
      }
      const augLvl = ns.singularity
        .getOwnedAugmentations(true)
        .filter((aug) => aug.includes("NeuroFlux Governor")).length;
      ns.print(`GOT  ==> ${augLvl} doses of ${aug}`);
      ns.print("_______________________________");
    });
    await ns.sleep(1000);
    ns.clearLog();
  }
}
