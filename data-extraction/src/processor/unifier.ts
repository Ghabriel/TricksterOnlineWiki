import { MinedQuestData, Quest } from '../types/RawQuest';

export function unifyRawQuests(rawDataList: MinedQuestData[]): MinedQuestData {
    const npcImageUrlSet = new Set<string>();
    const mapImageUrlSet = new Set<string>();
    const quests: Quest[] = [];

    for (const rawData of rawDataList) {
        for (const url of rawData.npcImageUrls) {
            npcImageUrlSet.add(url);
        }

        for (const url of rawData.mapImageUrls) {
            mapImageUrlSet.add(url);
        }

        quests.push(...rawData.quests);
    }

    const npcImageUrls = [...npcImageUrlSet.values()];
    const mapImageUrls = [...mapImageUrlSet.values()];
    return { npcImageUrls, mapImageUrls, quests };
}
