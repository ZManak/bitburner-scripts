//ALL
//aaaaaaaaaaaaaaa
/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const exes = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "AutoLink.exe",
    "ServerProfiler.exe",
  ];
  const canonServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
  const usefulServers = [
    "iron-gym",
    "powerhouse-fitness",
    "snap-fitness",
    "crush-fitness",
    "rothman-uni",
    "zb-institute",
    "summit-uni",
    "nwo",
    "fulcrumassets",
    "fulcrumtech",
  ];
  const canonFactions = [
    "CyberSec",
    "NiteSec",
    "The Black Hand",
    "BitRunners",
    "Daedalus",
    "The Dark Army",
    "The Syndicate",
    "Tian Di Hui",
    "Slum Snakes",
    "The Covenant",
    "Speakers for the Dead",
    "Silhouette",
  ];

  //let serversRam = 64;

  ns.disableLog("ALL");
  ns.print("Automation started");

  /*if (ns.fileExists("4s.js", "home") && !ns.isRunning("4s.js", "home")) {
    ns.run("4s.js", 1, "home");
  }*/

  while (true) {
    const player = ns.getPlayer();
    const factionOffers = ns.singularity.checkFactionInvitations();

    if (ns.getHackingLevel() < 25 && !ns.singularity.isBusy()) {
      ns.singularity.universityCourse(
        "rothman university",
        "Computer Sciences"
      );
      ns.printf("Taking computer classess");
      while (ns.getHackingLevel() < 50) {
        await ns.sleep(1000);
        ns.getHackingLevel();
      }
      ns.singularity.stopAction(); // Wait for the class to finish
    }

    //Create Programs
    await createProgram(ns, "BruteSSH.exe");
    await createProgram(ns, "FTPCrack.exe");

    //Buy nickofolas Congruity Implant
    if (
      !ns.singularity.isBusy() &&
      !ns.singularity
        .getOwnedAugmentations()
        .includes("nickofolas Congruity Implant") &&
      ns.grafting
        .getGraftableAugmentations()
        .includes("nickofolas Congruity Implant") &&
      ns.getServerMoneyAvailable("home") > 150e12
    ) {
      ns.singularity.travelToCity("New Tokyo");
      ns.grafting.graftAugmentation("nickofolas Congruity Implant");
    }

    //Buy programs
    if (player.money > 300000 && !ns.hasTorRouter()) {
      ns.singularity.purchaseTor();
      ns.printf("Purchased TOR");
      ns.toast("Purchased TOR");
    }
    if (
      ns.getHackingLevel() > 390 &&
      ns.getServerMoneyAvailable("home") >
        ns.singularity.getDarkwebProgramCost(exes[3]) &&
      ns.hasTorRouter() &&
      !ns.fileExists(exes[3], "home")
    ) {
      ns.singularity.purchaseProgram(exes[3]);
      ns.printf("Purchased RELAY");
    }
    if (
      ns.getHackingLevel() > 550 &&
      player.money > ns.singularity.getDarkwebProgramCost(exes[4]) &&
      ns.hasTorRouter() &&
      !ns.fileExists(exes[4], "home")
    ) {
      ns.singularity.purchaseProgram(exes[4]);
      ns.printf("Purchased WORM");
    }
    if (
      ns.getHackingLevel() > 700 &&
      player.money > ns.singularity.getDarkwebProgramCost(exes[5]) &&
      ns.hasTorRouter() &&
      !ns.fileExists(exes[5], "home")
    ) {
      ns.singularity.purchaseProgram(exes[5]);
      ns.printf("Purchased SQLInject");
    }

    //Join relevant factions
    for (const faction of factionOffers) {
      if (
        canonFactions.includes(faction) &&
        !player.factions.includes(faction)
      ) {
        ns.singularity.joinFaction(faction);
        ns.printf("Joined " + faction);
      }
    }

    /*  //Work for factions
    if (!ns.singularity.isBusy()) {
      for (const faction of player.factions) {
        if (canonFactions.includes(faction) && checkIfOwnedAugs(ns, faction)) {
          ns.singularity.workForFaction(faction, "hacking", false);
          ns.printf("Working for " + faction);
        }
      }
    } */

    //Buy && Install the Red Pill---
    if (
      ns.singularity.getFactionRep("Daedalus") > 2.5e6 &&
      !ns.singularity.getOwnedAugmentations(true).includes("The Red Pill")
    ) {
      ns.singularity.purchaseAugmentation("Daedalus", "The Red Pill");
      //ns.exec("/singularity/installAugs.js", "home");
    }

    //buy servers when possible
    /*  if (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
      await buyServers(ns, serversRam);
      serversRam = serversRam * 2;
    } */

    //Upgrade servers
    /* if (
      ns.getPurchasedServers().length > 0 &&
      ns.getPurchasedServerUpgradeCost(
        ns.getPurchasedServers()[0],
        serversRam
      ) <
        ns.getServerMoneyAvailable("home") * 0.7
    ) {
      upgradeServers(ns, serversRam);
      //serversRam = serversRam * 2;
    } */

    /* if (
      ns.formulas.work.crimeSuccessChance(player, "Larceny") < 0.75 &&
      !ns.singularity.isBusy()
    ) {
      ns.singularity.commitCrime("Shoplift", false);
    } else if (!ns.singularity.isBusy()) {
      ns.singularity.commitCrime("Larceny", false);
    } */

    //Install backdoors on canon servers
    for (let i = 0; i < canonServers.length; i++) {
      const server = ns.getServer(canonServers[i]);
      if (
        ns.hasRootAccess(canonServers[i]) &&
        server.backdoorInstalled === false
      ) {
        ns.printf("Installing backdoor on " + canonServers[i]);
        ns.run("findServer.js", 1, canonServers[i]);
        await ns.sleep(5000);
        await ns.singularity.installBackdoor();
        await ns.sleep(5000);
        ns.printf("Backdoor on " + canonServers[i]);
        ns.singularity.connect("home");
      }
    }

    //Backdoor useful servers
    for (let i = 0; i < usefulServers.length; i++) {
      const server = ns.getServer(usefulServers[i]);
      if (
        ns.hasRootAccess(usefulServers[i]) &&
        server.backdoorInstalled === false
      ) {
        ns.printf("Installing backdoor on " + usefulServers[i]);
        ns.run("findServer.js", 1, usefulServers[i]);
        await ns.sleep(5000);
        await ns.singularity.installBackdoor();
        await ns.sleep(5000);
        ns.printf("Backdoor on " + usefulServers[i]);
        ns.singularity.connect("home");
      }
    }

    //Get into Stock Market
    if (!ns.stock.has4SDataTIXAPI() && player.money > 35e9) {
      ns.stock.purchaseWseAccount();
      ns.stock.purchase4SMarketData();
      ns.stock.purchaseTixApi();
      ns.stock.purchase4SMarketDataTixApi();
      //ns.exec("4s.js", "home");
    }

    await ns.sleep(0);
  }

  //Checks if owned all augs from faction
  function checkIfOwnedAugs(ns: NS, faction: string): boolean {
    const ownedAugs = ns.singularity.getOwnedAugmentations(true);
    const factionAugs = ns.singularity.getAugmentationsFromFaction(faction);
    let checked = 0;
    for (const aug of factionAugs) {
      if (ownedAugs.includes(aug)) {
        checked = checked + 1;
      }
    }
    ns.print(
      "Owns " +
        checked +
        " out of " +
        factionAugs.length +
        " augs from " +
        faction
    );
    if (factionAugs.length === checked) {
      return false;
    } else {
      return true;
    }
  }

  async function createProgram(ns: NS, exe: string): Promise<void> {
    if (!ns.fileExists(exe, "home") && !ns.singularity.isBusy()) {
      ns.singularity.createProgram(exe);
      while (!ns.fileExists(exe, "home")) {
        await ns.sleep(1000);
      }
      ns.print("Created " + exe);
      ns.toast("Created " + exe);
    }
    await ns.sleep(0);
  }

  async function buyServers(ns: NS, ram: number): Promise<void> {
    const servers = ns.getPurchasedServers();
    const serverCost = ns.getPurchasedServerCost(ram);
    const maxServers = ns.getPurchasedServerLimit();
    const money = ns.getServerMoneyAvailable("home");
    for (let i = 0; i < maxServers; i++) {
      if (money > serverCost && servers.length < maxServers) {
        try {
          const server = ns.purchaseServer("Servo-", ram);
          ns.print("Purchased server " + server + " with " + ram + "GB of RAM");
        } catch (e) {
          ns.print("Failed to purchase server");
        }
      }
    }
  }

  function upgradeServers(ns: NS, ram: number): void {
    const servers = ns.getPurchasedServers();
    const maxRam = ns.getPurchasedServerMaxRam();
    const cost = ns.getPurchasedServerUpgradeCost(servers[0], ram);
    const money = ns.getServerMoneyAvailable("home");
    if (ram < maxRam && money * 0.7 > cost) {
      for (const server of servers) {
        const success = ns.upgradePurchasedServer(server, ram);
        if (success) {
          ns.print("Upgraded server " + server + " to " + ram + "GB of RAM");
        }
      }
    }
  }
}
//rate augmentations
/* for (const [ , ] of ) */
