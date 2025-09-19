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

  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  loading: boolean = false; // <--- NUEVA VARIABLE
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/vigia/solicitudes`)
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.solicitudes = data;
          this.solicitudesFiltradas = data;
        },
        error: (err) => {
          this.loading = false;
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
      return proveedorMatch && nitMatch;
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

  imprimirInformeCompleto() {
  const contenido = document.getElementById('modal-informe-completo');
  if (!contenido) {
    alert('No se encontró el informe para imprimir.');
    return;
  }
  const ventana = window.open('', '', 'height=900,width=1200');
  ventana!.document.write('<html><head><title>Informe Completo</title>');
  ventana!.document.write('<style>body{font-family:Montserrat,Arial,sans-serif;background:#232323;color:#fff;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #333;padding:6px;} th{background:#ff007f;color:#fff;} td{background:#232323;color:#fff;} em{color:#ff007f;} h2,h3{color:#ff007f;} .pregunta-box{background:#ff007f;color:#fff;padding:10px 14px;border-radius:7px;font-size:1.08em;font-weight:bold;margin-bottom:10px;} .analisis-box{background:#222;padding:10px 14px;border-radius:7px;display:flex;flex-direction:column;gap:6px;font-size:0.98em;color:#fff;border-left:4px solid #ff007f;} .respuesta-box{display:flex;gap:24px;align-items:center;background:#232323;padding:8px 14px;border-radius:7px;margin-bottom:10px;font-size:1em;color:#fff;} .puntaje-proveedor{background:#388e3c;color:#fff;padding:2px 10px;border-radius:6px;font-weight:bold;font-size:0.98em;} .badge{display:inline-block;padding:2px 10px;border-radius:8px;margin-right:6px;font-size:0.95em;background:#333;color:#fff;} .badge.ambiental{background:#388e3c;} .badge.social{background:#1976d2;} .badge.economica{background:#fbc02d;color:#232323;} </style>');
  ventana!.document.write('</head><body>');
  ventana!.document.write(contenido.innerHTML);
  ventana!.document.write('</body></html>');
  ventana!.document.close();
  ventana!.focus();
  setTimeout(() => {
    ventana!.print();
  }, 400);
}
}