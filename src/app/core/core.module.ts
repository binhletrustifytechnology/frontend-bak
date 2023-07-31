import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {GlobalHttpInterceptor} from "./interceptors/GlobalHttpInterceptor";
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateParser} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateMessageFormatCompiler} from "ngx-translate-messageformat-compiler";
import {MarkerMapService} from "@core/services/marker-map.service";
import {PopUpService} from "@core/services/popup.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locale/locale.constant-', '.json');
}

@NgModule({
  providers: [
    MarkerMapService,
    PopUpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true
    }
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),

    // ngx-translate
    TranslateModule.forRoot({
      defaultLanguage: 'vn_VN',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      // compiler: {
      //   provide: TranslateCompiler,
      //   useClass: TranslateMessageFormatCompiler,
      // },
    })
  ],
  exports: []
})
export class CoreModule {
}
