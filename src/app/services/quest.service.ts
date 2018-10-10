import { Injectable } from '@angular/core';
import { quests } from '../data/quests';
import { Quest } from '../types/Quest';

@Injectable({
    providedIn: 'root'
})
export class QuestService {
    getQuestById(id: number): Promise<Quest> {
        for (const quest of quests) {
            if (quest.id === id) {
                return Promise.resolve(quest);
            }
        }

        throw Error('Quest not found');
    }
}
