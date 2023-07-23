import { NS } from "@ns";

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

export { scanServers, overKill, autocomplete };
