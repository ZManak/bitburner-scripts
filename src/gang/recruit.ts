import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
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
    let i = 0;
    const canRecruit = ns.gang.canRecruitMember();
    //Recruit members until gang is full
    if (canRecruit) {
      ns.gang.recruitMember("Unit-00" + i);
      ns.gang.setMemberTask("Unit-00" + i, "Train Combat");
      i++;
    }

    ns.printf("Gang size: " + crew.length);
    ns.printf("Gang power: " + gangInfo.power);

    for (const member of crew) {
      const memberInfo = ns.gang.getMemberInformation(member);
      if (
        (memberInfo.agi && memberInfo.def && memberInfo.str && memberInfo.dex) >
          170 &&
        memberInfo.str_asc_mult < 1.5
      ) {
        ns.gang.ascendMember(member);
      }
      if (memberInfo.agi > 600 && memberInfo.task === "Train Combat") {
        ns.gang.setMemberTask(member, "Terrorism");
      }
      //Augmentate trained members
      installAugs(member, ns.getServerMoneyAvailable("home"));
    }

    //Set members to Human Traficking if members doing Terrorism is greater than 3
    const terrorist = crew.filter(
      (member) => ns.gang.getMemberInformation(member).task === "Terrorism"
    );
    ns.print(terrorist[0] + terrorist[1]);
    terrorist.length > 3
      ? ns.gang.setMemberTask(terrorist[0], "Human Trafficking")
      : null;

    await ns.sleep(1000);
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
          ? ns.print(`Succesfully installed ${aug} in ${member}`)
          : null;
      }
    }
  }
}
