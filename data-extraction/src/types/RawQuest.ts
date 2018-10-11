export interface MinedQuestData {
    npcImageUrls: string[];
    mapImageUrls: string[];
    quests: Quest[];
}

export type Quest = StandardQuest | MonsterQuest | PartyQuest | EpisodeQuest;
export type StandardQuest = BaseQuest & StandardQuestExclusive;
export type MonsterQuest = BaseQuest & MonsterQuestExclusive;
export type PartyQuest = BaseQuest & PartyQuestExclusive;
export type EpisodeQuest = BaseQuest & EpisodeQuestExclusive;

export const enum QuestType {
    Standard,
    Monster,
    Party,
    Episode
}

export interface BaseQuest {
    id: number;
    title: string;
    npcCoordinates: {
        x: number;
        y: number;
    };
    npcName: string;
    map: string;
    condition: string;
    notes: string;
    type: QuestType;
}

export interface StandardQuestExclusive {
    type: QuestType.Standard;
    experience: {
        base: number;
        tm: number;
    };
    request: string;
    cycles: string;
    rewards: string[][];
}

export interface MonsterQuestExclusive {
    type: QuestType.Monster;
    experience: {
        base: number;
        tm: number;
    };
    targetMonster: string;
    targetMonsterLevel: number;
    targetMonsterAmount: number;
    timeLimit: number;
    foundAt: string;
    rewards: string[];
}

export interface PartyQuestExclusive {
    type: QuestType.Party;
    targetMonster: string;
    targetMonsterLevel: number;
    options: {
        partyMembers: number;
        targetMonsterAmount: number;
        timeLimit: number;
        rewards: string[];
    }[];
    foundAt: string;
}

export interface EpisodeQuestExclusive {
    type: QuestType.Episode;
    experience: {
        base: number;
        tm: number;
    };
    request: string;
    rewards: string;
    startedChapter?: QuestChapter;
    completedChapter?: QuestChapter;
    nextEpisodeQuest?: string;
}

export interface QuestChapter {
    episode: number;
    chapter: number;
    name: string;
}
