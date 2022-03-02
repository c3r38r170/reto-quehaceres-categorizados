// TODO PWA

// * Variables Globales

var catItems=gEt('cat-items')
var todo=gEt('todo')
var listaPrincipal=[];
var filtrablesIndexados={};
var categorias=[];
var moviendo=false;

var cancelarElemento=gEt('cancelar');
var cancelar=false;

var cargarInput=createElement('INPUT',{
	class:'hidden',
	type:'file',
	accept:'.json',//TODO enforce
	onchange:function(){
		var fr=new FileReader();
		fr.onload=()=>{
			for(let categoria of categorias){
				categoria.eliminar();
			}
			categorias=[];

			deserializarYCargar(fr.result);
			localStorage.setItem('datos',fr.result);

			Swal.fire({
				icon: 'success',
				title: 'Datos cargados',
				showConfirmButton: false,
				timer: 1500
			});
		}
		fr.readAsText(this.files[0]);

		this.remove()
	}
});

const REG_EXP={
	DIACRITICOS:/[\u0300-\u036f]/g
	,ESCAPES:/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
};
const PLACEHOLDERS={
	categoria:'<details></details>'
	,item:createElement('DIV',{
		class:'item'
		,children: [
			['INPUT',{
				type:'checkbox'
			}]
		]
		,style:{
			height:'2.5rem'
		}
	})
};
const HANDLE_CLASS='.cat-items-agarrar';
const ITEMS_DRAG_OPTIONS_ONEND=()=>{
	actualizarListaPrincipalYGuardar();
}
const ITEMS_DRAG_OPTIONS={
	handle:HANDLE_CLASS
	
	,group:{
		name:"todo"
		,pull:'clone'
		,put:'false'
	}
	,animation:150
	,onEnd:ITEMS_DRAG_OPTIONS_ONEND
	/*(e)=>{
		guardar();

		if(cancelar){
			e.item.remove();
			cancelar=false;
		}

		cancelarElemento.classList.remove('cancelar-mostrar');
	}*/
};

// * Clases

class Filtrable{
	id;
	descripcion;
	descripcionNormalizada;
	// TODO ver si es necesario en Item y si lo dejamos solo para Categoria
	elementoHTML;
	constructor(descripcion, elementoHTML,id){
		this.id=id||Date.now().toString(36) + Math.random().toString(36).substring(2);
		filtrablesIndexados[this.id]=this;
		
		this.setDescripcion(descripcion);

		this.elementoHTML=elementoHTML;
		this.elementoHTML.dataset.id=this.id;
	}

	setDescripcion(descripcion) {
		
		this.descripcion=descripcion;
		this.descripcionNormalizada=normalizarTexto(this.descripcion);
		
	}
}

class Categoria extends Filtrable{
	items=[];
	itemsIndexados={};
	colores={};

  constructor(descripcion,color,items,id){
		super(
			descripcion
			,createElement('DETAILS',
				{
					classList:['cat-item','filtrable']
					,style:{
						background:color
					}
					,children: [
						['SUMMARY',[
							'DIV'
							,{
								class:'cat-items-summary'
								,children: [
									['SPAN',{
										class:'texto-legible'
										,innerText:descripcion
										,contentEditable:true
									}]
									,[
										'DIV'
										,{
											class:'cat-items-summary-botones'
											,children: [
												[
													'BUTTON'
													,{
														classList:[
															'fas','fa-trash-can','cat-items-eliminar'
														]
													}
												]
												,[
													'SPAN'
													,{class:'cat-items-agarrar'}
												]
											]
										}
									]
								]
							}
						]]
						,['DIV',{class:'cat-items-lista-wraper',children:[
							['INPUT',{oninput:buscar}]
							,['BUTTON',{classList:['fas','fa-plus'],onclick:crearItem}]
							,['DIV',{class:'cat-items-lista'}]
						]}]
					]
				}
			)
			,id
		);
		catItems.prepend(this.elementoHTML);

		categorias.push(this);

		this.colores.propio=color;
		let tcColor=tinycolor(color);
		this.colores.items=tcColor[tcColor.isDark()?'lighten':'darken'](10).toHexString();

		// * Solo cuando se importa
		if(items){
			for (const item of items) {
				this.aniadirItem(...item);
			}
		}else guardar();

		new Sortable(SqS('.cat-items-lista',{from:this.elementoHTML}),ITEMS_DRAG_OPTIONS);
		
	}
	eliminar(){
		for (const itemID of this.items) {
			filtrablesIndexados[itemID].eliminar(false);
		}

		this.elementoHTML.remove();
		delete filtrablesIndexados[this.id];
		
		actualizarListaPrincipalYGuardar();
	}
	
	aniadirItem(descripcion,id,tildado){
		let newItem=new Item(descripcion,this.id,id,tildado);
		newItem.elementoHTML.style.background=this.colores.items;
		this.items.push(newItem.id);

		let container=SqS('.cat-items-lista',{from:this.elementoHTML})
		container.prepend(newItem.elementoHTML);
		
		if(!id)
			guardar();
	}
	quitarItem(id){
		this.items.splice(this.items.indexOf(id));
	}
}

