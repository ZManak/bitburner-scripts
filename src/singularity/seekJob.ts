import { CompanyName, WorkStats, NS, CompanyPositionInfo } from "@ns";

export async function main(ns: NS): Promise<boolean> {
  ns.disableLog("ALL");
  const AllCompanies = Object.values(CompanyName);
  const companyNames: Array<string | CompanyName> = [
    "ECorp",
    "MegaCorp",
    "Bachman & Associates",
    "Blade Industries",
    "NWO",
    "Clarke Incorporated",
    "OmniTek Incorporated",
    "Four Sigma",
    "KuaiGong International",
    "Fulcrum Technologies",
    "Storm Technologies",
    "DefComm",
    "Helios Labs",
    "VitaLife",
    "Icarus Microsystems",
    "Universal Energy",
    "Galactic Cybersystems",
    "AeroCorp",
    "Omnia Cybersystems",
    "Solaris Space Systems",
    "DeltaOne",
    "Global Pharmaceuticals",
    "Nova Medical",
    "Central Intelligence Agency",
    "National Security Agency",
    "Watchdog Security",
    "LexoCorp",
    "Rho Construction",
    "Alpha Enterprises",
    "Aevum Police Headquarters",
    "SysCore Securities",
    "CompuTek",
    "NetLink Technologies",
    "Carmichael Security",
    "FoodNStuff",
    "Joe's Guns",
    "Omega Software",
    "Noodle Bar",
  ];
  ns.singularity.getFactionRep("Illuminati");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.clearLog();
    const player = ns.getPlayer();
    const currentWork = ns.singularity.getCurrentWork();
    const gains: [string, string, WorkStats][] = [];
    const requirements: [string | CompanyName, string, CompanyPositionInfo][] =
      [];
    ns.print(currentWork.company + " " + currentWork.position);

    for (const element in AllCompanies) {
      const company = <CompanyName>element;
      const positions = ns.singularity.getCompanyPositions(company);
      const companyFavor = ns.singularity.getCompanyFavor(company);
      for (const position of positions) {
        const positionInfo = ns.singularity.getCompanyPositionInfo(
          company,
          position
        );
        const gain = ns.formulas.work.companyGains(
          player,
          company,
          position,
          companyFavor
        );
        requirements.push([company, position, positionInfo]);
        gains.push([company, position, gain]);
      }
    }

    gains.sort(
      (a: [string, string, WorkStats], b: [string, string, WorkStats]) =>
        b[2].money - a[2].money
    );

    for (const element of requirements) {
      if (
        player.skills.agility > element[2].requiredSkills.agility &&
        player.skills.charisma > element[2].requiredSkills.charisma &&
        player.skills.dexterity > element[2].requiredSkills.dexterity &&
        player.skills.hacking > element[2].requiredSkills.hacking &&
        player.skills.strength > element[2].requiredSkills.strength &&
        player.skills.defense > element[2].requiredSkills.defense &&
        currentWork !== (element[0] && element[1])
      ) {
        const company = <CompanyName>element[0];
        const gotWork = ns.singularity.applyToCompany(
          company,
          <string>element[1]
        );
        ns.tprint("Applied to " + company + " " + element[1]);
        return gotWork;
      }
    }
  }
}

//     for (let i = 0; i < names.length; i++) {
