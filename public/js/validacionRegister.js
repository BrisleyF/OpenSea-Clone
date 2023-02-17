const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const clave = document.getElementById('clave');
const form = document.getElementById('form');
const parrafo = document.getElementById('warnings');

// Quita la validación mientras escribes
nombre.addEventListener('input', () => {
    // Quita el mensaje según escribes
    nombre.setCustomValidity('');
    // Comprueba si debe validarlo
    nombre.checkValidity();
});

email.addEventListener('input', () => {
    // Quita el mensaje según escribes
    email.setCustomValidity('');
    // Comprueba si debe validarlo
    email.checkValidity();
});

clave.addEventListener('input', () => {
    // Quita el mensaje según escribes
    clave.setCustomValidity('');
    // Comprueba si debe validarlo
    clave.checkValidity();
});

// Muestra el mensaje de validación
nombre.addEventListener('invalid', () => {
    nombre.setCustomValidity('El nombre no puede ir vacio.');
});

email.addEventListener('invalid', () => {
    email.setCustomValidity('El email no es valido.');
});

clave.addEventListener('invalid', () => {
    clave.setCustomValidity('La clave no es valida.');
});




/*form.addEventListener('submit', e => {
    e.preventDefault();

    let warnings = '';
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let entrar = false;
    parrafo.innerHTML = '';

    if (nombre.value == '') {
        warnings += `El nombre no puede ir vacio. <br>`;
        entrar = true;
    }
    if (email.value == '' || !regexEmail.test(email.value)) {
        warnings += `El email no es valido. <br>`;
        entrar = true;
    }
    if (clave.value == '' || clave.value.length < 4) {
        warnings += `La clave no es valida. <br>`;
        entrar = true;
    }
    if (entrar) {
        parrafo.innerHTML = warnings;
    } else {
        parrafo.innerHTML = 'Enviado';
    }
}) */