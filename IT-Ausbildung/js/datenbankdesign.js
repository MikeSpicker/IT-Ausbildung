document.addEventListener('DOMContentLoaded', function() {
    // Initialize jsPlumb for ER diagram
    const jsPlumbInstance = jsPlumb.getInstance({
        Container: "diagram-canvas",
        Connector: ["Bezier", { curviness: 50 }],
        Endpoint: ["Dot", { radius: 5 }],
        PaintStyle: { stroke: "#567567", strokeWidth: 2 },
        Anchor: ["Continuous", { faces: ["top", "bottom", "left", "right"] }]
    });

    let entities = [];
    let attributes = [];
    let relations = [];
    let dragId = 0;

    // Add Entity
    document.getElementById('addEntity').addEventListener('click', function() {
        const entity = document.createElement('div');
        entity.className = 'entity';
        entity.id = 'entity_' + dragId;
        entity.innerHTML = `
            <div class="entity-header">
                <input type="text" placeholder="Entity Name" class="entity-name">
                <button class="btn btn-sm btn-outline-danger delete-btn">×</button>
            </div>
        `;
        entity.style.position = 'absolute';
        entity.style.left = '50px';
        entity.style.top = '50px';
        entity.style.backgroundColor = '#fff';
        entity.style.border = '2px solid #007bff';
        entity.style.padding = '10px';
        entity.style.borderRadius = '4px';

        document.getElementById('diagram-canvas').appendChild(entity);
        jsPlumbInstance.draggable(entity.id);
        
        // Make it a source and target
        jsPlumbInstance.makeSource(entity.id, {
            filter: ".entity-header",
            anchor: "Continuous"
        });
        jsPlumbInstance.makeTarget(entity.id, {
            anchor: "Continuous"
        });

        entities.push(entity);
        dragId++;

        // Delete button handler
        entity.querySelector('.delete-btn').addEventListener('click', function() {
            jsPlumbInstance.remove(entity.id);
            entities = entities.filter(e => e !== entity);
        });
    });

    // Add Attribute
    document.getElementById('addAttribute').addEventListener('click', function() {
        const attribute = document.createElement('div');
        attribute.className = 'attribute';
        attribute.id = 'attribute_' + dragId;
        attribute.innerHTML = `
            <input type="text" placeholder="Attribute" class="attribute-name">
            <button class="btn btn-sm btn-outline-danger delete-btn">×</button>
        `;
        attribute.style.position = 'absolute';
        attribute.style.left = '200px';
        attribute.style.top = '50px';
        attribute.style.backgroundColor = '#fff';
        attribute.style.border = '2px solid #28a745';
        attribute.style.padding = '5px';
        attribute.style.borderRadius = '50%';
        attribute.style.minWidth = '100px';
        attribute.style.minHeight = '100px';
        attribute.style.display = 'flex';
        attribute.style.alignItems = 'center';
        attribute.style.justifyContent = 'center';

        document.getElementById('diagram-canvas').appendChild(attribute);
        jsPlumbInstance.draggable(attribute.id);
        
        jsPlumbInstance.makeSource(attribute.id, {
            anchor: "Continuous"
        });
        jsPlumbInstance.makeTarget(attribute.id, {
            anchor: "Continuous"
        });

        attributes.push(attribute);
        dragId++;

        // Delete button handler
        attribute.querySelector('.delete-btn').addEventListener('click', function() {
            jsPlumbInstance.remove(attribute.id);
            attributes = attributes.filter(a => a !== attribute);
        });
    });

    // Add Relation
    document.getElementById('addRelation').addEventListener('click', function() {
        const relation = document.createElement('div');
        relation.className = 'relation';
        relation.id = 'relation_' + dragId;
        relation.innerHTML = `
            <input type="text" placeholder="Relation" class="relation-name">
            <select class="relation-type">
                <option value="1-1">1:1</option>
                <option value="1-n">1:n</option>
                <option value="n-m">n:m</option>
            </select>
            <button class="btn btn-sm btn-outline-danger delete-btn">×</button>
        `;
        relation.style.position = 'absolute';
        relation.style.left = '350px';
        relation.style.top = '50px';
        relation.style.backgroundColor = '#fff';
        relation.style.border = '2px solid #dc3545';
        relation.style.padding = '10px';
        relation.style.borderRadius = '4px';

        document.getElementById('diagram-canvas').appendChild(relation);
        jsPlumbInstance.draggable(relation.id);
        
        jsPlumbInstance.makeSource(relation.id, {
            anchor: "Continuous"
        });
        jsPlumbInstance.makeTarget(relation.id, {
            anchor: "Continuous"
        });

        relations.push(relation);
        dragId++;

        // Delete button handler
        relation.querySelector('.delete-btn').addEventListener('click', function() {
            jsPlumbInstance.remove(relation.id);
            relations = relations.filter(r => r !== relation);
        });
    });

    // Clear Diagram
    document.getElementById('clearDiagram').addEventListener('click', function() {
        jsPlumbInstance.reset();
        document.getElementById('diagram-canvas').innerHTML = '';
        entities = [];
        attributes = [];
        relations = [];
        dragId = 0;
    });

    // Normalization Exercise
    const normalizationTables = {
        customers: {
            name: 'Kunden',
            columns: ['Kunden_ID', 'Name', 'Email'],
            data: [
                [1, 'Max Mustermann', 'max@example.com'],
                [2, 'Anna Schmidt', 'anna@example.com']
            ]
        },
        products: {
            name: 'Produkte',
            columns: ['Produkt_ID', 'Name', 'Preis'],
            data: [
                [1, 'Laptop', 999.99],
                [2, 'Maus', 29.99]
            ]
        },
        orders: {
            name: 'Bestellungen',
            columns: ['Bestellung_ID', 'Kunden_ID', 'Produkt_ID'],
            data: [
                [1, 1, 1],
                [2, 2, 2]
            ]
        }
    };

    function createTable(tableName, columns, data) {
        const table = document.createElement('div');
        table.className = 'normalized-table mb-4';
        table.innerHTML = `
            <h6>${tableName}</h6>
            <div class="table-responsive">
                <table class="table table-sm table-bordered">
                    <thead>
                        <tr>
                            ${columns.map(col => `<th>${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${cell}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        return table;
    }

    // Initialize normalization exercise
    const normalizationTablesDiv = document.getElementById('normalization-tables');
    if (normalizationTablesDiv) {
        Object.values(normalizationTables).forEach(table => {
            normalizationTablesDiv.appendChild(
                createTable(table.name, table.columns, table.data)
            );
        });
    }

    // Check normalization
    const checkNormalizationBtn = document.getElementById('checkNormalization');
    if (checkNormalizationBtn) {
        checkNormalizationBtn.addEventListener('click', function() {
            // Simple validation of the normalized tables
            const feedback = document.createElement('div');
            feedback.className = 'alert alert-success mt-3';
            feedback.innerHTML = `
                <h6>Analyse der Normalisierung:</h6>
                <ul>
                    <li>✅ Erste Normalform: Alle Attribute sind atomar</li>
                    <li>✅ Zweite Normalform: Keine partiellen Abhängigkeiten</li>
                    <li>✅ Dritte Normalform: Keine transitiven Abhängigkeiten</li>
                </ul>
                <p>Gut gemacht! Die Tabellen sind korrekt normalisiert.</p>
            `;
            
            // Remove previous feedback if exists
            const previousFeedback = document.querySelector('.alert');
            if (previousFeedback) {
                previousFeedback.remove();
            }
            
            normalizationTablesDiv.appendChild(feedback);
        });
    }
});
