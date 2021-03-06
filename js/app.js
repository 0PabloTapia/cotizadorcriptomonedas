const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}
//crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas)
})


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptoMonedas();

    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

async function consultarCriptoMonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error)
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e) {
    e.preventDefault();

    //validación
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('ambos campos son obligatorios');
        return;
    } 

        //consultar API con los resultados
        consultarAPI();
}

function mostrarAlerta(msg) {
    const alertaExistente = document.querySelector('.error');
    if(!alertaExistente) {
        const alerta = document.createElement('p');
        alerta.classList.add('error');

        alerta.textContent = msg;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

  async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
        await esperar(1500);
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        
    } catch (error) {
        console.log(error)
    }
    
       
}
//instanciar una promesa para agregar un timeOut a la cotización con async
async function esperar(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
   
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p> Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p> Precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimas24Horas = document.createElement('p');
    ultimas24Horas.innerHTML = `<p> Variación en las últimas 24 hrs: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p> Última actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimas24Horas)
    resultado.appendChild(ultimaActualizacion)
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>  
    `;

    resultado.appendChild(spinner);
}

