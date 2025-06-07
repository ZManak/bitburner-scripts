/* Displays the current status of the gang members,
including theis stats, equipment and current task. */

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.tail;
  ns.disableLog("ALL");
  ns.setTitle("The Slum Lord Gang Tracker");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.clearLog();
    const crew = ns.gang.getMemberNames();
    crew.forEach((member) => {
      const info = ns.gang.getMemberInformation(member);
      ns.printf(info.name);
      ns.printf("¦_ " + info.task);
      ns.print("¦_ " + `${info.hack} / ${info.hack_asc_points}`);
      ns.print("¦_ " + `${info.str} / ${info.str_asc_points}`);
      ns.print("¦_ " + `${info.def} / ${info.def_asc_points}`);
      ns.print("¦_ " + `${info.dex} / ${info.dex_asc_points}`);
      ns.print("¦_ " + `${info.agi} / ${info.agi_asc_points}`);
      ns.print("¦_ " + `${info.cha} / ${info.cha_asc_points}`);
      ns.print("--------------------");
    });
    await ns.sleep(1000);
  }
}
