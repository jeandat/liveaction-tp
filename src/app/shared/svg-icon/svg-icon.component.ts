import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector:'la-svg-icon',
    templateUrl:'./svg-icon.component.html',
    styleUrls:[ './svg-icon.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent {
    @Input() icon:string;
}
