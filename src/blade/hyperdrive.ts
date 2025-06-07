import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  ns.setTitle("⭐️🌀⭐️ Bladeburner Skill Upgrader ⭐️🌀⭐️");
  const skill = <string>ns.args[0];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const lvlCost = ns.bladeburner.getSkillUpgradeCost(skill);
    const lvl = ns.bladeburner.getSkillLevel(skill);
    const points = ns.bladeburner.getSkillPoints();

    buyLevel(ns, skill, points, lvlCost);
    printSkill(ns, skill, points, lvlCost, lvl);
    await ns.sleep(0);
    ns.clearLog();
  }
}

function buyLevel(
  ns: NS,
  skill: string,
  points: number,
  lvlCost: number
): boolean {
  let upgraded = false;
  try {
    if (points > lvlCost) {
      ns.bladeburner.upgradeSkill(skill, 1);
      upgraded = true;
    }
  } catch (e) {
    ns.print("Error upgrading skill: " + e);
  }
  return upgraded;
}

function printSkill(
  ns: NS,
  skill: string,
  points: number,
  lvlCost: number,
  lvl: number
): void {
  const multi = (1.1 ^ ((lvl + 1) * 1.05)) / 10;
  let output = "";
  ns.print("Skill: " + skill + " Level: " + lvl + " Multi: " + multi);
  ns.print(
    "NEXT LVL: " +
      lvlCost +
      " POINTS: " +
      points +
      " / " +
      ns.formatPercent(points / lvlCost) +
      "%)"
  );

  output = "";
  let perc: number;
  const goal = lvlCost;
  //var current = ns.getServerMinSecurityLevel(hackedServers[i]);
  const current = points;
  // security = ns.getServerSecurityLevel(hackedServers[i]);
  if (goal != current) {
    output += " 🌀 " + " ";
    perc = ((current / goal) * 100) / 5;
  } else {
    output += " \uD83D\uDCA2 " + " ";
    perc = 100;
  }
  if (perc != 0) {
    let aux = perc;
    for (let j = output.length; j < 5; j++) output += "_";
    output += "[";
    for (let j = 0; j < 20; j++) {
      if (aux >= 1) {
        output += "🗡";
        aux--;
      } else {
        output += "--";
      }
    }
    output += "]" + " " + ns.formatPercent((perc * 5) / 100) + "%";
  }
  ns.print("");
  ns.print(output);
  ns.print("_______________________________");
  ns.print(
    `${ns.bladeburner.getCurrentAction().type} - ${
      ns.bladeburner.getCurrentAction().name
    }`
  );
  ns.print(
    `Difficulty: ${ns.bladeburner.getActionEstimatedSuccessChance(
      ns.bladeburner.getCurrentAction().type,
      ns.bladeburner.getCurrentAction().name
    )}`
  );
  1;
  ns.print(
    `${
      (ns.bladeburner.getActionTime(
        ns.bladeburner.getCurrentAction().type,
        ns.bladeburner.getCurrentAction().name
      ) -
        ns.bladeburner.getActionCurrentTime()) /
      1000
    } sec remaining`
  );
}
