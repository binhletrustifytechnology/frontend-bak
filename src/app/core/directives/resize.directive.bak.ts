// import {Directive, ElementRef, HostListener, Input} from "@angular/core";
//
// @Directive({
//   selector: '[appResize]'
// })
// export class ResizeDirectiveBak {
//
//   @Input('upResize') upElement: HTMLElement;
//   @Input('downResize') downElement: HTMLElement;
//
//   grabber: boolean = false;
//   height: number;
//
//   constructor(private el: ElementRef<HTMLElement>) {
//   }
//
//   @HostListener('window:resize', ['$event']) onResize(event) {
//     this.height = event.target.outerHeight;
//     console.log(this.height)
//   }
//
//   @HostListener('mousedown') onMouseDown() {
//     this.grabber = true;
//     this.el.nativeElement.classList.add('side-panel');
//     document.body.style.cursor = 'n-resize';
//   }
//
//   @HostListener('window:mouseup') onMouseUp() {
//     this.grabber = false;
//     this.el.nativeElement.classList.remove('side-panel');
//     document.body.style.cursor = 'default';
//   }
//
//   @HostListener('window:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
//     if (this.grabber) {
//       event.preventDefault();
//       if (event.movementY > 0) {
//         this.downElement.style.flex = `0 5 ${(this.height) - event.clientY + 100}px`;
//         // this.upElement.style.flex = `1 5 ${event.clientY - 16}px`;
//       } else {
//         this.upElement.style.flex = `0 5 ${event.clientY - 16}px`;
//         // this.downElement.style.flex = `1 5 ${(this.height) - event.clientY + 100}px`;
//       }
//     }
//   }
// }
