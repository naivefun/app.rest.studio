import { Component, Input } from '@angular/core';

@Component({
    selector: 'spinner',
    template: `
        <div class="spinner" [style.width]="size + 'px'" [style.height]="size + 'px'"
             [style.margin]="margin">
            <div class="double-bounce1" [style.background-color]="color"></div>
            <div class="double-bounce2" [style.background-color]="color"></div>
        </div>
    `,
    styles: [ `
        .spinner {
            position: relative;
            margin: auto;
            display: inline-block;
        }

        .double-bounce1, .double-bounce2 {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            opacity: 0.6;
            position: absolute;
            top: 0;
            left: 0;

            -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
            animation: sk-bounce 2.0s infinite ease-in-out;
        }

        .double-bounce2 {
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
        }

        @-webkit-keyframes sk-bounce {
            0%, 100% {
                -webkit-transform: scale(0.0)
            }
            50% {
                -webkit-transform: scale(1.0)
            }
        }

        @keyframes sk-bounce {
            0%, 100% {
                transform: scale(0.0);
                -webkit-transform: scale(0.0);
            }
            50% {
                transform: scale(1.0);
                -webkit-transform: scale(1.0);
            }
        }
    ` ]
})
export class SpinnerComponent {
    @Input() public size: number = 24;
    @Input() public color: string = '#eee';
    @Input() public margin: string = 'auto auto';
}
