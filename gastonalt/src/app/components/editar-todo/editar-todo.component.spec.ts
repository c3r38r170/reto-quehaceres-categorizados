import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTodoComponent } from './editar-todo.component';

describe('EditarTodoComponent', () => {
  let component: EditarTodoComponent;
  let fixture: ComponentFixture<EditarTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
