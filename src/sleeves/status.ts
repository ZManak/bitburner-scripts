import { NS, SleevePerson } from "@ns";
import { colors } from "utils/palette.js";

export async function main(ns: NS): Promise<void> {
  //8sleeves
  ns.setTitle("Sleeves Status");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.disableLog("ALL");
    ns.clearLog();
    const numSleeves = 8;
    for (let i = 0; i < numSleeves; i++) {
      const clone = ns.sleeve.getSleeve(i);
      const cloneTask = ns.sleeve.getTask(i);
      ns.printf("Sleeve %d:", i);
      ns.printf(colors.red + "HP: %d / %d", clone.hp.current, clone.hp.max);
      ns.printf(
        colors.white + "Str: %d Def: %d Dex: %d Agi: %d",
        clone.skills.strength,
        clone.skills.defense,
        clone.skills.dexterity,
        clone.skills.agility
      );
      ns.printf(
        colors.green + "Hack: %d " + colors.magenta + "Cha: %d",
        clone.skills.hacking,
        clone.skills.charisma
      );
      ns.printf(
        colors.cyan + "Int: %d / %d exp remaining (%s)",
        clone.skills.intelligence,
        ns.formulas.skills.calculateExp(clone.skills.intelligence + 1) -
          clone.exp.intelligence,
        ns.formatPercent(
          (ns.formulas.skills.calculateExp(clone.skills.intelligence + 1) -
            clone.exp.intelligence) /
            ns.formulas.skills.calculateExp(clone.skills.intelligence + 1)
        )
      );
      ns.printf("Cycles: %d", clone.storedCycles);
      ns.printf(
        "Shock: %d / ~ %d minutes remaining",
        clone.shock,
        timeUntilNoShock(clone, clone.storedCycles)
      );
      if (cloneTask?.type === "CRIME") {
        ns.printf(
          "Task: %s %s",
          cloneTask.type,
          cloneTask.crimeType.toUpperCase()
        );
      } else if (cloneTask?.type === "CLASS") {
        ns.printf(
          "Task: %s %s",
          cloneTask.type,
          cloneTask.classType.toUpperCase()
        );
      } else if (cloneTask?.type === "COMPANY") {
        ns.printf("Task: %s", cloneTask.companyName.toUpperCase());
      } else {
        ns.printf("Task: %s", cloneTask?.type);
      }
      ns.print("_______________________________");
    }
    await ns.sleep(0);
  }
  function timeUntilNoShock(clone: SleevePerson, cycles: number): number {
    clone.shock = Math.max(
      0,
      clone.shock -
        0.0002 * Math.max(1, (clone.skills.intelligence / 500) * cycles)
    );
    clone.shock = Math.max(
      0,
      clone.shock -
        0.0002 * Math.max(1, (clone.skills.intelligence / 500) * cycles)
    );
    return clone.shock;
  }
}
