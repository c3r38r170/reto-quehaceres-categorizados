import { Categoria } from "./categoria"

export class Todo {
  public id: number;
  public descripcion: string;
  public categoria: Categoria;
  public borrado: boolean;
  public check: boolean;

  constructor(id: number, descripcion: string, categoria: Categoria, borrado: boolean, check: boolean){
    this.id = id;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.borrado = borrado;
    this.check = check;
  }
}