class Item extends Filtrable{
	categoriaID;

	constructor(descripcion,categoriaID,id,checked=false){
		super(descripcion,createElement('DIV',{
			classList:['item','filtrable']
			,children: [
				[
					'INPUT',
					{
						type: 'checkbox'
						,checked
					}
				],
				// TODO dry?
				[
					'SPAN'
					,{
						innerText:descripcion
						,class:'texto-legible'
						,contentEditable:true
					}
				]
				,[
					'DIV'
					,{
						class:'item-botones'
						,children: [
							[
								'BUTTON'
								,{
									classList:[
										'fas','fa-trash-can','cat-items-eliminar'
									]
								}
							]
							,[
								'SPAN'
								,{class:'cat-items-agarrar'}
							]
						]
					}
				]
			]
		}),id);

		this.categoriaID=categoriaID;
	}
	
	eliminar(hayQueGuardar=true){
		
		for(let item of [...SqS(`[data-id="${this.id}"]`,{n:ALL})]){
			item.remove();
		}

		delete filtrablesIndexados[this.id];
		
		if(hayQueGuardar){
			filtrablesIndexados[this.categoriaID].quitarItem(this.id);
			actualizarListaPrincipalYGuardar();
		}
	}
	
	setDescripcion(descripcion,elementoEditado){
		super.setDescripcion(descripcion);
		if(elementoEditado){
			// TODO fix que si edito en la lista comun no anda
			let todosLosElementos=[...SqS(`[data-id="${this.id}"] .texto-legible`,{n:ALL})];
			todosLosElementos.splice(todosLosElementos.findIndex(el=>el==elementoEditado));
			for(let texto of todosLosElementos){
				texto.innerText=this.descripcion;
			}
		}
	}
}

// * Funciones
// TODO ordenar y categorizar

function normalizarTexto(texto){
	return texto.normalize("NFD").replace(REG_EXP.DIACRITICOS, "")
}

function buscar(){
	// * this es el input tipo texto.
	// * La estructura es: this + botón + contenedor de elementos a filtrar

	// ? ver los items al buscar por categoria

	let valor=this.value.trim()
		,accion;
	if(valor){
		valor=normalizarTexto(valor);
		let regExp;
		try{
			regExp=new RegExp('.*?'+valor+'.*?','i');
		}catch(e){
			// * Escapa el posible regexp inválido
			regExp=new RegExp(`.*?${valor.replace(REG_EXP.ESCAPES, "\\$&")}.*?`,'i');
		}
		accion=elemento=>{
			let filtrable=filtrablesIndexados[elemento.dataset.id];
			if(
				regExp.test(filtrable.descripcionNormalizada)
				==
				elemento.classList.contains('hidden')
			){
				elemento.classList.toggle('hidden');
			}
		};
	}else accion=elemento=>elemento.classList.remove('hidden');

	for(let filtrableElemento of [...this.nextElementSibling.nextElementSibling.children])
		accion(filtrableElemento);
}

// TODO allow enter

function crearItem(){
	let textField=this.previousElementSibling;
	let categoriaID=this.closest('details').dataset.id;
	Swal.fire({
		title: 'Nuevo item'
		,input:'text'
		,focusConfirm: false
		,showCancelButton: true
		,inputValue:textField.value
	})
		.then(({isConfirmed,value}) => {
			// TODO sanitize value
			if(isConfirmed) {
				textField.value='';
				textField.oninput();

				filtrablesIndexados[categoriaID].aniadirItem(value);

			}
		})
}

function clickPropio(){
	this.click();
	cancelarElemento.classList.toggle('cancelar-mostrar');
}

function descargar(){
	let enlace=addElement(D.body,['A',{
		download:'quehaceres-categorizados-'+new Date().toISOString().slice(0, 10)+'.json',
		class:'hidden',
		href:'data:application/json;base64,'+btoa(serializar())
	}]);
	enlace.click();
	enlace.remove();
}

function empezarCargaDeArchivo(){
	Swal.fire({
		title: 'Cuidado',
		text: "El archivo cargado va a reemplazar todo lo que está actualmente en la aplicación. ¿Desea proceder?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Sí',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			D.body.appendChild(cargarInput);
			cargarInput.click();
			D.body.removeChild(cargarInput);
		}
	})
}

function serializar() {
	return encodeURI(JSON.stringify({
		categorias:[...catItems.children].map(el=>{
			let cat=filtrablesIndexados[el.dataset.id]
			return [
				cat.descripcion
				,cat.colores.propio
				,[...SqS('.cat-items-lista',{from:el}).children].map(itemEl=>{
					let itemID=itemEl.dataset.id;
					return [filtrablesIndexados[itemID].descripcion,itemID,itemEl.firstElementChild.checked];
				})
				,cat.id
			]
		})
		,lista:listaPrincipal//[...todo.children].splice(1).map(el=>el.dataset.id)
	}));
}

