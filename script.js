// Seleccionamos los elementos de la pantalla
const input = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const shoppingList = document.getElementById('shopping-list');
const clearAllBtn = document.getElementById('clear-all-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Elemento para el reloj digital
const $tiempo = document.querySelector('.tiempo');

// Al cargar la página, recuperamos la lista guardada en el navegador
document.addEventListener('DOMContentLoaded', loadItems);

// Escuchar el clic en el botón de añadir
addBtn.addEventListener('click', addItem);

// Escuchar si el usuario pulsa la tecla "Enter" en el input principal
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

// Escuchar el botón de borrar todo
clearAllBtn.addEventListener('click', clearAll);

// Escuchar el botón de borrar comprados
if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', clearCompleted);
}

function addItem() {
    const text = input.value.trim(); // Obtenemos el texto sin espacios vacíos
    
    if (text === "") return; // Si está vacío, no hacemos nada

    const item = {
        id: Date.now(), // Creamos un ID único basado en la hora actual
        text: text,
        completed: false
    };

    createItemDOM(item, true); // Lo pintamos al principio de la lista
    saveItem(item); // Lo guardamos en la memoria del navegador
    input.value = ""; // Limpiamos el cuadro de escribir
}

function createItemDOM(item, isNew = false) {
    const li = document.createElement('li'); // Creamos una etiqueta <li>
    li.classList.add('item'); // Le ponemos la clase CSS 'item'
    if (item.completed) li.classList.add('completed'); // Si ya estaba comprado, lo tachamos
    li.setAttribute('data-id', item.id); // Guardamos su ID en el HTML

    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${item.completed ? 'checked' : ''}>
        <span>${item.text}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
    `;

    // Evento para marcar como completado
    const checkbox = li.querySelector('.checkbox');
    checkbox.addEventListener('change', () => toggleStatus(item.id, li));

    // Evento para editar con DOBLE CLIC
    const span = li.querySelector('span');
    span.addEventListener('dblclick', () => enableEditing(item.id, span));

    // Evento para borrar este producto con confirmación
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Quieres eliminar "${item.text}" de la lista?`)) {
            deleteItem(item.id, li);
        }
    });

    // Si es nuevo o desmarcado, va arriba. Si ya estaba completado al cargar, va abajo.
    if (isNew || !item.completed) {
        shoppingList.prepend(li); // Añade al principio
    } else {
        shoppingList.appendChild(li); // Añade al final
    }
}

// Función para activar el modo edición
function enableEditing(id, spanElement) {
    const originalText = spanElement.innerText;
    const parent = spanElement.parentNode;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = originalText;
    editInput.classList.add('edit-input');

    parent.replaceChild(editInput, spanElement);
    editInput.focus();

    editInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') editInput.blur();
    });

    editInput.addEventListener('blur', () => {
        finishEditing(id, editInput, spanElement);
    });
}

function finishEditing(id, inputElement, spanElement) {
    if (!inputElement.parentNode) return;

    const newText = inputElement.value.trim();
    const parent = inputElement.parentNode;

    if (newText !== "") {
        let items = getFromStorage();
        items = items.map(item => {
            if (item.id === id) item.text = newText;
            return item;
        });
        localStorage.setItem('myList', JSON.stringify(items));
        spanElement.innerText = newText;
    }

    parent.replaceChild(spanElement, inputElement);
}

// Cambia el estado (completado/pendiente) y mueve el elemento
function toggleStatus(id, liElement) {
    let items = getFromStorage();
    let isCompleted = false;

    items = items.map(i => {
        if (i.id === id) {
            i.completed = !i.completed;
            isCompleted = i.completed;
        }
        return i;
    });

    localStorage.setItem('myList', JSON.stringify(items));
    liElement.classList.toggle('completed');

    // Lógica para mover el elemento visualmente
    if (isCompleted) {
        shoppingList.appendChild(liElement); // Si se marca, va al final
    } else {
        shoppingList.prepend(liElement); // Si se desmarca, va al principio
    }
}

function deleteItem(id, element) {
    let items = getFromStorage();
    items = items.filter(i => i.id !== id);
    localStorage.setItem('myList', JSON.stringify(items));
    element.remove();
}

function clearCompleted() {
    let items = getFromStorage();
    items = items.filter(i => !i.completed);
    localStorage.setItem('myList', JSON.stringify(items));
    
    const completedElements = shoppingList.querySelectorAll('.item.completed');
    completedElements.forEach(el => el.remove());
}

function clearAll() {
    if (confirm("¿Quieres borrar toda la lista?")) {
        localStorage.removeItem('myList');
        shoppingList.innerHTML = "";
    }
}

// --- FUNCIONES DE ALMACENAMIENTO ---

function saveItem(item) {
    const items = getFromStorage();
    items.push(item);
    localStorage.setItem('myList', JSON.stringify(items));
}

function getFromStorage() {
    const stored = localStorage.getItem('myList');
    return stored ? JSON.parse(stored) : [];
}

function loadItems() {
    const items = getFromStorage();
    // Ordenamos: primero los falsos (pendientes), luego los verdaderos (completados)
    items.sort((a, b) => a.completed - b.completed);
    // Los pintamos (createItemDOM se encarga de la posición según el estado)
    items.forEach(item => createItemDOM(item));
}

// --- FUNCIONES DEL RELOJ ---

function Relojdigital(){
    let f = new Date();
    let timeString = f.toLocaleTimeString();
    if ($tiempo) $tiempo.innerHTML = timeString;
}

setInterval(() => {
    Relojdigital();
}, 100);