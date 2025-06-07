import { NS } from "@ns";

export function main(ns: NS): void {
  try {
    ns.singularity.purchaseTor();
    ns.printf("Purchased TOR");
    ns.toast("Purchased TOR");
  } catch (e) {
    ns.tprint(e);
  }
}
