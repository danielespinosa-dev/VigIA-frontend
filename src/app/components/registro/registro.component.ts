import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  codigo: string = '';
  nit: string = '';
  proveedor: string = '';
  excelFile: File | null = null;
  anexos: File[] = [];
  selectedFiles: File[] = [];
  modalVisible: boolean = false;
  modalMessage: string = '';

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.excelFile = input.files[0];
    }
  }

  handleAnexosInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.anexos = Array.from(input.files);
    }
  }

 constructor(private http: HttpClient) {}

  submitForm(): void {
  const solicitud = {
    CodigoProyecto: this.codigo,
    ProveedorNombre: this.proveedor,
    ProveedorNIT: this.nit,
    FechaCreacion: new Date().toISOString(),
    EstadoGeneral: 'Pendiente',
    UsuarioSolicitante: 'user.hackathon',
    FuenteExcelPath: this.excelFile ? `archivos/${this.excelFile.name}` : '',
    StorageFolderPath: 'storage/solicitud1/',
    PuntajeConsolidado: 85.5,
    NivelGlobal: 'Alto',
    FechaFinalizacion: null,
    Estado: {
      economica: 'pending',
      social: 'pending',
      ambiental: 'pending'
    }
  };

  this.http.post<any>('http://127.0.0.1:8000/vigia/solicitud', solicitud)
    .subscribe({
      next: (response) => {
        this.modalMessage = `Solicitud creada exitosamente. ID: ${response.SolicitudID}`;
        this.modalVisible = true;
        this.limpiarFormulario();
      },
      error: (error) => {
        this.modalMessage = 'Error al crear la solicitud.';
        this.modalVisible = true;
      }
    });
}

limpiarFormulario(): void {
  this.codigo = '';
  this.nit = '';
  this.proveedor = '';
  this.excelFile = null;
  this.anexos = [];
  this.selectedFiles = [];
}

   onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      this.selectedFiles = Array.from(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    // Opcional: puedes agregar lógica para resaltar el dropzone
  }

  onDragLeave(): void {
    // Opcional: puedes agregar lógica para quitar el resaltado del dropzone
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.excelFile = input.files[0];
    }
  }

  onSubmit(): void {
    // Lógica para manejar el envío del formulario
    this.submitForm();
  }
}