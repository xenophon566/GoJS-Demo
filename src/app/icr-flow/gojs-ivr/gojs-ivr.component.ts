import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { GuidedDraggingTool } from "./GuidedDraggingTool";

import * as go from "gojs";

@Component({
    selector: "demo-gojs-ivr",
    templateUrl: "./gojs-ivr.component.html",
    styleUrls: ["./gojs-ivr.component.scss"],
})
export class GojsIvrComponent implements OnInit {
    diagram: go.Diagram = new go.Diagram();

    @ViewChild("diagramDiv") diagramRef: ElementRef<HTMLDivElement>;

    @Input() get model(): go.Model {
        return this.diagram.model;
    }
    set model(val: go.Model) {
        this.diagram.model = val;
    }

    @Output() nodeSelected = new EventEmitter<go.Node | null>();

    @Output() modelChanged = new EventEmitter<go.ChangedEvent>();

    constructor() {
        const $ = go.GraphObject.make;
        this.diagram = new go.Diagram();
        this.diagram.initialContentAlignment = go.Spot.Left;
        this.diagram.allowDrop = true;
        this.diagram.toolManager.draggingTool = new GuidedDraggingTool();

        const actionTemplate = $(
            go.Panel,
            "Horizontal",
            { margin: new go.Margin(0, 0, 4, 0) },
            $(
                go.Shape,
                { width: 12, height: 12, margin: new go.Margin(0, 4, 0, 0) },
                new go.Binding("figure"),
                new go.Binding("fill")
            ),
            $(
                go.TextBlock,
                { font: "12px Verdana, sans-serif", overflow: go.TextBlock.OverflowEllipsis, width: 200, maxLines: 1 },
                new go.Binding("text")
            )
        );

        const tooltiptemplate = $(
            "ToolTip",
            { "Border.fill": "whitesmoke" },
            $(
                go.TextBlock,
                {
                    font: "bold 12px Helvetica",
                    wrap: go.TextBlock.WrapFit,
                    margin: 16,
                },
                new go.Binding("text", "description")
            )
        );

        this.diagram = $(go.Diagram, {
            allowCopy: false,
            "draggingTool.dragsTree": true,
            "commandHandler.deletesTree": true,
            "undoManager.isEnabled": true,
            layout: $(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementFixedRoots }),
        });

        this.diagram.nodeTemplate = $(
            go.Node,
            "Vertical",
            { toolTip: tooltiptemplate },
            new go.Binding("isTreeExpanded").makeTwoWay(), // remember the expansion state for
            new go.Binding("wasTreeExpanded").makeTwoWay(), // when the model is re-loaded
            { selectionObjectName: "BODY" },
            $(
                go.Panel,
                "Auto",
                { name: "BODY", width: 240 },
                $(
                    go.Shape,
                    "RoundedRectangle",
                    { strokeWidth: 3, stroke: "#72778133" },
                    new go.Binding("fill", "color")
                ),
                $(
                    go.Panel,
                    "Vertical",
                    { margin: new go.Margin(8, 0) },
                    $(
                        go.TextBlock,
                        {
                            alignment: go.Spot.Left,
                            stretch: go.GraphObject.Horizontal,
                            font: "bold 12px Verdana, sans-serif",
                        },
                        new go.Binding("text", "question")
                    ),
                    $(
                        go.Panel,
                        "Vertical",
                        { stretch: go.GraphObject.Horizontal, visible: false },
                        new go.Binding("visible", "actions", (acts) => Array.isArray(acts) && acts.length > 0),
                        $(
                            go.Panel,
                            "Table",
                            { stretch: go.GraphObject.Horizontal },
                            $(go.TextBlock, new go.Binding("text", "channel"), {
                                alignment: go.Spot.Left,
                                font: "12px Verdana, sans-serif",
                                overflow: go.TextBlock.OverflowEllipsis,
                                width: 200,
                                maxLines: 1,
                            }),
                            $("PanelExpanderButton", "COLLAPSIBLE", { column: 1, alignment: go.Spot.Right })
                        ),
                        $(
                            go.Panel,
                            "Vertical",
                            {
                                name: "COLLAPSIBLE",
                                width: 212,
                                margin: new go.Margin(4, 0, 0, 0),
                                stretch: go.GraphObject.Fill,
                                defaultAlignment: go.Spot.Left,
                                itemTemplate: actionTemplate,
                            },
                            new go.Binding("itemArray", "actions")
                        )
                    )
                )
            ),
            $(
                go.Panel, // this is underneath the "BODY"
                { height: 17 }, // always this height, even if the TreeExpanderButton is not visible
                $("TreeExpanderButton")
            )
        );

        this.diagram.linkTemplate = $(
            go.Link,
            go.Link.Orthogonal,
            new go.Binding("routing"),
            new go.Binding("corner"),
            new go.Binding("curve"),
            $(go.Shape, new go.Binding("strokeWidth", "thick"), new go.Binding("stroke", "color")),
            $(go.Shape, { toArrow: "Standard" }),
            $(
                go.TextBlock,
                go.Link.OrientUpright,
                {
                    background: "white",
                    visible: false,
                    segmentIndex: -2,
                    segmentOrientation: go.Link.None,
                },
                new go.Binding("text", "answer"),
                new go.Binding("visible", "answer", (a) => (a ? true : false))
            )
        );

        this.diagram.addDiagramListener("ChangedSelection", (e) => {
            const node = e.diagram.selection.first();
            this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });

        this.diagram.addModelChangedListener((e) => e.isTransactionFinished && this.modelChanged.emit(e));
    }

    ngOnInit() {}

    ngAfterViewInit() {
        this.diagram.div = this.diagramRef.nativeElement;
    }
}
