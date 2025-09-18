import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // Importa el environment

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent {
  searchProveedor: string = '';
  searchNIT: string = '';
  searchFecha: string = '';

  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes(): void {
    this.http.get<any[]>(`${environment.apiUrl}/vigia/solicitudes`)
      .subscribe({
        next: (data) => {
          this.solicitudes = data;
          this.solicitudesFiltradas = data;
        },
        error: (err) => {
          console.error('Error al obtener solicitudes', err);
        }
      });
  }

  // ...existing code...
informeVisible: boolean = false;
informeData: any = null;
informeTab: string = 'resumen';

verInforme(id: string) {
  this.http.get<any>(`${environment.apiUrl}/vigia/solicitud/${id}`)
    .subscribe({
      next: (data) => {
        this.informeData = data;
        this.informeTab = 'resumen';
        this.informeVisible = true;
      },
      error: (err) => {
        alert('Error al consultar el informe');
        console.error('Error al consultar informe', err);
      }
    });
}

cerrarInforme() {
  this.informeVisible = false;
  this.informeData = null;
}
// ...existing code...

  eliminarSolicitud(id: string): void {
  if (!confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
  this.http.delete(`${environment.apiUrl}/vigia/solicitud/${id}`)
    .subscribe({
      next: () => {
        this.solicitudes = this.solicitudes.filter(s => s.SolicitudID !== id);
      },
      error: (err) => {
        alert('Error al eliminar la solicitud');
        console.error('Error al eliminar', err);
      }
    });
  }
  
  searchSolicitudes() {
    this.solicitudesFiltradas = this.solicitudes.filter(s => {
      const proveedorMatch = this.searchProveedor ? s.ProveedorNombre.toLowerCase().includes(this.searchProveedor.toLowerCase()) : true;
      const nitMatch = this.searchNIT ? s.ProveedorNIT.includes(this.searchNIT) : true;
      const fechaMatch = this.searchFecha ? s.FechaCreacion.startsWith(this.searchFecha) : true;
      return proveedorMatch && nitMatch && fechaMatch;
    });
  }
}