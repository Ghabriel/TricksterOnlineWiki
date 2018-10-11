import * as fs from 'fs';

function main(): void {
    const rawQuestData = fs.readFileSync('../raw-data/quests.json');
    console.log(rawQuestData);
}

main();
