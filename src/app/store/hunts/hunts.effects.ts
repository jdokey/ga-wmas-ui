import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { HuntService } from '@services';
import { Store } from '@ngrx/store';
import { withLatestFrom, map, switchMap, catchError, of, tap, debounceTime, exhaustMap } from 'rxjs';
import { selectAllHuntsLength, selectFilter } from './hunts.selectors';
import { AppStateInterface } from '@store-model';
import { Filter } from '@model';
import * as huntsActions from './hunts.actions';

@Injectable()
export class HuntEffects {

  constructor(
    private readonly _actions$: Actions,
    private readonly _huntService: HuntService,
    private _store: Store<AppStateInterface>) { }

  private noFiltersApplied(filter: Filter): boolean {
    if (!filter) return true;
    // Ignore the 'skip' property
    const { skip, ...rest } = filter;
    // Test if 'successRate' has a value
    const successRateHasValue = rest.successRate !== undefined && rest.successRate !== null;
    // Test if any of the array properties are not empty
    const arraysNotEmpty = Object.values(rest).some(prop => Array.isArray(prop) && prop.length > 0);
    return successRateHasValue && !arraysNotEmpty;
  }

  getInitialHunts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(huntsActions.getInitialHunts, huntsActions.filtersChanged),
      withLatestFrom(this._store.select(selectFilter)),
      map((value) => value[0].filter as Filter),
      exhaustMap((filter) =>
        this._huntService.getHunts(filter).pipe(
          map((result) => {
            return huntsActions.getHuntsComplete({ hunts: result })
          }),
          catchError((error) =>
            of(huntsActions.huntsError({ error: error }))
          )
        )
      )
    )
  );

  getMoreHunts$ = createEffect(() =>
    this._actions$.pipe(
      debounceTime(1000), // Remove before deploying ...
      ofType(huntsActions.getMoreHunts),
      concatLatestFrom(() => [
        this._store.select(selectAllHuntsLength),
        this._store.select(selectFilter)
      ]),
      switchMap(([action, skip, filter]) =>
        this._huntService.getHunts(
          {
            skip,
            pageSize: filter?.pageSize,
            wmas: filter?.wmas,
            seasons: filter?.seasons,
            weapons: filter?.weapons,
            successRate: filter?.successRate
          } as Filter)
          .pipe(
            map((result) => huntsActions.getMoreHuntsComplete({ hunts: result }))
          )
      )
    )
  );

  error$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(huntsActions.huntsError),
        tap((error) => console.error(error.error))
      ),
    { dispatch: false }
  );

}
