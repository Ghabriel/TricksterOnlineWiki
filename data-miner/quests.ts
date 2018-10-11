import { EpisodeQuest, Quest } from 'src/app/types/Quest';

declare global {
    interface Element {
        outerText: string;
    }
}

type RowList = HTMLCollectionOf<HTMLTableRowElement>;

function searchQuests() {
    const divs = document.getElementsByTagName('div') as any as HTMLDivElement[];
    const quests: Quest[] = [];
    const npcImageUrls: string[] = [];
    const mapImageUrls: string[] = [];

    for (const div of divs) {
        if (!isQuestPrelude(div)) {
            continue;
        }

        console.log('[FOUND PRELUDE]', div);

        const quest: Partial<EpisodeQuest> = {};
        quest.title = getQuestTitle(div);

        const tableRows = getTableRows(div);
        npcImageUrls.push(getNpcImageUrl(tableRows));
        const mapElements = tableRows[0].cells[1].children[0].children;
        const mapImageUrl = (mapElements[0].children[0] as HTMLImageElement).src;
        mapImageUrls.push(mapImageUrl);
        const circleDivStyle = (mapElements[1] as HTMLDivElement).style;
        quest.npcCoordinates = {
            x: parseInt(circleDivStyle.left.replace('px', '')),
            y: parseInt(circleDivStyle.top.replace('px', ''))
        };

        quest.npcName = cellText(tableRows, 0, 2).replace('NPC: ', '');
        quest.location = cellText(tableRows, 0, 3).replace('Location: ', '');
        quest.condition = cellText(tableRows, 2, 1).replace('Condition: ', '');
        const notesContainer = cell(tableRows, 5, 0).children[0] as HTMLDivElement;
        quest.notes = (notesContainer.style.display !== 'none')
            ? notesContainer.outerText
            : '';

        quest.experience = {
            base: parseInt(cellText(tableRows, 1, 0).replace('Base Experience: ', '').replace(/,/g, '')),
            tm: parseInt(cellText(tableRows, 1, 1).replace('TM Experience: ', '').replace(/,/g, ''))
        };

        console.log(quest);
        break;
    }
}

function isQuestPrelude(div: HTMLDivElement): boolean {
    const prelude = '<div style="position:relative; width:775px;">';
    console.log('[ATTEMPT]', div.outerHTML.substr(0, prelude.length));
    return div.outerHTML.substr(0, prelude.length) === prelude;
}

function getQuestTitle(div: HTMLDivElement): string {
    return div.outerText.substr(0, div.outerText.indexOf('\n'));
}

function getTableRows(div: HTMLDivElement): RowList {
    const table = div.nextElementSibling.nextElementSibling as HTMLTableElement;
    return table.rows;
}

function getNpcImageUrl(rows: RowList): string {
    return (rows[0].cells[0].children[0].children[0] as HTMLImageElement).src;
}

function cell(rows: RowList, rowIndex: number, cellIndex: number): HTMLElement {
    return rows[rowIndex].cells[cellIndex];
}

function cellText(rows: RowList, rowIndex: number, cellIndex: number): string {
    return cell(rows, rowIndex, cellIndex).outerText;
}
