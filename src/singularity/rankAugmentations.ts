import { NS } from "@ns";

interface Augmentation {
  name: string;
  price: number;
  stats: number;
}

async function rankAugmentations(
  ns: NS,
  faction: string
): Promise<Augmentation[]> {
  const augmentations = ns.singularity.getAugmentationsFromFaction(faction);
  const augmentationStatsPromises = augmentations.map((aug) =>
    ns.singularity.getAugmentationStats(aug)
  );
  const augmentationStats = await Promise.all(augmentationStatsPromises);

  const augmentedStats = augmentationStats.map((stats, i) => ({
    name: augmentations[i],
    price: ns.singularity.getAugmentationPrice(augmentations[i]),
    stats: stats.hacking,
  }));

  return augmentedStats.sort((a, b) => b.stats / b.price - a.stats / a.price);
}

export async function main(ns: NS) {
  const faction = <string>ns.args[0];
  const augs = await rankAugmentations(ns, faction);
  ns.tprint(augs ? augs.map((aug) => aug.name).join("\n") : "No augs found");
}
