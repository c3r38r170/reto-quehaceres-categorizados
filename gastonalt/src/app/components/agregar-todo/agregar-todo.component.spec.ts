import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTodoComponent } from './agregar-todo.component';

describe('AgregarTodoComponent', () => {
  let component: AgregarTodoComponent;
  let fixture: ComponentFixture<AgregarTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
