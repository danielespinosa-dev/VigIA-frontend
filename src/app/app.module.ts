import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { RegistroComponent } from './components/registro/registro.component';
import { EstadoComponent } from './components/estado/estado.component';
import { InformeComponent } from './components/informe/informe.component';
import { HttpClientModule } from '@angular/common/http';
import { ParseRevisionesPipe } from './pipes/parse-revisiones.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    BienvenidaComponent,
    RegistroComponent,
    EstadoComponent,
    InformeComponent,
    ParseRevisionesPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }