import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  try {
    ns.singularity.purchaseTor();
    ns.printf("Purchased TOR");
    ns.toast("Purchased TOR");
  } catch (e) {
    ns.tprint(e);
  }
}
