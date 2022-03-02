import { Component, OnInit, HostListener } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { MatDialog } from '@angular/material/dialog';
import { AcercaDeComponent } from '../../acerca-de/acerca-de.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  
  todos : Todo[] = [];
  hintClass = true;
  mobile = false;

  constructor(public dialog: MatDialog){}

  @HostListener('document:keydown', ['$event'])
  keypress(e: KeyboardEvent) {
    this.hintClass = false;
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    //console.log(event.target.innerWidth);
    if(event.target.innerWidth < 1169){
      this.mobile = true;
    }else{
      this.mobile = false;
    }
  }

  acercaDe(){
    const dialogRef = this.dialog.open(AcercaDeComponent, {
      width: '50%',
      data: {},
    });
  }

  abrirGithub(){
    window.open('https://github.com/gastonalt', '_blank')
  }

  ngOnInit(): void {
    if(window.innerWidth < 1169){
      this.mobile = true;
    }
  }

}
