import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from "@angular/core";

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective {

  @Input('upResize') upElement: HTMLElement;
  @Input('downResize') downElement: HTMLElement;

  height: number;

  @Output() widthChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private el: ElementRef) {
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.height = event.target.outerHeight;
    console.log(this.height)
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    // Check if the event originated from the map element or its children
    // const isMapElement = this.el.nativeElement.contains(event.target);
    const isMapElement = this.isDescendantOf(event.target, this.el.nativeElement.querySelector('#map'));
    console.log('isMapElement', isMapElement)
    if (isMapElement) return;

    // this.el.nativeElement.classList.add('side-panel');
    // document.body.style.cursor = 'n-resize';
    event.preventDefault(); // Prevent text selection during resizing
    const startY = event.clientY;
    const startHeight = this.el.nativeElement.clientHeight;
    const handleResize = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight + deltaY;
      this.el.nativeElement.style.height = `${newHeight}px`;
      // Emit the new width value to the container component
      this.widthChange.emit(newHeight);
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mouseup', stopResize);
    document.addEventListener('mousemove', handleResize);
  }

  @HostListener('window:mousedown')
  onMouseDownn() {
    // console.log('mousedown');
    // this.el.nativeElement.classList.remove('side-panel');
    // document.body.style.cursor = 'default';
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    // console.log('mouseup');
    // this.el.nativeElement.classList.remove('side-panel');
    // document.body.style.cursor = 'default';
  }

  // @HostListener('window:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   console.log('mousemove')
  //   this.el.nativeElement.classList.add('side-panel');
  //   document.body.style.cursor = 'n-resize';
  //
  //   event.preventDefault();
  //
  //   const startY = event.clientY;
  //   const startHeight = this.el.nativeElement.clientHeight;
  //
  //   const handleResize = (e: MouseEvent) => {
  //     const deltaY = e.clientY - startY;
  //     const newHeight = startHeight + deltaY;
  //     this.el.nativeElement.style.height = `${newHeight}px`;
  //
  //     this.widthChange.emit(newHeight);
  //   };
  // }

  private isDescendantOf(element: any, ancestor: any): boolean {
    let currentElement = element;
    while (currentElement) {
      if (currentElement === ancestor) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }
}
