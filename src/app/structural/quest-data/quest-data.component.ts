import { Component, Input, OnInit } from '@angular/core';
import { QuestService } from 'src/app/services/quest.service';
import { Quest, QuestType } from 'src/app/types/Quest';

@Component({
    selector: 'app-quest-data',
    templateUrl: './quest-data.component.html',
    styleUrls: ['./quest-data.component.scss']
})
export class QuestDataComponent implements OnInit {
    /**
     * The ID of the quest to be viewed.
     */
    @Input() id: number;

    readonly QuestType = QuestType;

    quest: Quest | null = null;

    constructor(private questService: QuestService) { }

    ngOnInit() {
        this.questService.getQuestById(this.id).then(quest => {
            this.quest = quest;
        });
    }

}
