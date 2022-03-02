import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria';
import { Todo } from 'src/app/models/todo';
import { ListaComponent } from '../lista/lista.component';

@Component({
  selector: 'app-agregar-todo',
  templateUrl: './agregar-todo.component.html',
  styleUrls: ['./agregar-todo.component.scss']
})
export class AgregarTodoComponent implements OnInit {

  @Input() todoArray: Todo[];
  formTodo: FormGroup;
  todo: Todo;
  banderaT = true;

  arrayTest: Todo[] = [
    {
      id: 0,
      descripcion: 'La tarea 0',
      categoria: {id: 1, descripcion: 'Cosas del hogar', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 1,
      descripcion: 'Comprar leche',
      categoria: {id: 1, descripcion: 'Cosas del hogar', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 2,
      descripcion: 'Hacer gimnasia',
      categoria: {id: 0, descripcion: 'Sin categoria', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 3,
      descripcion: 'Visitar al cassius',
      categoria: {id: 0, descripcion: 'Sin categoria', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 4,
      descripcion: 'Programar en AMR',
      categoria: {id: 2, descripcion: 'Programacion', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 5,
      descripcion: 'Tirar unas liñitas ;) (...de codigo)',
      categoria: {id: 2, descripcion: 'Programacion', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 6,
      descripcion: 'Poner tildes a lo de arriba',
      categoria: {id: 2, descripcion: 'Programacion', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
    {
      id: 7,
      descripcion: 'Visitar al osito',
      categoria: {id: 1, descripcion: 'Cosas del hogar', borrada: false, color: '#eee'},
      borrado: false,
      check: false,
    },
  ]

  constructor(private fb: FormBuilder, private lc: ListaComponent) { }

  ngOnInit(): void {
    this.formTodo = this.fb.group({
      todoDescripcion: ['']
    });
  }

  agregarTodo(){
    let todoDescripcion = this.formTodo.controls['todoDescripcion'].value;
    if(this.formTodo.controls['todoDescripcion'].value !== null && this.formTodo.controls['todoDescripcion'].value){
      if(todoDescripcion === "t" && this.banderaT){
        this.arrayTest.forEach(element=>{
          this.todoArray.push(element);
        });
        this.banderaT = false;
      }else{
        this.todo = new Todo(this.todoArray.length,todoDescripcion,new Categoria(0, 'sin categoria'),false,false);
        this.todoArray.unshift(this.todo);
        //console.log(this.todoArray);
        //console.log(this.todoArray);
      }
    }else{
      alert("Ingresa texto");
    }
    this.formTodo.reset();
    todoDescripcion = "";
  }

  enter($event: any){
    if(this.formTodo.controls['todoDescripcion'].value !== null){
      $event.preventDefault(); this.agregarTodo();
    }
  }
}
