document.addEventListener('DOMContentLoaded', function() {
    // Sample database for MongoDB simulation
    let mongoDb = {
        users: [
            {
                name: "Max Mustermann",
                email: "max@example.com",
                age: 30,
                hobbies: ["Programmieren", "Sport"]
            },
            {
                name: "Anna Schmidt",
                email: "anna@example.com",
                age: 25,
                hobbies: ["Lesen", "Musik"]
            },
            {
                name: "Tom Weber",
                email: "tom@example.com",
                age: 28,
                hobbies: ["Programmieren", "Reisen"]
            }
        ]
    };

    // Document Insert Functionality
    const insertDocument = document.getElementById('insertDocument');
    const insertResult = document.getElementById('insertResult');
    const documentInput = document.getElementById('documentInput');
    const collectionName = document.getElementById('collectionName');

    if (insertDocument) {
        insertDocument.addEventListener('click', function() {
            try {
                const doc = JSON.parse(documentInput.value);
                const collection = collectionName.value;

                if (!mongoDb[collection]) {
                    mongoDb[collection] = [];
                }

                mongoDb[collection].push(doc);

                const feedback = document.createElement('div');
                feedback.className = 'alert alert-success';
                feedback.textContent = 'Dokument erfolgreich eingefügt!';
                
                insertResult.innerHTML = '';
                insertResult.appendChild(feedback);

                // Update query results if visible
                executeQueryBtn.click();
            } catch (error) {
                const feedback = document.createElement('div');
                feedback.className = 'alert alert-danger';
                feedback.textContent = `Fehler: ${error.message}`;
                
                insertResult.innerHTML = '';
                insertResult.appendChild(feedback);
            }
        });
    }

    // Query Execution Functionality
    const executeQueryBtn = document.getElementById('executeQuery');
    const queryResult = document.getElementById('queryResult');
    const queryInput = document.getElementById('queryInput');

    if (executeQueryBtn) {
        executeQueryBtn.addEventListener('click', function() {
            try {
                const query = JSON.parse(queryInput.value);
                const results = mongoDb.users.filter(user => {
                    // Simple query parser
                    return Object.entries(query).every(([key, value]) => {
                        if (typeof value === 'object') {
                            // Handle MongoDB-like operators
                            if ('$gt' in value) {
                                return user[key] > value.$gt;
                            } else if ('$lt' in value) {
                                return user[key] < value.$lt;
                            } else if ('$in' in value) {
                                return value.$in.includes(user[key]);
                            }
                        }
                        return user[key] === value;
                    });
                });

                queryResult.innerHTML = `<pre>${JSON.stringify(results, null, 2)}</pre>`;
            } catch (error) {
                queryResult.innerHTML = `<div class="alert alert-danger">Fehler: ${error.message}</div>`;
            }
        });
    }

    // Challenge Functionality
    const checkChallenge = document.getElementById('checkChallenge');
    const challengeInput = document.getElementById('challengeInput');
    const challengeResult = document.getElementById('challengeResult');

    if (checkChallenge) {
        checkChallenge.addEventListener('click', function() {
            try {
                const query = JSON.parse(challengeInput.value);
                const isCorrect = JSON.stringify(query) === JSON.stringify({
                    "age": { "$gt": 25 },
                    "hobbies": "Programmieren"
                });

                const feedback = document.createElement('div');
                feedback.className = `alert ${isCorrect ? 'alert-success' : 'alert-danger'}`;
                feedback.innerHTML = isCorrect ? 
                    '✅ Richtig! Die Query ist korrekt.' : 
                    '❌ Nicht ganz richtig. Versuche es nochmal!';
                
                challengeResult.innerHTML = '';
                challengeResult.appendChild(feedback);
            } catch (error) {
                challengeResult.innerHTML = `<div class="alert alert-danger">Fehler: ${error.message}</div>`;
            }
        });
    }

    // Modeling Challenge Functionality
    const checkModeling = document.getElementById('checkModeling');
    const modelingInput = document.getElementById('modelingInput');
    const modelingResult = document.getElementById('modelingResult');

    if (checkModeling) {
        checkModeling.addEventListener('click', function() {
            try {
                const model = JSON.parse(modelingInput.value);
                
                // Check if model has required collections
                const hasRequiredCollections = ['users', 'articles', 'comments'].every(
                    collection => model.hasOwnProperty(collection)
                );

                // Check if collections have required fields
                const hasRequiredFields = 
                    model.users && model.users.hasOwnProperty('_id') &&
                    model.articles && model.articles.hasOwnProperty('author_id') &&
                    model.comments && model.comments.hasOwnProperty('article_id');

                const isCorrect = hasRequiredCollections && hasRequiredFields;

                const feedback = document.createElement('div');
                feedback.className = `alert ${isCorrect ? 'alert-success' : 'alert-warning'}`;
                feedback.innerHTML = isCorrect ?
                    '✅ Gut gemacht! Dein Datenmodell enthält alle wichtigen Beziehungen.' :
                    '⚠️ Überprüfe, ob du alle Sammlungen (users, articles, comments) und deren Beziehungen definiert hast.';
                
                modelingResult.innerHTML = '';
                modelingResult.appendChild(feedback);
            } catch (error) {
                modelingResult.innerHTML = `<div class="alert alert-danger">Fehler: ${error.message}</div>`;
            }
        });
    }

    // Initialize syntax highlighting
    Prism.highlightAll();
});
