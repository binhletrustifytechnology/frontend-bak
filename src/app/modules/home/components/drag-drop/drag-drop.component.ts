import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

/**
 * @title Drag&Drop with a handle
 */
@Component({
  selector: 'app-drag-drop',
  templateUrl: 'drag-drop.component.html',
  styleUrls: ['drag-drop.component.scss']
})
export class CdkDragDropHandleExample implements OnInit {

  @Input() toggle: boolean;
  @Input() data: any;
  @Input() radarsToPlot;

  @Output() toggleEvent = new EventEmitter<boolean>();

  ngOnInit(): void {
    console.log('--OnInit--');
  }

  onClickClose(): void {
    this.toggleEvent.emit(false);
  }

  constructor() {
  }
}
