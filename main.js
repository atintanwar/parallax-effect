import { fromEvent, animationFrameScheduler,of } from 'rxjs';
import { map, pluck, withLatestFrom,repeat, mergeScan,scan,tap,takeUntil, startWith, share, distinctUntilChanged, throttleTime, debounceTime } from 'rxjs/operators';


function lerp(start, end) {
    const dy = end - start;
    return start + dy * 0.05;
}
function getbounds(element) {
    return element.getBoundingClientRect()
}

const mainElement = document.getElementById('main');
const image = document.getElementById('image');


let initValue = getbounds(mainElement).y; 

let scroll$ = fromEvent(window,'scroll').pipe(
    map(() => getbounds(mainElement))
);

const animationFrame$ = of(0, animationFrameScheduler).pipe(
    repeat()
)

const moveOnScrolls$ = animationFrame$.pipe(
    withLatestFrom(scroll$),
    pluck(1,'y')
)

const interpolatedStream$ = moveOnScrolls$.pipe(
    startWith(initValue),
    scan(lerp)
)

interpolatedStream$.subscribe(posY => {
    let y =  400 - posY;
    image.style.cssText = `
          transform: translate(${0}px,${-y}px);
        `;
});