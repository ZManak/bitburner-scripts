//Tracks how long until donations are available
//Current issues: does not take into account passive rep grow and non regular exp gains

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.tail();

  //Help text =)
  const args = ns.flags([["help", false]]);
  const faction = <string>ns.args[0];
  const favor = <number>ns.args[1];
  if (args.help || !faction) {
    ns.tprint("This script calculates estimated time to reach Donations.");
    ns.tprint(`Usage: run ${ns.getScriptName()} FACTION FAVOR`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} "The Black Hand" 150`);
    return;
  }

  ns.disableLog("ALL");
  ns.setTitle("Remaining time for donations - " + faction);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.clearLog();
    const player = ns.getPlayer();
    const share = ns.getSharePower();
    const repRequired = ns.formulas.reputation.calculateFavorToRep(favor);
    const currentRep = ns.singularity.getFactionRep(faction);
    const remainingRep = repRequired - currentRep;

    ns.print(currentRep + " " + repRequired + " " + remainingRep);
    //1 cycle = 200ms
    const cycleTime = 0.2; //s

    const repPerCycle = ns.formulas.work.factionGains(
      player,
      "hacking",
      0
    ).reputation;

    const sleeveRepCycle = isSleeveWorking(7, faction);

    ns.print("Player rep/s - " + repPerCycle * 5);
    ns.print("Sleeve rep/s - " + sleeveRepCycle * 5);
    ns.print("Share Power: " + share);

    const cyclesRemaining =
      remainingRep / ((repPerCycle + sleeveRepCycle) * share);
    const timeRemaining = cyclesRemaining * cycleTime;
    ns.print(`${formatHhMmSs(timeRemaining)} until Favor to Donate`);
    ns.print(ns.formatPercent(remainingRep / repRequired) + " left");
    /* } else {
      const timeRemaining = (remainingRep / repPerCycle).toPrecision(20);
      ns.print(
        `${new Date(
          convertToMs((parseFloat(timeRemaining) / 3600) * 0.2)
        ).toLocaleTimeString()} hours until Favor to Donate`
      );
      ns.print(ns.formatPercent(remainingRep / repRequired) + " left");
    } */

    await ns.sleep(1000);
  }

  // 0 if no sleeves working for faction
  function isSleeveWorking(sleevesNum: number, faction: string): number {
    for (let i = 0; i < sleevesNum; i++) {
      const task = ns.sleeve.getTask(i);
      if (task?.type === "FACTION" && task.factionName === faction) {
        return getSleeveGains(i, task.factionWorkType);
      }
    }
    return 0;
  }

  function getSleeveGains(
    sleeveId: number,
    workType: "hacking" | "field" | "security"
  ): number {
    const sleevePerson = ns.sleeve.getSleeve(sleeveId);
    return ns.formulas.work.factionGains(sleevePerson, workType, 0).reputation;
  }

  function formatHhMmSs(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const remainder = seconds % 3600;
    const minutes = Math.floor(remainder / 60);
    const sec = Math.floor(remainder % 60);
    return `${hours}:${minutes}:${sec}`;
  }
}
