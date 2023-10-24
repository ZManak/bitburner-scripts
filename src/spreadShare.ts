import { NS } from "@ns";
import { scanServers } from "./utils/helpers";

export async function main(ns: NS): Promise<void> {
  const script = "share.js";
  const servers = scanServers(ns);

  for (const server of servers) {
    ns.scp(script, server);
    runMaxThreads(ns, script, server);
  }

  function runMaxThreads(ns: NS, script: string, server: string): void {
    const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const threads = Math.floor(freeRam / ns.getScriptRam(script));
    threads > 0 ? ns.exec(script, server, threads) : null;
  }
}
