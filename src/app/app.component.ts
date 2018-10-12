import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    questIds: number[] = [];

    ngOnInit() {
        for (let i = 1; i <= 36; i++) {
            this.questIds.push(i);
        }
    }
}
