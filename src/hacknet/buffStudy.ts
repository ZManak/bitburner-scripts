import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const pla = ns.getPlayer();
    const hashes = ns.hacknet.numHashes();
    //const maxhashes = ns.hacknet.hashCapacity();
    if (hashes > ns.hacknet.hashCost("Improve Studying")) {
      ns.hacknet.spendHashes("Improve Studying");
      ns.print(
        `Improved studying by ${ns.hacknet.hashCost("Improve Studying")} ${
          ns.formulas.work.universityGains(
            pla,
            "Algorithms",
            "ZB Institute of Technology"
          ).hackExp
        }`
      );
    }
    await ns.sleep(100);
  }
}
