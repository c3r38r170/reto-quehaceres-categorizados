// * Variables Globales

var catItems=gEt('cat-items')
var listaPrincipal=[];
var filtrablesIndexados={};
var categorias=[];
var moviendo=false;

var cancelarElemento=gEt('cancelar');
var cancelar=false;

var cargarInput=createElement('INPUT',{
	class:'hidden',
	type:'file',
	onchange:function(){
		var fr=new FileReader();
		fr.onload=()=>{
			for(let categoria of categorias){
				categoria.eliminar();
			}

			let info=JSON.parse(decodeURI(fr.result));
			for (const categoria of info.categorias) {
				new Categoria(...categoria);
			}

			Swal.fire({
				icon: 'success',
				title: 'Your work has been saved',
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
// TODO ghost class
const ITEMS_DRAG_OPTIONS={
	handle:HANDLE_CLASS
	
	,group:{
		name:"todo"
		,pull:'clone'
		,put:'false'
	}
	,animation:150
	,onEnd:(e)=>{
		console.log('onedn')
		if(cancelar){
			e.item.remove();
			cancelar=false;
		}

		cancelarElemento.classList.remove('cancelar-mostrar');
	}
};

// * Clases

// TODO edición, doble click

class Filtrable{
	id;
	descripcion;
	descripcionNormalizada;
	elementoHTML;
	constructor(descripcion, elementoHTML,id){
		this.id=id||Date.now().toString(36) + Math.random().toString(36).substring(2);
		filtrablesIndexados[this.id]=this;
		
		this.descripcion=descripcion;
		console.log(arguments);
		this.descripcionNormalizada=normalizarTexto(this.descripcion);
		
		this.elementoHTML=elementoHTML;
		this.elementoHTML.dataset.id=this.id;
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
														,onclick:eliminar
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
							// TODO onclick
							,['BUTTON',{classList:['fas','fa-plus'],onclick:crearItem}]
							,['DIV',{class:'cat-items-lista'}]
						]}]
					]
				}
			)
			,id
		);
		// TODO dry this
		catItems.prepend(this.elementoHTML);

		categorias.push(this);

		this.colores.propio=color;
		let tcColor=tinycolor(color);
		this.colores.items=tcColor[tcColor.isDark()?'lighten':'darken'](10).toHexString();

		// * Solo cuando se importa
		if(items)
			for (const item of items) {
				this.aniadirItem(...item);
			}

		new Sortable(SqS('.cat-items-lista',{from:this.elementoHTML}),ITEMS_DRAG_OPTIONS);
		
	}
	eliminar(){
		// for (const itemID of this.items) {
			// TODO delegar a Item
			for(let item of [...SqS(
				this.items.map(itemID=>{
					delete filtrablesIndexados[itemID];
					return `[data-id="${itemID}"]`;
				}).join(',')
				,{n:ALL}
			)]){
				item.remove();
			}
		// }
		this.elementoHTML.remove();
		delete filtrablesIndexados[this.id];
	}
	
	aniadirItem(descripcion,id){
		let newItem=new Item(descripcion,id);
		newItem.elementoHTML.style.background=this.colores.items;
		this.items.push(newItem.id);

		let container=SqS('.cat-items-lista',{from:this.elementoHTML})
		container.prepend(newItem.elementoHTML);
	}
	quitarItem(id){
		// TODO
		this.items.splice(this.items.indexOf(id));
	}
}

class Item extends Filtrable{
	constructor(descripcion,id){
		super(descripcion,createElement('DIV',{
			classList:['item','filtrable']
			,children: [
				[
					'INPUT',
					{
						type: 'checkbox'
					}
				],
				[
					'SPAN'
					,{
						innerText:descripcion
						,class:'texto-legible'
					}
				]
				,[
					'SPAN'
					,{class:'cat-items-agarrar'}
				]
			]
		}),id);
	}
}

// * Funciones

function normalizarTexto(texto){
	return texto.normalize("NFD").replace(REG_EXP.DIACRITICOS, "")
}

function buscar(){
	// * this es el input tipo texto.
	// * La estructura es: this + botón + contenedor de elementos a filtrar

	let valor=this.value.trim()
		,accion;
	if(valor){
		valor=normalizarTexto(valor);
		let regExp;
		try{
			regExp=new RegExp('.*?'+valor+'.*?','i');
		}catch(e){
			regExp=new RegExp(valor.replace(REG_EXP.ESCAPES, "\\$&"),'i');
		}
		accion=elemento=>{
			let filtrable=filtrablesIndexados[elemento.dataset.id];
			if(
				regExp.test(filtrable.descripcion)
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
		download:new Date().toISOString().slice(0, 10)+'.json',
		class:'hidden',
		href:'data:application/json;base64,'+btoa(encodeURI(JSON.stringify({
			categorias:[...catItems.children].reverse().map(el=>{
				let cat=filtrablesIndexados[el.dataset.id]
				return [
					cat.descripcion
					,cat.colores.propio
					,[...SqS('.cat-items-lista',{from:el}).children].reverse().map(itemEl=>{
						let itemID=itemEl.dataset.id;
						return [filtrablesIndexados[itemID].descripcion,itemID];
					})
					,cat.id
				]
			})
			,lista:[...gEt('todo').children].map(el=>el.dataset.id)
		})))
	}]);
	enlace.click();
	enlace.remove();
}

function cargar(){
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

function eliminar() {
	filtrablesIndexados[this.closest('.filtrable').dataset.id].eliminar();
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
let mode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'default';
gEt('sweet-alert-2-css').href=
	`https://cdn.jsdelivr.net/npm/@sweetalert2/theme-${mode}@5/${mode}.css`;

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
		}
	}

})

// * Ordenamiento

new Sortable(catItems,{
	handle:HANDLE_CLASS
	
	,animation:150
});

new Sortable(gEt('todo'),{
	handle:HANDLE_CLASS
	,animation:150
	,group:"todo"

});

gEt('hamburguesa-categorias-label').ondragenter=clickPropio;
gEt('hamburguesa-categorias').ondragenter=clickPropio;
/* cancelarElemento.ondragenter=()=>{
	cancelar=true;
} */


// * Pruebas

for(let cat of [['Facultad','#3f48d8',['molestar a la profe de PyE otra vez','inscribirme a IE 💡','proyecto AD de Java']],['Trabajo','#e2c254',['mandarle mail a Juan','volver a hablar con Latincloud por las respuestas automáticas','llamar a Pedro']],['Casa','#5f96a0',['barrer','limpiar el escritorio']]]){
	new Categoria(...cat);
}
