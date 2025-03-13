document.addEventListener('DOMContentLoaded', function() {
    // Sample database tables
    const database = {
        users: [
            { id: 1, name: 'Max Mustermann', email: 'max@example.com', role: 'user' },
            { id: 2, name: 'Anna Schmidt', email: 'anna@example.com', role: 'admin' },
            { id: 3, name: 'Tom Weber', email: 'tom@example.com', role: 'user' }
        ],
        products: [
            { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
            { id: 2, name: 'Maus', price: 29.99, category: 'Electronics' },
            { id: 3, name: 'Bildschirm', price: 299.99, category: 'Electronics' },
            { id: 4, name: 'Tastatur', price: 79.99, category: 'Electronics' }
        ],
        orders: [
            { id: 1, user_id: 1, product_id: 1, quantity: 1, date: '2025-03-01' },
            { id: 2, user_id: 2, product_id: 2, quantity: 2, date: '2025-03-02' },
            { id: 3, user_id: 1, product_id: 3, quantity: 1, date: '2025-03-03' }
        ]
    };

    // Initialize table previews
    const tablePreviews = document.getElementById('tablePreviews');
    if (tablePreviews) {
        Object.entries(database).forEach(([tableName, data]) => {
            const tablePreview = document.createElement('div');
            tablePreview.className = 'table-preview-item mb-3';
            tablePreview.innerHTML = `
                <h6 class="mb-2">${tableName}</h6>
                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead>
                            <tr>
                                ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.slice(0, 2).map(row => `
                                <tr>
                                    ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            tablePreviews.appendChild(tablePreview);
        });
    }

    // SQL Query Execution
    const sqlQuery = document.getElementById('sqlQuery');
    const runQuery = document.getElementById('runQuery');
    const queryResult = document.getElementById('queryResult');

    if (runQuery) {
        runQuery.addEventListener('click', () => {
            try {
                const query = sqlQuery.value.toLowerCase().trim();
                let result = 'Keine Ergebnisse';

                // Simple SQL parser
                if (query.startsWith('select')) {
                    const tableMatch = query.match(/from\s+(\w+)/);
                    if (tableMatch && database[tableMatch[1]]) {
                        const table = tableMatch[1];
                        let data = [...database[table]];

                        // Handle WHERE clause
                        const whereMatch = query.match(/where\s+(\w+)\s*([><=]+)\s*(\d+)/);
                        if (whereMatch) {
                            const [_, field, operator, value] = whereMatch;
                            data = data.filter(row => {
                                switch(operator) {
                                    case '>': return row[field] > Number(value);
                                    case '<': return row[field] < Number(value);
                                    case '=': return row[field] == value;
                                    case '>=': return row[field] >= Number(value);
                                    case '<=': return row[field] <= Number(value);
                                    default: return true;
                                }
                            });
                        }

                        // Format result as table
                        result = `<div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.map(row => `
                                        <tr>
                                            ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>`;
                    }
                }

                queryResult.innerHTML = result;
            } catch (error) {
                queryResult.textContent = `Fehler: ${error.message}`;
            }
        });
    }

    // Exercise Validation
    const exercises = [
        {
            id: 1,
            solution: 'select * from users',
            validate: (query) => {
                query = query.toLowerCase().trim();
                return query.includes('select') && 
                       query.includes('from') && 
                       query.includes('users');
            }
        },
        {
            id: 2,
            solution: 'select * from products where price > 50',
            validate: (query) => {
                query = query.toLowerCase().trim();
                return query.includes('select') && 
                       query.includes('from') && 
                       query.includes('products') && 
                       query.includes('where') && 
                       query.includes('price') && 
                       query.includes('>') && 
                       query.includes('50');
            }
        }
    ];

    document.querySelectorAll('.check-solution').forEach((button, index) => {
        button.addEventListener('click', function() {
            const exercise = exercises[index];
            const query = this.previousElementSibling.value;
            const isCorrect = exercise.validate(query);
            
            let feedback = document.createElement('div');
            feedback.className = `alert mt-2 ${isCorrect ? 'alert-success' : 'alert-danger'}`;
            feedback.innerHTML = isCorrect ? 
                '✅ Richtig! Gut gemacht!' : 
                `❌ Nicht ganz richtig. Versuche es nochmal oder schaue dir die Musterlösung an.`;
            
            // Remove previous feedback if exists
            const previousFeedback = this.parentElement.querySelector('.alert');
            if (previousFeedback) {
                previousFeedback.remove();
            }
            
            this.parentElement.appendChild(feedback);
        });
    });

    // Code highlighting
    Prism.highlightAll();

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
