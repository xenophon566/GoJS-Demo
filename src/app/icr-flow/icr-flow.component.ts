import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { GLOBAL } from "../_core/services//global.service";
import { AngularFireDatabase } from "@angular/fire/compat/database";

import * as go from "gojs";

@Component({
    selector: "demo-icr-flow",
    templateUrl: "./icr-flow.component.html",
    styleUrls: ["./icr-flow.component.scss"],
})
export class IcrFlowComponent implements OnInit {
    constructor(private db: AngularFireDatabase, private changeDetectorRef: ChangeDetectorRef) {}

    channelName = GLOBAL.CHANNEL_NAME;

    gojsModel = null;

    gojsIVRModel = null;

    nodePalette = {
        start: "#31a33169",
        genernal: "#5cbdd97a",
        end: "#d9534f82",
    };

    moduleTypePalette = {
        default: "#198754",
        activity: "#ffc107",
    };

    connectionPalette = {
        card: "#a18c0182",
        media_card: "#ff000182",
        qa_reply: "#69a6c663",
    };

    answerType = {
        card: "卡片",
        media_card: "多媒體卡片",
        qa_reply: "快速回覆",
    };

    moduleType = {
        default: "常態",
        activity: "活動",
    };

    questions = [];

    questionId = null;

    questionChannel = "web";

    questionEvents = "default";

    questionTitle = "";

    isResultExist = false;

    nodePaletteArr = [];

    moduleTypePaletteArr = [];

    connectionPaletteArr = [];

    messages: any[] = null;

    getDraw(id, channel = "web", events = "") {
        this.questionId = id;
        this.questionChannel = channel;
        this.questionEvents = events || this.questionEvents || "default";
        for (const question of this.questions) {
            if (question.qId === id) this.questionTitle = question.qTitle;
        }

        this.questionTitle = "系統消息_建議問提示語";

        this.drawGojsIVR(id);
    }

    getLegend() {
        this.nodePaletteArr = Object.keys(this.nodePalette).map((key) => {
            return { key, value: this.nodePalette[key] };
        });

        this.moduleTypePaletteArr = Object.keys(this.moduleTypePalette).map((key) => {
            return { key, value: this.moduleTypePalette[key] };
        });

        this.connectionPaletteArr = Object.keys(this.connectionPalette).map((key) => {
            return { key, value: this.connectionPalette[key] };
        });
    }

    async drawGojsIVR(id = "") {
        if (!id) return;

        this.db
            .list(id)
            .valueChanges()
            .subscribe((r) => {
                this.messages = r;

                this.isResultExist = !!this.messages[0].length;

                const nodeArr = this.messages[1] || null;
                const connectionArr = this.messages[0] || null;
                if (!nodeArr || !connectionArr) return;

                for (const node of nodeArr) {
                    const questionPartsArr = node.question.match(/.{1,18}/g);
                    const moduleType = node["FModuleType"].toLowerCase();
                    node.question = questionPartsArr.join("\n").substr(0, 36);
                    // node.question = node.key + node.question;
                    if (node.question.length === 36) node.question += "...";
                    node["color"] = this.nodePalette[node["FNodeType"]];
                    node["channel"] = this.channelName[node.FChannel];
                    node["actions"] = [
                        { fill: this.moduleTypePalette[moduleType], text: this.moduleType[moduleType] },
                        {
                            fill: this.connectionPalette[node["FAnswerType"]],
                            text: this.answerType[node["FAnswerType"]],
                        },
                    ];
                }

                this.getLegend();

                const connectArr = [];
                for (const connect of connectionArr) {
                    connectArr.push({
                        from: connect.from,
                        to: connect.to,
                        thick: 2.5,
                        color: this.connectionPalette[connect.ffaType],
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 10,
                    });
                }

                this.gojsIVRModel = new go.GraphLinksModel({
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: nodeArr,
                    linkDataArray: connectArr,
                });

                this.changeDetectorRef.detectChanges();
            });
    }

    async ngOnInit(): Promise<void> {
        this.getDraw("22E8i_T_-C1~180eeb80-1bd0-009a-3f4a-00155dae811f");
    }
}
