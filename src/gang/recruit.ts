import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.clearLog();
    if (!ns.gang.inGang()) {
      try {
        ns.gang.createGang("Slum Snakes");
        ns.print("Gang created");
      } catch (e) {
        ns.tprint("Gang already exists");
      }
    }
    const crew = ns.gang.getMemberNames();
    const gangInfo = ns.gang.getGangInformation();
    const canRecruit = ns.gang.canRecruitMember();
    const territory = gangInfo.territory;
    //Recruit members until gang is full
    if (canRecruit) {
      const id = crypto.randomUUID();
      ns.gang.recruitMember(`Unit-${id}`);
      ns.gang.setMemberTask(`Unit-${id}`, "Train Combat");
    }

    ns.printf("Gang size: " + crew.length);
    ns.printf("Gang power: " + ns.formatNumber(gangInfo.power));

    for (const member of crew) {
      const memberInfo = ns.gang.getMemberInformation(member);
      const ascendResults = ns.gang.getAscensionResult(member);
      if (ascendResults !== undefined && ascendResults.agi >= 7) {
        ns.gang.ascendMember(member);
      }
      if (memberInfo.agi > 600 && memberInfo.task === "Train Combat") {
        ns.gang.setMemberTask(member, "Terrorism");
      }
      //Augmentate trained members
      if (memberInfo.agi_asc_mult > 6.7) {
        installAugs(member, ns.getServerMoneyAvailable("home"));
      }
    }

    //Set members to Human Traficking if members doing Terrorism is greater than 3
    const terrorist = crew.filter(
      (member) => ns.gang.getMemberInformation(member).task === "Terrorism"
    );
    terrorist.length > 3
      ? ns.gang.setMemberTask(terrorist[0], "Human Trafficking")
      : null;

    winRate(territory);

    await ns.sleep(1000);
  }

  function winRate(territory: number) {
    const rivals = ns.gang.getOtherGangInformation();
    const names: Array<string> = Object.keys(rivals);
    const winChances = [];
    let totalChance = 0;

    for (let i = 0; i < names.length; i++) {
      winChances.push(ns.gang.getChanceToWinClash(names[i]));
    }
    for (const chance of winChances) {
      totalChance = totalChance + chance;
    }
    const chanceMean = totalChance / names.length;
    ns.print(ns.formatPercent(territory));
    ns.print("Average " + ns.formatPercent(chanceMean) + "% clash win");
  }

  function installAugs(member: string, funds: number) {
    const equipment = ns.gang.getEquipmentNames();
    const augs = equipment.filter(
      (item) => ns.gang.getEquipmentType(item) === "Augmentation"
    );
    const combatAugs = augs.filter(
      (item) =>
        ns.gang.getEquipmentStats(item).str ||
        ns.gang.getEquipmentStats(item).def ||
        ns.gang.getEquipmentStats(item).dex ||
        ns.gang.getEquipmentStats(item).agi
    );
    for (const aug of combatAugs) {
      if (
        funds > ns.gang.getEquipmentCost(aug) &&
        !ns.gang.getMemberInformation(member).augmentations.includes(aug)
      ) {
        ns.gang.purchaseEquipment(member, aug)
          ? ns.tprint(`Succesfully installed ${aug} in ${member}`)
          : null;
      }
    }
  }
}
