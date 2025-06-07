import { NS } from "@ns";

export async function main(ns: NS): Promise<boolean> {
  const i = <number>ns.args[0];

  if (
    ns.sleeve.setToBladeburnerAction(i, "Hyperbolic Regeneration Chamber") &&
    ns.sleeve.getSleeve(i).hp.current < 4
  ) {
    ns.print(`Sleeve ${i} HP critical`);
    await ns.sleep(120000);
    ns.sleeve.setToBladeburnerAction(i, "general", "Field Analysis");
    return true;
  } else {
    return false;
  }
}
