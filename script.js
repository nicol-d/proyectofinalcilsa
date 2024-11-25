const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const input = document.querySelector('input');
const botonEnter = document.querySelector('#botonEnter');
const check = "fa-check-circle";
const unchecked = "fa-circle";
const realizadoClass = "realizado";
let id = 0;
let LIST = [];

/* Creación de la fecha */
const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
});

/* Función para agregar una tarea */
function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) return;

    const li = document.createElement('li');
    li.id = "elemento";
    li.innerHTML = `
        <i class="fa-regular ${realizado ? check : unchecked}" data="realizado" id="${id}"></i>
        <p class="text ${realizado ? realizadoClass : ""}" contenteditable="true">${tarea}</p>
        <i class="fa-solid fa-trash" data="Eliminado" id="${id}"></i>
    `;
    lista.appendChild(li);
}

/* Marca una tarea como realizada o no realizada */
function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(unchecked);
    element.parentNode.querySelector(".text").classList.toggle(realizadoClass);
    LIST[element.id].realizado = !LIST[element.id].realizado;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

/* Elimina una tarea con animación */
function eliminarTarea(element) {
    const parent = element.parentNode;
    parent.classList.add('removed');
    setTimeout(() => parent.remove(), 300);
    LIST[element.id].eliminado = true;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

/* Cargar tareas desde localStorage */
function cargarTareas() {
    const data = localStorage.getItem("TODO");
    try {
        LIST = JSON.parse(data) || [];
        id = LIST.length;
        LIST.forEach(item => {
            agregarTarea(item.name, item.id, item.realizado, item.eliminado);
        });
    } catch (error) {
        console.error("Error cargando las tareas: ", error);
        LIST = [];
        localStorage.setItem("TODO", JSON.stringify(LIST));
    }
}

/* Evento para agregar tarea con el botón */
botonEnter.addEventListener("click", () => {
    const tarea = input.value.trim();
    if (tarea) {
        agregarTarea(tarea, id, false, false);
        LIST.push({
            name: tarea,
            id: id,
            realizado: false,
            eliminado: false
        });
        localStorage.setItem("TODO", JSON.stringify(LIST));
        input.value = "";
        id++;
    }
});

/* Evento para agregar tarea presionando Enter */
document.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        const tarea = input.value.trim();
        if (tarea) {
            agregarTarea(tarea, id, false, false);
            LIST.push({
                name: tarea,
                id: id,
                realizado: false,
                eliminado: false
            });
            localStorage.setItem("TODO", JSON.stringify(LIST));
            input.value = "";
            id++;
        }
    }
});

/* Evento para manejar los clics en la lista */
lista.addEventListener("click", function(event) {
    const element = event.target;
    const elementData = element.attributes.data.value;
    if (elementData === "realizado") {
        tareaRealizada(element);
    } else if (elementData === "Eliminado") {
        eliminarTarea(element);
    }
});

/* Evento para editar tareas */
lista.addEventListener("input", function(event) {
    const element = event.target;
    if (element.classList.contains("text")) {
        const id = element.previousElementSibling.id;
        LIST[id].name = element.innerText;
        localStorage.setItem("TODO", JSON.stringify(LIST));
    }
});

/* Cargar las tareas cuando la página se carga */
window.addEventListener("load", cargarTareas);
