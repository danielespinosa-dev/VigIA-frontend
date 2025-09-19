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
    this.getSolicitudes();
    this.solicitudesFiltradas = this.solicitudes.filter(s => {
      const proveedorMatch = this.searchProveedor ? s.ProveedorNombre.toLowerCase().includes(this.searchProveedor.toLowerCase()) : true;
      const nitMatch = this.searchNIT ? s.ProveedorNIT.includes(this.searchNIT) : true;
      const fechaMatch = this.searchFecha ? s.FechaCreacion.startsWith(this.searchFecha) : true;
      return proveedorMatch && nitMatch && fechaMatch;
    });
  }

  imprimirReporte() {
    const contenido = document.getElementById('reporte-consolidado');
    if (!contenido) {
      alert('No se encontró el reporte para imprimir.');
      return;
    }
    const ventana = window.open('', '', 'height=900,width=1200');
    ventana!.document.write('<html><head><title>Reporte Consolidado</title>');
    ventana!.document.write('<style>body{font-family:Arial;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #333;padding:6px;} th{background:#ff007f;color:#fff;} td{background:#232323;color:#fff;} em{color:#ff007f;}</style>');
    ventana!.document.write('</head><body>');
    ventana!.document.write(contenido.innerHTML);
    ventana!.document.write('</body></html>');
    ventana!.document.close();
    // Espera a que la ventana termine de cargar antes de imprimir
    ventana!.focus();
    setTimeout(() => {
      ventana!.print();
    }, 400);
  }
}