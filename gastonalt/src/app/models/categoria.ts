export class Categoria {
  id: number;
  descripcion: string;
  public borrada: boolean = false;
  public color: string;

  constructor(id: number, descripcion: string){
    this.id = id;
    this.descripcion = descripcion;
  }
}
