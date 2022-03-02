import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  categoria: string
}

@Component({
  selector: 'app-editar-todo',
  templateUrl: './editar-todo.component.html',
  styleUrls: ['./editar-todo.component.scss']
})
export class EditarTodoComponent implements OnInit {
  
  @ViewChild('botonGuardar') botonGuardar: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<EditarTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  @HostListener('window:keyup.Enter', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    if(this.data.categoria.length !== 0){
      this.dialogRef.close(this.data.categoria);
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
