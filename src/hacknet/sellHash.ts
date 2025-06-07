import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.disableLog("ALL");
    ns.clearLog();
    const hashes = ns.hacknet.numHashes();
    const maxhashes = ns.hacknet.hashCapacity();
    if (hashes > maxhashes * 0.95) {
      ns.hacknet.spendHashes("Sell for Money");
      ns.print("Sold hash surplus");
    }
    await ns.sleep(100);
  }
}
