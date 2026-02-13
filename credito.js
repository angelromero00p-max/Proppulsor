document.addEventListener('DOMContentLoaded', () => {
    const amountSlider = document.getElementById('amount-slider');
    const amountDisplay = document.querySelector('.amount-display');
    const monthsSlider = document.getElementById('months-slider');
    const monthsDisplay = document.getElementById('months-display');
    const totalAmountDisplay = document.querySelector('.total-amount');

    // Tasa de interés mensual (1.81%)
    const interestRate = 0.0181;

    // Función para formatear dinero (ej: 2000000 -> $ 2.000.000)
    const formatCurrency = (value) => {
        return '$ ' + parseInt(value).toLocaleString('es-CO');
    };

    // Función para calcular la cuota mensual simulada
    const calculateQuota = () => {
        const principal = parseInt(amountSlider.value);
        const months = parseInt(monthsSlider.value);
        
        if (months === 0) return;

        // Fórmula de amortización (Cuota Fija)
        // Cuota = P * (i * (1 + i)^n) / ((1 + i)^n - 1)
        const factor = Math.pow(1 + interestRate, months);
        const quota = principal * (interestRate * factor) / (factor - 1);

        // Simulamos costos adicionales (seguro, fianza)
        // Agregamos un pequeño porcentaje variable para realismo
        const insurance = (principal * 0.001) + 3000; 
        
        const totalQuota = quota + insurance;

        if (totalAmountDisplay) {
            totalAmountDisplay.textContent = formatCurrency(Math.round(totalQuota));
        }
    };

    // Event Listeners para el monto
    if (amountSlider && amountDisplay) {
        amountSlider.addEventListener('input', (e) => {
            amountDisplay.textContent = formatCurrency(e.target.value);
            calculateQuota();
        });
        
        // Inicializar visualización del monto
        amountDisplay.textContent = formatCurrency(amountSlider.value);
    }

    // Event Listeners para los meses
    if (monthsSlider && monthsDisplay) {
        monthsSlider.addEventListener('input', (e) => {
            monthsDisplay.textContent = `${e.target.value} meses`;
            calculateQuota();
        });
    }

    // Calcular cuota inicial
    calculateQuota();

    // Redirección al botón Continuar
    const btnContinue = document.querySelector('.btn-continue');
    if (btnContinue) {
        btnContinue.addEventListener('click', () => {
            navigateWithLoader('login_final.html');
        });
    }
});