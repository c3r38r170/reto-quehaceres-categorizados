import { Component, Input, OnChanges, OnInit, SimpleChanges, HostListener } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { Categoria } from '../../models/categoria';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CrearCategoriaComponent } from '../crear-categoria/crear-categoria.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditarTodoComponent } from '../editar-todo/editar-todo.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit, OnChanges {

  color: '#FFF';
  expandall=true;
  abierto = false;
  panelOpenState = false;
  cerrarHintCategorias = false;
  @Input() todoArray: Todo[];
  arrayAMostrar: Todo[];
  contador = 0;
  categoriaSelected: string = 'a';
  changeCategoria: string;
  numeroCategoriaSelected: number;
  colorAnterior= '#FFF';
  selected = 'option2';
  public categorias : Categoria[] = [
    {id: 0, descripcion: 'Sin categoria', borrada: false, color: '#FFFFFF'} /*,
    {id: -1, descripcion: 'Todas las categorias', borrada: false},
    {id: 1, descripcion: 'Cosas del hogar', borrada: false},
    {id: 2, descripcion: 'Programacion', borrada: false},
    {id: 3, descripcion: 'Otros', borrada: false} */
  ];

  categoria: string

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }

  ngOnInit(): void {
    // console.log(this.todoArray);
    this.arrayAMostrar = this.todoArray;
  }

  filtroChange($event: any){
      this.numeroCategoriaSelected = $event.value;
      if($event.value == 'a'){
        this.arrayAMostrar = this.todoArray;
      }else{
        // console.log($event.value)
        this.arrayAMostrar = this.todoArray.filter(todo => {
          return todo.categoria.id == $event.value;
        });
        // console.log(this.todoArray);
      }
  }

  borrarCategoria(id:number){
    let count = 0;
    let bandera = false;
    this.categorias.forEach(categoria=>{
      if(categoria.id !== id && !bandera){
        count++;
      }else{
        bandera = true;
      }
    });
    const categoriaBorrada = this.categorias[count];
    this.categorias.splice(count,1);
    // console.log('borrando la id:' + id)
    this.arrayAMostrar.forEach(todo=>{
      if(todo.categoria.id === id){
        todo.categoria = this.categorias[0];
      }
    })
    const snack = this._snackBar.open('Categoría eliminada!', 'deshacer',{
      duration: 3000
    });
    snack.onAction().subscribe(()=>{
      categoriaBorrada.id = this.categorias[this.categorias.length - 1].id + 1;
      this.categorias.push(categoriaBorrada);
      // console.log('te mando un saludo!!');
      // console.log(this.categorias);
    })
  }

  @HostListener('window:keyup.F2', ['$event'])
  onDialogClick(event: KeyboardEvent): void {
    this.agregarCategoria();
  }

  editarTodo(todo: Todo){
    const dialogRef = this.dialog.open(EditarTodoComponent, {
      width: '250px',
      data: {categoria: todo.descripcion},
    });
    // console.log(todo)
    // console.log(this.todoArray)
    // console.log(this.todoArray[this.todoArray.length - todo.id - 1])
    dialogRef.afterClosed().subscribe(todoInput => {
      if(todoInput !== undefined && todoInput !== ''){
        this.todoArray[this.todoArray.length - todo.id - 1]={
          'id': todo.id,
          'descripcion': todoInput,
          'categoria': todo.categoria,
          'borrado': todo.borrado,
          'check': todo.check
        }
      }
    });
  }

  editar(categoria: Categoria){
    const dialogRef = this.dialog.open(CrearCategoriaComponent, {
      width: '250px',
      data: {categoria: categoria.descripcion, color: categoria.color},
    });
    dialogRef.afterClosed().subscribe(categoriaInput => {
      console.log(categoriaInput)
      if(categoriaInput.categoria !== undefined && categoriaInput.categoria !== ''){
        this.categorias[categoria.id]={
          'id': categoria.id,
          'descripcion': categoriaInput.categoria,
          'borrada': false,
          'color':'#' + categoriaInput.color
        }
        this.arrayAMostrar.forEach(todo=>{
          if(todo.categoria.id === categoria.id){
            todo.categoria = {
              'id': categoria.id,
              'descripcion': categoria.descripcion,
              'borrada': false,
              'color':'#' +  categoriaInput.color
            }
          }
        })
      }
    });
  }


  agregarCategoria(){
      const dialogRef = this.dialog.open(CrearCategoriaComponent, {
        width: '250px',
        data: {categoria: '', color: '#FFF'},
      });

      dialogRef.afterClosed().subscribe(categoriaInput => {
        console.log(categoriaInput);
        // console.log(categoriaInput)
        if(categoriaInput !== undefined && categoriaInput !== '' && categoriaInput.categoria !== ''){
          let categoriaObj: Categoria;
          this.categoria = categoriaInput;
              categoriaObj = {
                'id' : this.categorias[this.categorias.length -1].id + 1,
                'descripcion' : categoriaInput.categoria || categoriaInput,
                'borrada' : false,
                'color': '#' + categoriaInput.color || this.colorAnterior
              }
              this.colorAnterior= '#' + categoriaInput.color || 'FFF';
          /*
          const categoria = new Categoria(this.categorias.length + 1, categoriaInput);
          categoria.borrada = false;
          */
          this.categorias.push(categoriaObj);
        }
      });
  }

  ordenarArray(){
      const checked = this.arrayAMostrar.filter(todo=>{
        return todo.check;
      })
      const nochecked = this.arrayAMostrar.filter(todo=>{
        return !todo.check;
      })
      this.arrayAMostrar = nochecked.concat(checked);
  }

  categoriaChange($event: any, todo: Todo){
    let count = 0;
    let bandera = false;
    this.categorias.forEach(categoria=>{
      if(categoria.id !== parseInt(this.changeCategoria) && !bandera){
        count++;
      }else{
        bandera = true;
      }
    });
    /*
    console.log('numero de categoria en el array:' + count);
    console.log(this.categorias[count]);
    console.log(this.categorias);
    */
    const index = this.todoArray.indexOf(todo);
    this.todoArray[index].categoria = this.categorias[count];
    /*
    console.log(this.arrayAMostrar);
    console.log(this.arrayAMostrar[index]);
    */
    if(this.categoriaSelected !== 'a' && this.categoriaSelected !== 'c'){
      this.arrayAMostrar = this.todoArray.filter(todox => {
        return todox.categoria.id === parseInt(this.categoriaSelected);
      });
    }
    this.changeCategoria = '';
  }

  changeTodo(todo: Todo){
    todo.check = !todo.check;
    if(todo.check){
      this.ordenarArray();
    }else{
      this.array_move(this.todoArray,this.todoArray.indexOf(todo), todo.id)
    }
  }

  array_move(arr: any, old_index: any, new_index: any) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };

  borrar(todo : Todo){
    //console.log(todo)
    todo.borrado = true;
    this.contador++;
    const snack = this._snackBar.open('Todo eliminado!', 'deshacer',{
      duration: 3000
    })
    snack.onAction().subscribe(()=>{
      todo.borrado = false;
      this.contador--;
    });
  }

}
