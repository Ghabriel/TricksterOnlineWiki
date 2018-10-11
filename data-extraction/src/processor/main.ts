import * as fs from 'fs';
import { unifyRawQuests } from './unifier';

function main(): void {
    const rawQuestJSON = fs.readFileSync('raw-data/quests.json').toString();
    const rawQuestData = JSON.parse(rawQuestJSON);
    const unifiedRawQuestData = unifyRawQuests(rawQuestData);
    console.log(unifiedRawQuestData);
}

main();
