// Seleccionamos los elementos de la pantalla
const input = document.getElementById('item-input');
const addBtn = document.getElementById('add-btn');
const shoppingList = document.getElementById('shopping-list');
const clearAllBtn = document.getElementById('clear-all-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Elementos para el reloj digital
const $tiempo = document.querySelector('.tiempo');

// Al cargar la página, recuperamos la lista guardada en el navegador
document.addEventListener('DOMContentLoaded', loadItems);

// Escuchar el clic en el botón de añadir
addBtn.addEventListener('click', addItem);

// Escuchar si el usuario pulsa la tecla "Enter"
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

    createItemDOM(item); // Lo pintamos en la pantalla
    saveItem(item); // Lo guardamos en la memoria del navegador
    input.value = ""; // Limpiamos el cuadro de escribir
}

function createItemDOM(item) {
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

    // Evento para borrar este producto con confirmación
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Quieres eliminar "${item.text}" de la lista?`)) {
            deleteItem(item.id, li);
        }
    });

    shoppingList.appendChild(li); // Añadimos el producto a la lista visible
}

// Cambia el estado (completado/pendiente)
function toggleStatus(id, element) {
    let items = getFromStorage();
    items = items.map(i => {
        if (i.id === id) i.completed = !i.completed;
        return i;
    });
    localStorage.setItem('myList', JSON.stringify(items));
    element.classList.toggle('completed'); // Cambia el diseño visualmente
}

// Borra un solo producto
function deleteItem(id, element) {
    let items = getFromStorage();
    items = items.filter(i => i.id !== id);
    localStorage.setItem('myList', JSON.stringify(items));
    element.remove(); // Lo quita de la pantalla
}

// Borra solo los productos marcados como completados
function clearCompleted() {
    let items = getFromStorage();
    items = items.filter(i => !i.completed);
    localStorage.setItem('myList', JSON.stringify(items));
    
    const completedElements = shoppingList.querySelectorAll('.item.completed');
    completedElements.forEach(el => el.remove());
}

// Borra toda la lista
function clearAll() {
    if (confirm("¿Quieres borrar toda la lista?")) {
        localStorage.removeItem('myList');
        shoppingList.innerHTML = "";
    }
}

// --- FUNCIONES DE ALMACENAMIENTO (LocalStorage) ---

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
    items.forEach(item => createItemDOM(item));
}

// --- FUNCIONES DEL RELOJ ---

function Relojdigital(){
    let f = new Date();
    // Obtenemos la hora en formato local
    let timeString = f.toLocaleTimeString();
    // Lo pintamos en el HTML
    if ($tiempo) $tiempo.innerHTML = timeString;
}

// Ejecutamos la función cada 100 milisegundos para que sea exacto
setInterval(() => {
    Relojdigital();
}, 100);