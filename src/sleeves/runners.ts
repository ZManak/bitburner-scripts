import { NS, SleevePerson } from "@ns";

export async function main(ns: NS): Promise<void> {
  assignSleeves(ns);
  ns.tprint("Sleeves assigned to Bladeburner tasks");
}

function assignSleeves(ns: NS): void {
  const numSleeves = 8;
  const sleeves: { sleeve: SleevePerson; i: number }[] = [];
  for (let i = 0; i < numSleeves; i++) {
    const clone = ns.sleeve.getSleeve(i);
    sleeves.push({ sleeve: clone, i: i });
  }
  sleeves.sort((a, b) => {
    return b.sleeve.skills.strength - a.sleeve.skills.strength;
  });
  ns.sleeve.setToBladeburnerAction(
    sleeves[0].i,
    "Take on contracts",
    "Bounty Hunter"
  );
  ns.sleeve.setToBladeburnerAction(
    sleeves[1].i,
    "Take on contracts",
    "Retirement"
  );
  ns.sleeve.setToBladeburnerAction(
    sleeves[2].i,
    "Take on contracts",
    "Tracking"
  );
  const diplomats = sleeves.slice(3).sort((a, b) => {
    return b.sleeve.skills.charisma - a.sleeve.skills.charisma;
  });
  ns.sleeve.setToBladeburnerAction(diplomats[0].i, "Diplomacy");
  ns.sleeve.setToBladeburnerAction(diplomats[1].i, "Diplomacy");
  const infiltrators = diplomats.slice(2).sort((a, b) => {
    return b.sleeve.skills.dexterity - a.sleeve.skills.dexterity;
  });
  ns.sleeve.setToBladeburnerAction(infiltrators[0].i, "Field Analysis");
  ns.sleeve.setToBladeburnerAction(infiltrators[1].i, "Infiltrate Synthoids");
  ns.sleeve.setToBladeburnerAction(infiltrators[2].i, "Infiltrate Synthoids");
}
