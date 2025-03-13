document.addEventListener('DOMContentLoaded', function() {
    // Memory Visualization
    const memoryDemo = document.getElementById('memoryDemo');
    const variables = new Map();
    let memoryAddress = 1000; // Starting mock memory address

    function createMemoryBox(name, value, type) {
        const box = document.createElement('div');
        box.className = 'memory-box';
        box.innerHTML = `
            <div class="memory-address">0x${memoryAddress.toString(16).toUpperCase()}</div>
            <div class="memory-name">${name}</div>
            <div class="memory-value">${value}</div>
            <small class="memory-type">${type}</small>
        `;
        memoryAddress += 8; // Increment mock memory address
        return box;
    }

    // Variable Creation Demo
    const variableType = document.getElementById('variableType');
    const variableName = document.getElementById('variableName');
    const variableValue = document.getElementById('variableValue');
    const createVariableBtn = document.getElementById('createVariable');
    const variableOutput = document.getElementById('variableOutput');

    createVariableBtn.addEventListener('click', function() {
        const type = variableType.value;
        const name = variableName.value;
        let value = variableValue.value;

        if (!name) {
            showError('Bitte geben Sie einen Variablennamen ein.');
            return;
        }

        try {
            // Convert value based on type
            switch(type) {
                case 'number':
                    value = Number(value);
                    if (isNaN(value)) throw new Error('Ungültiger numerischer Wert');
                    break;
                case 'boolean':
                    value = value.toLowerCase() === 'true';
                    break;
                case 'string':
                    // Keep as is
                    break;
            }

            // Add to memory visualization
            if (variables.has(name)) {
                memoryDemo.removeChild(variables.get(name));
            }
            const memoryBox = createMemoryBox(name, value, type);
            variables.set(name, memoryBox);
            memoryDemo.appendChild(memoryBox);

            // Show in output
            variableOutput.innerHTML = `
                <div class="text-success">Variable erstellt:</div>
                let ${name} = ${type === 'string' ? `"${value}"` : value};
                <div class="mt-2">typeof ${name} = "${type}"</div>
            `;

            // Clear inputs
            variableName.value = '';
            variableValue.value = '';

        } catch (error) {
            showError(error.message);
        }
    });

    // Type Conversion Demo
    const convertValue = document.getElementById('convertValue');
    const convertType = document.getElementById('convertType');
    const convertBtn = document.getElementById('convertType');
    const conversionOutput = document.getElementById('conversionOutput');

    convertBtn.addEventListener('click', function() {
        const value = convertValue.value;
        const targetType = convertType.value;
        let result;

        try {
            switch(targetType) {
                case 'number':
                    result = Number(value);
                    if (isNaN(result)) throw new Error('Konvertierung zu Number fehlgeschlagen');
                    break;
                case 'string':
                    result = String(value);
                    break;
                case 'boolean':
                    result = Boolean(value);
                    break;
            }

            conversionOutput.innerHTML = `
                <div class="text-success">Konvertierung erfolgreich:</div>
                Original: ${value} (${typeof value})
                <br>
                Konvertiert: ${result} (${typeof result})
            `;

        } catch (error) {
            showError(error.message);
        }
    });

    // Exercise Checking
    window.checkAnswer = function(questionNumber) {
        switch(questionNumber) {
            case 1:
                const selected = document.querySelector('input[name="q1"]:checked');
                if (!selected) {
                    alert('Bitte wählen Sie eine Antwort aus.');
                    return;
                }
                if (selected.value === '52') {
                    alert('Richtig! "5" + 2 führt zu einer String-Konkatenation.');
                } else {
                    alert('Nicht ganz. Denken Sie daran: Wenn ein String mit einer Zahl addiert wird, wird die Zahl in einen String umgewandelt.');
                }
                break;
        }
    };

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-2';
        errorDiv.textContent = message;
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
        
        // Show in relevant output area
        if (event.target.closest('.code-playground')) {
            variableOutput.appendChild(errorDiv);
        } else {
            conversionOutput.appendChild(errorDiv);
        }
    }

    // Initialize Prism.js syntax highlighting
    Prism.highlightAll();
});
