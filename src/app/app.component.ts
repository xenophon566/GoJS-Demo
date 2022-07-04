import { Component, VERSION, ChangeDetectorRef } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Component({
    selector: "demo",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    constructor(private changeDetectorRef: ChangeDetectorRef, private db: AngularFireDatabase) {}

    id = "22E8i_T_-C1~180eeb80-1bd0-009a-3f4a-00155dae811f";

    name = "Angular " + VERSION.full;

    messages: any[] = null;

    nodes = "";

    connections = "";

    getMessages() {
        this.db
            .list(this.id)
            .valueChanges()
            .subscribe((r) => {
                this.messages = r;
                this.nodes = JSON.stringify(this.messages[1]);
                this.connections = JSON.stringify(this.messages[0]);
                this.changeDetectorRef.detectChanges();
            });
    }

    setMessages(nodes = null, connections = null) {
        if (!nodes || !connections) return;

        this.db.list(this.id).set("nodes", JSON.parse(nodes));
        this.db.list(this.id).set("connections", JSON.parse(connections));
    }

    ngOnInit() {}

    ngAfterViewInit() {
        this.getMessages();
    }
}
