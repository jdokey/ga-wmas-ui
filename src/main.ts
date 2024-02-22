import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routes } from 'app.routes';
import { HuntEffects } from 'store/hunts/hunts.effects';
import { SHARED_MODULES } from '@shared-imports';
import { NgIconsModule } from '@ng-icons/core';
import { heroTableCells, heroUsers, heroBarsArrowUp,
  heroArrowTrendingUp, heroStar, heroAdjustmentsHorizontal,
  heroXMark, heroBolt, heroMapPin, heroCalendar, heroWrenchScrewdriver,
  heroChartPie, heroSun, heroMoon, heroArrowDown, heroArrowUp,
  heroInformationCircle, heroNoSymbol, heroFaceFrown, heroBars3,
  heroChatBubbleBottomCenterText, heroDocumentText, heroCheckCircle,
  heroPencilSquare, heroClock, heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { heroCheckCircleSolid, heroXCircleSolid, heroExclamationTriangleSolid } from '@ng-icons/heroicons/solid';
import { AppStateInterface } from '_shared/model/store';
import { huntsReducers } from './app/store/hunts/hunts.reducers';
import { filterAuxDataReducers } from './app/store/filters/filters.reducers';
import { FiltersEffects } from 'store/filters/filters.effects';
import { adminReducers } from 'store/admin/admin.reducers';
import { AdminEffects } from 'store/admin/admin.effects';

const heroIcons = {
  heroTableCells,
  heroUsers,
  heroBarsArrowUp,
  heroArrowTrendingUp,
  heroStar,
  heroAdjustmentsHorizontal,
  heroXMark,
  heroBolt,
  heroMapPin,
  heroCalendar,
  heroWrenchScrewdriver,
  heroChartPie,
  heroSun,
  heroMoon,
  heroArrowDown,
  heroArrowUp,
  heroInformationCircle,
  heroNoSymbol,
  heroFaceFrown,
  heroBars3,
  heroChatBubbleBottomCenterText,
  heroDocumentText,
  heroCheckCircle,
  heroCheckCircleSolid,
  heroPencilSquare,
  heroClock,
  heroXCircleSolid,
  heroExclamationTriangleSolid,
  heroExclamationTriangle
};

const appReducers: ActionReducerMap<AppStateInterface> = {
  huntState: huntsReducers,
  filterAuxDataState: filterAuxDataReducers,
  adminState: adminReducers
};

export const appConfig: ApplicationConfig = {
  providers: [
    SHARED_MODULES,
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes),
      StoreModule.forRoot(appReducers),
      EffectsModule.forRoot([HuntEffects, FiltersEffects, AdminEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
      NgIconsModule.withIcons(heroIcons),
    )
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