function guardar(){
	localStorage.setItem('datos',serializar());
}

function deserializarYCargar(cadena){
	let info=JSON.parse(decodeURI(cadena));
	
	for (const categoria of info.categorias.reverse()) {
		new Categoria(categoria[0],categoria[1],categoria[2].reverse());
	}

	listaPrincipal=[...info.lista];
	let todoTitulo=todo.firstElementChild;
	for (const itemID of info.lista.reverse()) {
		todoTitulo.after(SqS(`[data-id="${itemID}"]`).cloneNode(true));
	}
}

function actualizarListaPrincipalYGuardar(){
	listaPrincipal=[...todo.children].splice(1).map(el=>el.dataset.id);
	guardar();
}

// * UI

let catTexto=gEt('cat-texto');
catTexto.oninput=buscar;

gEt('cat-nueva').onclick=()=>{
	Swal.fire({
		title: 'Nueva categoría',
		confirmButtonText: 'Crear',
		html:createElement('DIV',{
			class:'sweet-alert-2-formulario'
			,children:[
				['INPUT',{
					id:'cat-nueva-nombre'
					,value:catTexto.value
					,placeholder:'Nombre de la categoría nueva'
				}]
				,['INPUT',{
					type:'color'
					,id:'cat-nueva-color'
					,value:tinycolor.random().toHexString()
				}]
			]
		}),
		focusConfirm: false,
		preConfirm: () => {
			return [
				document.getElementById('cat-nueva-nombre').value.trim(),
				document.getElementById('cat-nueva-color').value
			]
		}
		,showCancelButton: true
	})
		.then(({isConfirmed,value}) => {
			if(isConfirmed) {
				catTexto.value='';
				catTexto.oninput();

				new Categoria(...value);
			}
		})
}

/* Modo oscuro para Sweetalert 2 */
var modo=localStorage.getItem('modo')||((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'default');
function cambiarModo(modoEnviado){
	if(!modoEnviado){
		modoEnviado=modo=='default'?'dark':'default';
	}

	gEt('sweet-alert-2-css').href=
		`https://cdn.jsdelivr.net/npm/@sweetalert2/theme-${modoEnviado}@5/${modoEnviado}.css`;

	D.body.parentNode.classList.remove(modo);
	D.body.parentNode.classList.add(modoEnviado);

	modo=modoEnviado;

	localStorage.setItem('modo',modo);
}
cambiarModo(modo);

D.body.addEventListener('change', e => {
	let target=e.target;
	if(target.tagName=='INPUT' && target.type=='checkbox'){
		let item=target.closest('.item');
		if(item){
			let otros=[...SqS(`[data-id="${item.dataset.id}"] > input`,{n:ALL})].filter(el=>el!=target)
			if(otros.length)
				for (const otro of otros) {
					otro.checked=target.checked;
				}

			guardar();
		}
	}

})

todo.onclick=(e)=>{
	if(e.target.classList.contains('cat-items-eliminar')){
		e.target.closest('.item').remove();
		actualizarListaPrincipalYGuardar();
	}
}

catItems.onclick=e=>{
	
	if(e.target.classList.contains('cat-items-eliminar'))
		Swal.fire({
			title: 'Cuidado',
			text: "Esta acción no se puede deshacer. ¿Está seguro que desea realizar la eliminación?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				filtrablesIndexados[e.target.closest('.filtrable').dataset.id].eliminar();
			}
		})
}

todo.oninput=
	catItems.oninput=
	e=>{
		let tar=e.target;
		if(tar.classList.contains('texto-legible')){
			let closestFiltrable=tar.closest('.filtrable');
			filtrablesIndexados[closestFiltrable.dataset.id].setDescripcion(tar.innerText,closestFiltrable);
			guardar();
		}
	}

// * Ordenamiento

new Sortable(catItems,{
	handle:HANDLE_CLASS
	,animation:150
	,onEnd:()=>guardar()
});

new Sortable(todo,{
	handle:HANDLE_CLASS
	,animation:150
	,group:"todo"
	,draggable:'.item'
	,onEnd:ITEMS_DRAG_OPTIONS_ONEND
});

gEt('hamburguesa-categorias-label').ondragenter=clickPropio;
gEt('hamburguesa-categorias').ondragenter=clickPropio;
/* cancelarElemento.ondragenter=()=>{
	cancelar=true;
} */

// * Carga de localStorage
let datos=localStorage.getItem('datos');
if(datos)
	deserializarYCargar(datos);


// // * Pruebas

// for(let cat of [['Facultad','#3f48d8',[['molestar a la profe de PyE otra vez','a'],['inscribirme a IE 💡','b'],['proyecto AD de Java','c']]],['Trabajo','#e2c254',[['mandarle mail a Juan','d'],['volver a hablar con Latincloud por las respuestas automáticas','e'],['llamar a Pedro','f']]],['Casa','#5f96a0',[['barrer','g'],['limpiar el escritorio','h']]]]
// ){
// 	new Categoria(...cat);
// }
