import { NS } from "@ns";
//v1
function autocomplete(data: any, args: string): Array<string> {
  return data.servers;
}

function scanServers(ns: NS): Array<string> {
  const servers = ["home"];
  for (let i = 0; i < servers.length; i++) {
    const thisScan = ns.scan(servers[i]);
    for (let j = 0; j < thisScan.length; j++) {
      if (servers.indexOf(thisScan[j]) === -1) {
        servers.push(thisScan[j]);
      }
    }
  }
  return servers;
}

function overKill(ns: NS, servers: string[]): void {
  for (const i in servers) {
    ns.killall(servers[i]);
    ns.tprint("All scripts killed in " + servers[i]);
  }
}

function upgradeRam(ns: NS): void {
  try {
    ns.tprint(
      "Spendind " + ns.formatNumber(ns.singularity.getUpgradeHomeRamCost())
    );
    ns.singularity.upgradeHomeRam();
    ns.tprint("Upgraded RAM to " + ns.getServer().maxRam);
    ns.tprint(
      "Next upgrade will be " +
        ns.formatNumber(ns.singularity.getUpgradeHomeRamCost())
    );
  } catch (e) {
    ns.tprint(e);
  }
}

function upgradeCores(ns: NS): void {
  try {
    ns.singularity.upgradeHomeCores();
    ns.tprint("Upgraded Cores --> " + ns.getServer().cpuCores);
    ns.tprint("Next Upgrade --> " + ns.singularity.getUpgradeHomeCoresCost());
  } catch (e) {
    ns.tprint(e);
  }
}

export { scanServers, overKill, autocomplete, upgradeRam, upgradeCores };
