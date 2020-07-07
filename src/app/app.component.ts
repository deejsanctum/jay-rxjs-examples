import { Component, OnDestroy } from "@angular/core";
import { interval, race, combineLatest, Subscription, Subject, timer, merge, of } from "rxjs";
import { map, buffer, takeUntil, scan, tap, distinctUntilChanged, every } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnDestroy {
  title = "RxJS Example 1";
  results: string[] = [];
  showImage = false;

  releaseBuffer: Subject<any> = new Subject();
  stopBuffer: Subject<any> = new Subject();
  stopScan: Subject<any> = new Subject();

  sub = new Subscription();

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  dumbTest() {
    this.results.push("DUH!");
  }

  testScan() {
    this.sub = interval(1000)
      .pipe(
        takeUntil(this.stopScan),
        scan((acc, val) => acc + val)
      )
      .subscribe(value => this.results.push("" + value));
  }

  testRace() {
    const $event1 = interval(1000).pipe(map(i => "Ruben"));
    const $event2 = interval(1500).pipe(map(i => "João"));
    const $event3 = interval(2000).pipe(map(i => "Filipe"));
    const $event4 = interval(3000).pipe(map(i => "Luis"));

    this.sub = race($event1, $event2, $event3, $event4)
      .pipe(takeUntil(this.tellPeopleToStop()))
      .subscribe(i => this.results.push(i + " WON!!"));
  }

  testMerge() {
    const $event1 = timer(2000, 1000).pipe(
      tap(() => console.log("Ruben sent something!")),
      map(i => "Ruben")
    );
    const $event2 = timer(1500, 1000).pipe(
      tap(() => console.log("João sent something!")),
      map(i => "João")
    );
    const $event3 = timer(1000, 1000).pipe(
      tap(() => console.log("Filipe sent something!")),
      map(i => "Filipe")
    );
    const $event4 = timer(3000, 1000).pipe(
      tap(() => console.log("Luís sent something!")),
      map(i => "Luis")
    );

    this.sub = merge($event1, $event2, $event3, $event4)
      .pipe(takeUntil(this.tellPeopleToStop()))
      .subscribe(arr => {
        console.log("======== YOU GOT MAIL!!");
        this.results.push("" + arr);
      });
  }

  testCombineLatest() {
    const $event1 = timer(2000, 1000).pipe(
      tap(() => console.log("Ruben sent something!")),
      map(i => "Ruben")
    );
    const $event2 = timer(1500, 1000).pipe(
      tap(() => console.log("João sent something!")),
      map(i => "João")
    );
    const $event3 = timer(1000, 1000).pipe(
      tap(() => console.log("Filipe sent something!")),
      map(i => "Filipe")
    );
    const $event4 = timer(3000, 1000).pipe(
      tap(() => console.log("Luís sent something!")),
      map(i => "Luis")
    );

    this.sub = combineLatest([$event1, $event2, $event3, $event4])
      .pipe(takeUntil(this.tellPeopleToStop()))
      .subscribe(arr => {
        console.log("======== YOU GOT MAIL!!");
        this.results.push("" + arr);
      });
  }

  testBuffer() {
    const $event1 = timer(2000, 1000).pipe(
      tap(() => console.log("Ruben sent something!")),
      map(i => "Ruben")
    );
    const $event2 = timer(1500, 1000).pipe(
      tap(() => console.log("João sent something!")),
      map(i => "João")
    );
    const $event3 = timer(1000, 1000).pipe(
      tap(() => console.log("Filipe sent something!")),
      map(i => "Filipe")
    );
    const $event4 = timer(3000, 1000).pipe(
      tap(() => console.log("Luís sent something!")),
      map(i => "Luis")
    );
    this.sub = merge($event1, $event2, $event3, $event4)
      .pipe(
        takeUntil(this.stopBuffer),
        buffer(this.releaseBuffer)
      )
      .subscribe(i => {
        console.log("======== YOU GOT MAIL!!");
        this.results.push("" + i);
      });
  }

  clear() {
    this.results = [];
    if (this.sub && !this.sub.closed) {
      console.log("sub is not closed");
      this.sub.unsubscribe();
    }
  }

  finish() {
    this.showImage = true;
  }

  tellPeopleToStop() {
    return timer(20000).pipe(
      tap(() => console.log("OKAY, STOP SENDING STUFF!"))
    );
  }
}
