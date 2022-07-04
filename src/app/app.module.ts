import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NbThemeModule } from "@nebular/theme";
import { NEBULAR_ROOT, NEBULAR_ALL } from "./_define/nebular/nebular.module";
import { MatNativeDateModule } from "@angular/material/core";
import { MaterialExampleModule } from "./_define/material/material.module";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { AppComponent } from "./app.component";

import { GojsIvrComponent } from "./icr-flow/gojs-ivr/gojs-ivr.component";
import { IcrFlowComponent } from "./icr-flow/icr-flow.component";

const APP_ROUTES: Routes = [];

const firebaseConfig = {
    apiKey: "AIzaSyC_a3OMIIKDuC-dmY014JxmXXRvCo7Q9Qk",
    authDomain: "gojs-demo.firebaseapp.com",
    projectId: "gojs-demo",
    storageBucket: "gojs-demo.appspot.com",
    messagingSenderId: "873340482593",
    appId: "1:873340482593:web:6a2cff88dfeb5a74885f60",
};

@NgModule({
    imports: [
        MaterialExampleModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        NbThemeModule.forRoot({ name: "default" }),
        RouterModule.forRoot(APP_ROUTES),
        ...NEBULAR_ROOT,
        ...NEBULAR_ALL,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(firebaseConfig),
    ],
    declarations: [AppComponent, GojsIvrComponent, IcrFlowComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
