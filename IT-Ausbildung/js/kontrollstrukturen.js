document.addEventListener('DOMContentLoaded', function() {
    // If-Else Demo
    const ageInput = document.getElementById('ageInput');
    const checkAgeBtn = document.getElementById('checkAge');
    const ageOutput = document.getElementById('ageOutput');
    const ifElseFlow = document.getElementById('ifElseFlow');

    function createFlowStep(text, id) {
        const step = document.createElement('div');
        step.className = 'flow-step';
        step.id = id;
        step.textContent = text;
        return step;
    }

    function initializeIfElseFlow() {
        ifElseFlow.innerHTML = '';
        const steps = [
            createFlowStep('Start', 'flowStart'),
            createFlowStep('Prüfe: Alter >= 18', 'flowCheck18'),
            createFlowStep('Prüfe: Alter >= 16', 'flowCheck16'),
            createFlowStep('Prüfe: Alter >= 12', 'flowCheck12'),
            createFlowStep('Ende', 'flowEnd')
        ];
        steps.forEach(step => ifElseFlow.appendChild(step));
    }

    initializeIfElseFlow();

    async function animateFlow(steps) {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        // Reset all steps
        document.querySelectorAll('.flow-step').forEach(step => {
            step.className = 'flow-step';
        });

        for (let stepId of steps) {
            const step = document.getElementById(stepId);
            if (step) {
                step.className = 'flow-step active';
                await delay(1000);
                step.className = 'flow-step completed';
            }
        }
    }

    checkAgeBtn.addEventListener('click', async function() {
        const age = parseInt(ageInput.value);
        
        // Enhanced validation
        if (isNaN(age)) {
            ageOutput.innerHTML = '<div class="text-danger">Bitte geben Sie ein gültiges Alter ein.</div>';
            return;
        }

        if (age < 0) {
            ageOutput.innerHTML = '<div class="text-danger">Das Alter kann nicht negativ sein.</div>';
            return;
        }

        if (age > 120) {
            ageOutput.innerHTML = '<div class="text-danger">Bitte geben Sie ein realistisches Alter ein (0-120).</div>';
            return;
        }

        if (!Number.isInteger(parseFloat(ageInput.value))) {
            ageOutput.innerHTML = '<div class="text-warning">Hinweis: Dezimalzahlen werden abgerundet.</div>';
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        let message = '';
        let flowSteps = ['flowStart'];

        if (age >= 18) {
            message = 'Sie sind volljährig. Zugriff auf alle Inhalte gewährt.';
            flowSteps.push('flowCheck18', 'flowEnd');
        } else if (age >= 16) {
            message = 'Sie dürfen Filme ab 16 Jahren ansehen.';
            flowSteps.push('flowCheck18', 'flowCheck16', 'flowEnd');
        } else if (age >= 12) {
            message = 'Sie dürfen Filme ab 12 Jahren ansehen.';
            flowSteps.push('flowCheck18', 'flowCheck16', 'flowCheck12', 'flowEnd');
        } else {
            message = 'Sie dürfen nur Filme ohne Altersbeschränkung ansehen.';
            flowSteps.push('flowCheck18', 'flowCheck16', 'flowCheck12', 'flowEnd');
        }

        ageOutput.innerHTML = `<div class="text-success">${message}</div>`;
        await animateFlow(flowSteps);
    });

    // For Loop Demo
    const loopCount = document.getElementById('loopCount');
    const startForLoop = document.getElementById('startForLoop');
    const forLoopOutput = document.getElementById('forLoopOutput');

    startForLoop.addEventListener('click', async function() {
        const count = parseInt(loopCount.value);
        if (isNaN(count) || count < 1 || count > 10) {
            forLoopOutput.innerHTML = '<div class="text-danger">Bitte geben Sie eine Zahl zwischen 1 und 10 ein.</div>';
            return;
        }

        forLoopOutput.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            forLoopOutput.innerHTML += `<div>Durchlauf ${i}</div>`;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    });

    // While Loop Demo (Number Guessing Game)
    const targetNumber = document.getElementById('targetNumber');
    const startWhileLoop = document.getElementById('startWhileLoop');
    const whileLoopOutput = document.getElementById('whileLoopOutput');

    startWhileLoop.addEventListener('click', async function() {
        const target = parseInt(targetNumber.value);
        if (isNaN(target) || target < 1 || target > 100) {
            whileLoopOutput.innerHTML = '<div class="text-danger">Bitte geben Sie eine Zahl zwischen 1 und 100 ein.</div>';
            return;
        }

        whileLoopOutput.innerHTML = '';
        let guess = 50;
        let min = 1;
        let max = 100;
        let attempts = 0;

        while (guess !== target && attempts < 7) {
            attempts++;
            whileLoopOutput.innerHTML += `<div>Versuch ${attempts}: Computer rät ${guess}</div>`;
            
            if (guess < target) {
                min = guess + 1;
                whileLoopOutput.innerHTML += '<div class="text-info">Zu niedrig!</div>';
            } else {
                max = guess - 1;
                whileLoopOutput.innerHTML += '<div class="text-info">Zu hoch!</div>';
            }

            guess = Math.floor((min + max) / 2);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (guess === target) {
            whileLoopOutput.innerHTML += `<div class="text-success">Gefunden! Die Zahl war ${target}.</div>`;
        } else {
            whileLoopOutput.innerHTML += '<div class="text-danger">Maximale Versuche erreicht!</div>';
        }
    });

    // Switch Case Demo
    const gradeSelect = document.getElementById('gradeSelect');
    const evaluateGrade = document.getElementById('evaluateGrade');
    const gradeOutput = document.getElementById('gradeOutput');

    evaluateGrade.addEventListener('click', function() {
        const grade = gradeSelect.value;
        if (!grade) {
            gradeOutput.innerHTML = '<div class="text-danger">Bitte wählen Sie eine Note aus.</div>';
            return;
        }

        let message = '';
        switch (grade) {
            case '1':
                message = 'Sehr gut! Hervorragende Leistung!';
                break;
            case '2':
                message = 'Gut! Überdurchschnittliche Leistung!';
                break;
            case '3':
                message = 'Befriedigend. Durchschnittliche Leistung.';
                break;
            case '4':
                message = 'Ausreichend. Leistung mit Mängeln.';
                break;
            case '5':
                message = 'Mangelhaft. Nacharbeit erforderlich.';
                break;
            case '6':
                message = 'Ungenügend. Erhebliche Nacharbeit erforderlich.';
                break;
            default:
                message = 'Ungültige Note.';
        }

        gradeOutput.innerHTML = `<div class="text-info">${message}</div>`;
    });

    // Exercise Implementation Checker
    const checkImplementation = document.getElementById('checkImplementation');
    const loopImplementation = document.getElementById('loopImplementation');
    const implementationResult = document.getElementById('implementationResult');

    checkImplementation.addEventListener('click', function() {
        const code = loopImplementation.value;
        try {
            // Basic validation
            if (!code.includes('for') || !code.includes('console.log')) {
                throw new Error('Verwenden Sie eine for-Schleife und console.log()');
            }

            // Create a safe evaluation environment
            const numbers = [];
            const mockConsole = {
                log: (num) => numbers.push(num)
            };

            // Replace console.log with our mock
            const safeCode = code.replace(/console\.log/g, 'mockConsole.log');
            
            // Execute the code
            new Function('mockConsole', safeCode)(mockConsole);

            // Check if numbers 1-5 were logged
            const correct = numbers.join(',') === '1,2,3,4,5';
            
            implementationResult.innerHTML = correct ? 
                '<div class="text-success">Richtig! Die Schleife gibt die Zahlen 1 bis 5 aus.</div>' :
                '<div class="text-danger">Nicht ganz. Die Schleife sollte die Zahlen 1 bis 5 ausgeben.</div>';

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
                if (selected.value === '012') {
                    alert('Richtig! Die while-Schleife gibt 0, 1, 2 aus.');
                } else {
                    alert('Nicht ganz. Die Schleife startet bei 0 und läuft, solange i < 3 ist.');
                }
                break;
        }
    };

    // Initialize Prism.js syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});
