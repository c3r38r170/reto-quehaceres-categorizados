import { Component, Inject, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  categoria: string,
  color: any;
}

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.scss']
})
export class CrearCategoriaComponent implements OnInit {

  @ViewChild('botonGuardar') botonGuardar: ElementRef;
  public disabled = false;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  colorCtr = new FormControl(null);

  constructor(
    public dialogRef: MatDialogRef<CrearCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  @HostListener('window:keyup.Enter', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    if(this.data.categoria.length !== 0){
        this.dialogRef.close({'categoria': this.data.categoria,'color': this.colorCtr.value?.hex});
    }else{
      alert("Por favor, ingrese al menos un caractér");
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
