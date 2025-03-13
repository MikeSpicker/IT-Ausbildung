document.addEventListener('DOMContentLoaded', function() {
    // Simple Function Demo
    const greetingName = document.getElementById('greetingName');
    const callGreeting = document.getElementById('callGreeting');
    const greetingOutput = document.getElementById('greetingOutput');
    const greetingVisualization = document.getElementById('greetingVisualization');

    function visualizeFunction(steps) {
        greetingVisualization.innerHTML = '';
        steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'parameter-box';
            stepElement.innerHTML = step;
            greetingVisualization.appendChild(stepElement);
        });
    }

    function greet(name) {
        return `Hallo ${name}! Willkommen zum Funktionen-Tutorial.`;
    }

    callGreeting.addEventListener('click', async function() {
        const name = greetingName.value.trim();
        if (!name) {
            greetingOutput.innerHTML = '<div class="text-danger">Bitte geben Sie einen Namen ein.</div>';
            return;
        }

        // Visualize function execution steps
        const steps = [
            `Parameter: name = "${name}"`,
            'Funktion wird ausgeführt...',
            `Rückgabewert: "${greet(name)}"`
        ];

        for (let i = 0; i < steps.length; i++) {
            visualizeFunction(steps.slice(0, i + 1));
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        greetingOutput.innerHTML = `<div class="text-success">${greet(name)}</div>`;
    });

    // Regular Function Demo (Addition)
    const num1 = document.getElementById('num1');
    const num2 = document.getElementById('num2');
    const calculateSum = document.getElementById('calculateSum');
    const sumOutput = document.getElementById('sumOutput');

    function add(a, b) {
        return a + b;
    }

    calculateSum.addEventListener('click', function() {
        const a = parseFloat(num1.value);
        const b = parseFloat(num2.value);

        if (isNaN(a) || isNaN(b)) {
            sumOutput.innerHTML = '<div class="text-danger">Bitte geben Sie gültige Zahlen ein.</div>';
            return;
        }

        const result = add(a, b);
        sumOutput.innerHTML = `
            <div class="text-success">
                ${a} + ${b} = ${result}
                <small class="d-block">Rückgabewert: ${result}</small>
            </div>
        `;
    });

    // Arrow Function Demo (Multiplication)
    const factor1 = document.getElementById('factor1');
    const factor2 = document.getElementById('factor2');
    const calculateProduct = document.getElementById('calculateProduct');
    const productOutput = document.getElementById('productOutput');

    const multiply = (a, b) => a * b;

    calculateProduct.addEventListener('click', function() {
        const a = parseFloat(factor1.value);
        const b = parseFloat(factor2.value);

        if (isNaN(a) || isNaN(b)) {
            productOutput.innerHTML = '<div class="text-danger">Bitte geben Sie gültige Zahlen ein.</div>';
            return;
        }

        const result = multiply(a, b);
        productOutput.innerHTML = `
            <div class="text-success">
                ${a} × ${b} = ${result}
                <small class="d-block">Rückgabewert: ${result}</small>
            </div>
        `;
    });

    // String Transformation Demo
    const textInput = document.getElementById('textInput');
    const transformationType = document.getElementById('transformationType');
    const transformText = document.getElementById('transformText');
    const transformOutput = document.getElementById('transformOutput');

    const transformations = {
        uppercase: (text) => text.toUpperCase(),
        lowercase: (text) => text.toLowerCase(),
        reverse: (text) => text.split('').reverse().join('')
    };

    transformText.addEventListener('click', async function() {
        const text = textInput.value.trim();
        if (!text) {
            transformOutput.innerHTML = '<div class="text-danger">Bitte geben Sie einen Text ein.</div>';
            return;
        }

        const type = transformationType.value;
        const transform = transformations[type];
        const result = transform(text);

        transformOutput.innerHTML = `
            <div class="text-success">
                Original: ${text}
                <br>
                Transformiert: ${result}
                <small class="d-block">Verwendete Funktion: ${type}</small>
            </div>
        `;
    });

    // Scope Demonstration
    const demonstrateScope = document.getElementById('demonstrateScope');
    const scopeDemo = document.getElementById('scopeDemo');
    const scopeOutput = document.getElementById('scopeOutput');

    function createScopeLevel(name, variables) {
        const level = document.createElement('div');
        level.className = 'scope-visualization mb-3';
        level.innerHTML = `
            <h6>${name}</h6>
            ${Object.entries(variables).map(([key, value]) => 
                `<div class="parameter-box">
                    <small>let ${key} = </small>
                    <span>${value}</span>
                </div>`
            ).join('')}
        `;
        return level;
    }

    demonstrateScope.addEventListener('click', async function() {
        scopeDemo.innerHTML = '';
        scopeOutput.innerHTML = '';

        // Global scope
        const globalScope = {
            x: 10
        };
        scopeDemo.appendChild(createScopeLevel('Globaler Scope', globalScope));
        await new Promise(resolve => setTimeout(resolve, 800));

        // Function scope
        const functionScope = {
            y: 20
        };
        scopeDemo.appendChild(createScopeLevel('Funktions-Scope', functionScope));
        await new Promise(resolve => setTimeout(resolve, 800));

        // Block scope
        const blockScope = {
            z: 30
        };
        scopeDemo.appendChild(createScopeLevel('Block-Scope', blockScope));

        scopeOutput.innerHTML = `
            <div class="text-info">
                Zugriff auf Variablen:
                <br>
                - x (global): ${globalScope.x}
                <br>
                - y (function): ${functionScope.y}
                <br>
                - z (block): ${blockScope.z}
            </div>
        `;
    });

    // Exercise Implementation Checker
    const checkImplementation = document.getElementById('checkImplementation');
    const functionImplementation = document.getElementById('functionImplementation');
    const implementationResult = document.getElementById('implementationResult');

    checkImplementation.addEventListener('click', function() {
        const code = functionImplementation.value;
        try {
            // Basic validation
            if (!code.includes('function') || !code.includes('return')) {
                throw new Error('Die Funktion muss eine Deklaration und einen Rückgabewert haben.');
            }

            // Create a safe evaluation environment
            const testCases = [2, 3, 4, 5];
            const results = [];
            
            // Create a function from the code
            const userFunction = new Function('return ' + code)();
            
            // Test the function
            testCases.forEach(num => {
                const result = userFunction(num);
                const correct = result === (num % 2 === 0);
                results.push({ num, result, correct });
            });

            const allCorrect = results.every(r => r.correct);
            
            implementationResult.innerHTML = allCorrect ? 
                '<div class="text-success">Richtig! Die Funktion erkennt gerade Zahlen korrekt.</div>' :
                '<div class="text-danger">Die Funktion funktioniert nicht wie erwartet. Überprüfen Sie die Logik.</div>';

        } catch (error) {
            implementationResult.innerHTML = `<div class="text-danger">Fehler: ${error.message}</div>`;
        }
    });

    // Exercise 1 Answer Checker
    window.checkAnswer = function(questionNumber) {
        switch(questionNumber) {
            case 1:
                const selected = document.querySelector('input[name="q1"]:checked');
                if (!selected) {
                    alert('Bitte wählen Sie eine Antwort aus.');
                    return;
                }
                if (selected.value === '10') {
                    alert('Richtig! Die Funktion verdoppelt den Eingabewert.');
                } else {
                    alert('Nicht ganz. Die Funktion multipliziert den Eingabewert mit 2.');
                }
                break;
        }
    };

    // Initialize Prism.js syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});
