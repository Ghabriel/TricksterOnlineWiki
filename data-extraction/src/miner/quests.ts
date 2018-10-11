import { EpisodeQuest, Quest, QuestType } from '../types/RawQuest';

declare global {
    interface Element {
        outerText: string;
    }
}

type RowList = HTMLCollectionOf<HTMLTableRowElement>;

function downloadQuests() {
    return JSON.stringify(searchQuests());
}

function searchQuests() {
    const divs = document.getElementsByTagName('div') as any as HTMLDivElement[];
    const quests: Quest[] = [];
    const npcImageUrlSet = new Set<string>();
    const mapImageUrlSet = new Set<string>();

    for (const div of divs) {
        if (!isQuestPrelude(div)) {
            continue;
        }

        const tableRows = getTableRows(div);
        npcImageUrlSet.add(getNpcImageUrl(tableRows));
        const mapElements = tableRows[0].cells[1].children[0].children;
        const mapImageUrl = (mapElements[0].children[0] as HTMLImageElement).src;
        mapImageUrlSet.add(mapImageUrl);
        const circleDivStyle = (mapElements[1] as HTMLDivElement).style;

        const notesContainer = cell(tableRows, 5, 0).children[0] as HTMLDivElement;

        const quest: EpisodeQuest = {
            id: 0,
            title: getQuestTitle(div),
            npcCoordinates: {
                x: parseInt(circleDivStyle.left!.replace('px', '')),
                y: parseInt(circleDivStyle.top!.replace('px', ''))
            },
            npcName: cellText(tableRows, 0, 2).replace('NPC: ', ''),
            map: cellText(tableRows, 0, 3).replace('Location: ', ''),
            condition: cellText(tableRows, 2, 1).replace('Condition: ', ''),
            notes: (notesContainer.style.display !== 'none')
                ? notesContainer.outerText.replace('Notes: ', '').trim()
                : '',
            type: QuestType.Episode,
            experience: {
                base: parseInt(cellText(tableRows, 1, 0).replace('Base Experience: ', '').replace(/,/g, '')),
                tm: parseInt(cellText(tableRows, 1, 1).replace('TM Experience: ', '').replace(/,/g, ''))
            },
            request: cellText(tableRows, 2, 0).replace('Request: ', ''),
            rewards: cellText(tableRows, 3, 0).replace('Reward: ', '')
        };

        parseEpisodeData(tableRows, quest);

        quests.push(quest);
    }

    const npcImageUrls = [...npcImageUrlSet.values()];
    const mapImageUrls = [...mapImageUrlSet.values()];
    return { npcImageUrls, mapImageUrls, quests };
}

function isQuestPrelude(div: HTMLDivElement): boolean {
    const prelude = '<div style="position:relative; width:775px;">';
    return div.outerHTML.substr(0, prelude.length) === prelude;
}

function getQuestTitle(div: HTMLDivElement): string {
    return div.outerText.substr(0, div.outerText.indexOf('\n'));
}

function getTableRows(div: HTMLDivElement): RowList {
    const table = div.nextElementSibling!.nextElementSibling as HTMLTableElement;
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

function parseEpisodeData(tableRows: RowList, quest: EpisodeQuest): void {
    const chapterStartRegex = /Episode ([0-9]+): Chapter ([0-9]+) - (.*?) has been started!/;
    const chapterCompletedRegex = /Episode ([0-9]+): Chapter ([0-9]+) - (.*?) has been completed!/;
    const episodeInfo = cell(tableRows, 4, 0).children as HTMLCollectionOf<HTMLTableCellElement>;

    if (episodeInfo[0].style.display !== 'none') {
        const chapterMatches = episodeInfo[0].outerText.match(chapterStartRegex);
        quest.startedChapter = {
            episode: parseInt(chapterMatches![1]),
            chapter: parseInt(chapterMatches![2]),
            name: chapterMatches![3]
        };
    }

    if (episodeInfo[1].style.display !== 'none') {
        const nextQuest = episodeInfo[1].outerText.replace('Next Quest in Episode: ', '').trim();
        quest.nextEpisodeQuest = nextQuest;
    }

    if (episodeInfo[2].style.display !== 'none') {
        const chapterMatches = episodeInfo[2].outerText.match(chapterCompletedRegex);
        quest.completedChapter = {
            episode: parseInt(chapterMatches![1]),
            chapter: parseInt(chapterMatches![2]),
            name: chapterMatches![3]
        };
    }
}

function enableConsole(): void {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    (window as any).console = iframe.contentWindow!.console;
}
