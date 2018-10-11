import * as fs from 'fs';
import { MinedQuestData, Quest, QuestType } from '../types/RawQuest';
import { unifyRawQuests } from './unifier';

interface IndexTable {
    maps: Map<string, number>;
    quests: Map<string, number>;
}

export function processQuests(): void {
    const rawData = getUnifiedRawData();
    const indexTable = buildIndexTable(rawData.quests);
    fillIdentifiers(rawData.quests, indexTable);
    // console.log(rawData);
    // console.log(indexTable);
    save(rawData.quests);
}

function getUnifiedRawData(): MinedQuestData {
    const rawQuestJSON = fs.readFileSync('raw-data/quests.json').toString();
    const rawQuestData: MinedQuestData[] = JSON.parse(rawQuestJSON);
    return unifyRawQuests(rawQuestData);
}

function buildIndexTable(questList: Quest[]): IndexTable {
    const result: IndexTable = {
        maps: new Map(),
        quests: new Map()
    };

    for (const quest of questList) {
        if (!result.maps.has(quest.map)) {
            result.maps.set(quest.map, generateMapId());
        }

        result.quests.set(quest.title, generateQuestId());
    }

    return result;
}

let nextMapId: number = 1;
function generateMapId(): number {
    return nextMapId++;
}

let nextQuestId: number = 1;
function generateQuestId(): number {
    return nextQuestId++;
}

function fillIdentifiers(questList: Quest[], indexTable: IndexTable): void {
    for (const quest of questList) {
        quest.id = indexTable.quests.get(quest.title)!;
        quest.map = indexTable.maps.get(quest.map)! as unknown as string;

        if (quest.type === QuestType.Episode) {
            if (quest.nextEpisodeQuest) {
                if (!indexTable.quests.has(quest.nextEpisodeQuest)) {
                    throw Error(`"Next Episode Quest" not found: ${quest.nextEpisodeQuest}`);
                }

                quest.nextEpisodeQuest = indexTable.quests.get(quest.nextEpisodeQuest)! as unknown as string;
            }
        }
    }
}

function save(questList: Quest[]): void {
    const content = 'export const quests = ' + JSON.stringify(questList);
    fs.writeFile('../src/app/data/quests.ts', content, err => {
        if (err) {
            throw err;
        }
    });
}
