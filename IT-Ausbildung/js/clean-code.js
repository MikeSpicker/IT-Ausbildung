// Code Review Exercise
document.addEventListener('DOMContentLoaded', function() {
    // Initialize code editors and check solution buttons
    const codeEditors = document.querySelectorAll('.code-editor');
    const checkButtons = document.querySelectorAll('.check-solution');
    
    checkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const editor = this.closest('.code-editor-container').querySelector('.code-editor');
            analyzeCode(editor, true);
        });
    });

    codeEditors.forEach(editor => {
        editor.addEventListener('input', function() {
            analyzeCode(this, false);
        });
    });

    // Code Analysis Function
    function analyzeCode(editor, showDetailedFeedback) {
        const code = editor.value.toLowerCase();
        const feedback = [];
        let score = 0;
        const maxScore = 5;

        // Common analysis rules
        if (code.includes('var ')) {
            feedback.push('❌ Verwende let/const statt var');
        } else {
            feedback.push('✅ Gut: Moderne Variablendeklaration');
            score++;
        }

        if (code.includes('function') && !code.includes('//')) {
            feedback.push('❌ Füge Dokumentation für Funktionen hinzu');
        } else if (code.includes('/**') || (code.includes('//') && code.includes('function'))) {
            feedback.push('✅ Gut: Dokumentation vorhanden');
            score++;
        }

        // Function-specific analysis
        if (editor.closest('.card').querySelector('h3').textContent.includes('Funktionen')) {
            if (code.includes('reduce') || code.includes('map') || code.includes('filter')) {
                feedback.push('✅ Gut: Verwendung von Array-Methoden');
                score++;
            } else {
                feedback.push('❌ Nutze funktionale Array-Methoden');
            }
            
            if (code.includes('type') || code.includes('interface')) {
                feedback.push('✅ Gut: Typ-Definitionen');
                score++;
            } else if (showDetailedFeedback) {
                feedback.push('❌ Füge Typdefinitionen hinzu');
            }

            if (code.includes('throw') && code.includes('error')) {
                feedback.push('✅ Gut: Fehlerbehandlung');
                score++;
            } else if (showDetailedFeedback) {
                feedback.push('❌ Implementiere Fehlerbehandlung');
            }
        }

        // Class-specific analysis
        if (editor.closest('.card').querySelector('h3').textContent.includes('Klassen')) {
            if (code.includes('private') || code.includes('#')) {
                feedback.push('✅ Gut: Private Felder/Methoden');
                score++;
            } else if (showDetailedFeedback) {
                feedback.push('❌ Nutze private Felder/Methoden');
            }

            if (code.includes('interface') || code.includes('type')) {
                feedback.push('✅ Gut: Typ-Definitionen');
                score++;
            } else if (showDetailedFeedback) {
                feedback.push('❌ Füge Typdefinitionen hinzu');
            }

            if (code.includes('class') && code.split('class').length > 2) {
                feedback.push('✅ Gut: Separation of Concerns');
                score++;
            } else if (showDetailedFeedback) {
                feedback.push('❌ Teile die Klasse in kleinere Klassen auf');
            }
        }

        // Show feedback
        const feedbackContainer = editor.closest('.code-playground').querySelector('.hints-container');
        if (feedbackContainer) {
            const feedbackList = document.createElement('div');
            feedbackList.className = 'feedback-list mt-3';
            
            const percentage = (score / maxScore) * 100;
            const progressClass = percentage >= 60 ? 'bg-success' : 'bg-warning';
            
            feedbackList.innerHTML = `
                <h6>Feedback:</h6>
                <ul class="list-unstyled mb-0">
                    ${feedback.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="progress mt-3" style="height: 5px;">
                    <div class="progress-bar ${progressClass}" 
                         style="width: ${percentage}%"></div>
                </div>
                ${showDetailedFeedback ? `
                <div class="solution-feedback mt-3 show">
                    <p class="mb-0">
                        <strong>Gesamtbewertung:</strong> ${score} von ${maxScore} Punkten
                        ${percentage >= 80 ? '🌟 Ausgezeichnet!' : 
                          percentage >= 60 ? '👍 Gut gemacht!' : 
                          'Noch Verbesserungspotential!'}
                    </p>
                </div>` : ''}
            `;
            
            const existingFeedback = feedbackContainer.querySelector('.feedback-list');
            if (existingFeedback) {
                feedbackContainer.removeChild(existingFeedback);
            }
            feedbackContainer.appendChild(feedbackList);

            // Animate progress bar
            const progressBar = feedbackList.querySelector('.progress-bar');
            setTimeout(() => {
                progressBar.style.width = `${percentage}%`;
            }, 100);
        }
    }

    // Code highlighting
    Prism.highlightAll();

    // Copy code functionality
    document.querySelectorAll('.code-example').forEach(block => {
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-light position-absolute top-0 end-0 m-2';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.setAttribute('data-bs-toggle', 'tooltip');
        button.setAttribute('data-bs-title', 'Code kopieren');
        
        block.style.position = 'relative';
        block.appendChild(button);

        button.addEventListener('click', async () => {
            const code = block.querySelector('code').textContent;
            try {
                await navigator.clipboard.writeText(code);
                button.setAttribute('data-bs-title', 'Kopiert!');
                const tooltip = bootstrap.Tooltip.getInstance(button);
                tooltip.show();
                setTimeout(() => {
                    button.setAttribute('data-bs-title', 'Code kopieren');
                    tooltip.hide();
                }, 1500);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        });
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
