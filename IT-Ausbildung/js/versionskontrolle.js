document.addEventListener('DOMContentLoaded', function() {
    // Git Command Simulation
    const gitCommand = document.getElementById('gitCommand');
    const runCommand = document.getElementById('runCommand');
    const commandOutput = document.getElementById('commandOutput');
    const workspaceFiles = document.getElementById('workspaceFiles');

    // Simuliertes Git-Repository
    let gitState = {
        branch: 'main',
        staged: [],
        committed: [],
        branches: ['main'],
        workspaceFiles: [
            { name: 'index.html', status: 'unmodified' },
            { name: 'style.css', status: 'unmodified' }
        ]
    };

    // Git-Befehle Simulation
    const gitCommands = {
        'git status': () => {
            return `Auf Branch ${gitState.branch}\n` +
                   `Unversionierte Dateien:\n` +
                   gitState.workspaceFiles
                       .filter(f => f.status === 'modified')
                       .map(f => `  ${f.name}`)
                       .join('\n');
        },
        'git add': (args) => {
            if (args === '.') {
                gitState.workspaceFiles.forEach(f => {
                    if (f.status === 'modified') {
                        gitState.staged.push(f.name);
                        f.status = 'staged';
                    }
                });
                return 'Alle Änderungen zur Staging-Area hinzugefügt';
            }
            return 'Verwendung: git add <datei> oder git add .';
        },
        'git commit': (args) => {
            if (args.includes('-m')) {
                const message = args.match(/-m "(.+)"/);
                if (message) {
                    gitState.committed = [...gitState.committed, ...gitState.staged];
                    gitState.staged = [];
                    gitState.workspaceFiles.forEach(f => {
                        if (f.status === 'staged') f.status = 'unmodified';
                    });
                    return `[${gitState.branch} ${gitState.committed.length}] ${message[1]}`;
                }
            }
            return 'Verwendung: git commit -m "commit message"';
        },
        'git branch': (args) => {
            if (!args) {
                return gitState.branches.map(b => 
                    `${b === gitState.branch ? '* ' : '  '}${b}`
                ).join('\n');
            }
            if (!gitState.branches.includes(args)) {
                gitState.branches.push(args);
                return `Branch '${args}' erstellt`;
            }
            return `Branch '${args}' existiert bereits`;
        },
        'git checkout': (args) => {
            if (gitState.branches.includes(args)) {
                gitState.branch = args;
                return `Zu Branch '${args}' gewechselt`;
            }
            return `Branch '${args}' nicht gefunden`;
        }
    };

    // Command Execution
    runCommand.addEventListener('click', () => {
        const input = gitCommand.value.trim();
        const [cmd, ...args] = input.split(' ');
        const fullCmd = `${cmd} ${args[0] || ''}`.trim();
        
        let output = 'Unbekannter Befehl';
        
        for (const [command, handler] of Object.entries(gitCommands)) {
            if (input.startsWith(command)) {
                output = handler(args.join(' '));
                break;
            }
        }
        
        commandOutput.textContent = `$ ${input}\n${output}`;
        gitCommand.value = '';
        updateWorkspaceView();
    });

    gitCommand.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            runCommand.click();
        }
    });

    // Branch Management Exercise
    const branchVisualization = document.getElementById('branchVisualization');
    const createBranchBtn = document.getElementById('createBranch');
    const mergeBranchBtn = document.getElementById('mergeBranch');
    const deleteBranchBtn = document.getElementById('deleteBranch');
    const exerciseFeedback = document.getElementById('exerciseFeedback');

    let branchState = {
        branches: ['main'],
        currentBranch: 'main',
        commits: [{
            id: 'initial',
            branch: 'main',
            message: 'Initial commit'
        }]
    };

    function updateBranchVisualization() {
        branchVisualization.innerHTML = '';
        
        // Create SVG container
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '200');
        svg.style.border = '1px solid #dee2e6';
        svg.style.borderRadius = '4px';
        
        // Draw branches
        let y = 30;
        branchState.branches.forEach(branch => {
            // Branch line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '10');
            line.setAttribute('y1', y);
            line.setAttribute('x2', '290');
            line.setAttribute('y2', y);
            line.setAttribute('stroke', branch === branchState.currentBranch ? '#0d6efd' : '#6c757d');
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);
            
            // Branch label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '20');
            text.setAttribute('y', y - 10);
            text.textContent = branch;
            text.style.fontSize = '12px';
            svg.appendChild(text);
            
            y += 50;
        });
        
        branchVisualization.appendChild(svg);
    }

    createBranchBtn.addEventListener('click', () => {
        const branchName = prompt('Geben Sie den Namen des neuen Branches ein:');
        if (branchName && !branchState.branches.includes(branchName)) {
            branchState.branches.push(branchName);
            branchState.currentBranch = branchName;
            updateBranchVisualization();
            exerciseFeedback.textContent = `Branch '${branchName}' erstellt und ausgecheckt`;
            exerciseFeedback.className = 'alert alert-success';
        }
    });

    mergeBranchBtn.addEventListener('click', () => {
        const sourceBranch = branchState.currentBranch;
        if (sourceBranch === 'main') {
            exerciseFeedback.textContent = 'Wählen Sie zuerst einen Feature-Branch aus';
            exerciseFeedback.className = 'alert alert-warning';
            return;
        }
        
        branchState.currentBranch = 'main';
        exerciseFeedback.textContent = `Branch '${sourceBranch}' erfolgreich in main gemerged`;
        exerciseFeedback.className = 'alert alert-success';
        updateBranchVisualization();
    });

    deleteBranchBtn.addEventListener('click', () => {
        const branchToDelete = branchState.currentBranch;
        if (branchToDelete === 'main') {
            exerciseFeedback.textContent = 'Der main-Branch kann nicht gelöscht werden';
            exerciseFeedback.className = 'alert alert-danger';
            return;
        }
        
        const index = branchState.branches.indexOf(branchToDelete);
        if (index > -1) {
            branchState.branches.splice(index, 1);
            branchState.currentBranch = 'main';
            updateBranchVisualization();
            exerciseFeedback.textContent = `Branch '${branchToDelete}' wurde gelöscht`;
            exerciseFeedback.className = 'alert alert-success';
        }
    });

    // Initialize visualizations
    updateBranchVisualization();
    updateWorkspaceView();

    function updateWorkspaceView() {
        workspaceFiles.innerHTML = gitState.workspaceFiles
            .map(f => `<li>
                <i class="fas fa-file-code"></i> 
                ${f.name} 
                ${f.status !== 'unmodified' ? 
                    `<span class="badge bg-${f.status === 'modified' ? 'warning' : 'success'} ms-2">
                        ${f.status}
                    </span>` : 
                    ''}
            </li>`)
            .join('');
    }

    // Simulate file modifications
    setInterval(() => {
        const randomFile = gitState.workspaceFiles[
            Math.floor(Math.random() * gitState.workspaceFiles.length)
        ];
        if (randomFile.status === 'unmodified') {
            randomFile.status = 'modified';
            updateWorkspaceView();
        }
    }, 5000);
});
