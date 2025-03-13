// Globale Variablen
let array = [];
let animationSpeed = 100;
let isAnimating = false;

// Algorithmus-Beschreibungen
const algorithmDescriptions = {
    bubble: {
        name: 'Bubble Sort',
        description: 'Vergleicht benachbarte Elemente und tauscht sie, wenn sie in der falschen Reihenfolge sind.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n)',
        stable: true
    },
    selection: {
        name: 'Selection Sort',
        description: 'Findet das kleinste Element und platziert es an der richtigen Position.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n²)',
        stable: false
    },
    insertion: {
        name: 'Insertion Sort',
        description: 'Baut die sortierte Sequenz ein Element nach dem anderen auf.',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n)',
        stable: true
    },
    quick: {
        name: 'Quick Sort',
        description: 'Teilt das Array anhand eines Pivot-Elements und sortiert die Teilarrays rekursiv.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        bestCase: 'O(n log n)',
        stable: false
    },
    merge: {
        name: 'Merge Sort',
        description: 'Teilt das Array in kleinere Teile und fügt sie sortiert wieder zusammen.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        bestCase: 'O(n log n)',
        stable: true
    },
    heap: {
        name: 'Heap Sort',
        description: 'Verwendet eine Heap-Datenstruktur, um Elemente effizient zu sortieren.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n log n)',
        stable: false
    },
    shell: {
        name: 'Shell Sort',
        description: 'Eine Verbesserung von Insertion Sort, die Elemente in größeren Abständen vergleicht.',
        timeComplexity: 'O(n log² n)',
        spaceComplexity: 'O(1)',
        bestCase: 'O(n log n)',
        stable: false
    },
    counting: {
        name: 'Counting Sort',
        description: 'Ein nicht-vergleichsbasierter Algorithmus, der die Häufigkeit der Elemente zählt.',
        timeComplexity: 'O(n+k)',
        spaceComplexity: 'O(k)',
        bestCase: 'O(n+k)',
        stable: true
    }
};

// DOM-Elemente
document.addEventListener('DOMContentLoaded', () => {
    const visualizationArea = document.getElementById('visualizationArea');
    const generateArrayBtnContainer = document.getElementById('generateArray').parentNode;
    const startSortBtn = document.getElementById('startSort');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const slowModeCheckbox = document.getElementById('slowMode');
    const algorithmInfo = document.getElementById('algorithmInfo');

    // Event Listeners
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group mt-2';
    buttonGroup.innerHTML = `
        <button class="btn btn-outline-primary" id="generateRandom">Zufällige Daten</button>
        <button class="btn btn-outline-primary" id="generateNearlySorted">Fast sortierte Daten</button>
        <button class="btn btn-outline-primary" id="generateReverse">Umgekehrt sortierte Daten</button>
    `;
    
    // Replace the original generate button
    document.getElementById('generateArray').remove();
    generateArrayBtnContainer.insertBefore(buttonGroup, generateArrayBtnContainer.firstChild);

    document.getElementById('generateRandom').addEventListener('click', generateNewArray);
    document.getElementById('generateNearlySorted').addEventListener('click', generateNearlySortedArray);
    document.getElementById('generateReverse').addEventListener('click', generateReverseSortedArray);
    startSortBtn.addEventListener('click', startSorting);
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    slowModeCheckbox.addEventListener('change', () => {
        animationSpeed = slowModeCheckbox.checked ? 500 : 100;
    });

    // Initial Setup
    generateNewArray();
    updateAlgorithmInfo();
});

// Array-Generierung
function generateNewArray() {
    array = [];
    for (let i = 0; i < 30; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray();
    updateAlgorithmInfo();
}

function generateNearlySortedArray() {
    const n = 30;
    array = Array.from({length: n}, (_, i) => i + 1);
    
    // Swap a few random pairs to make it nearly sorted
    for (let i = 0; i < 5; i++) {
        const idx1 = Math.floor(Math.random() * n);
        const idx2 = Math.floor(Math.random() * n);
        [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
    }
    displayArray();
}

function generateReverseSortedArray() {
    const n = 30;
    array = Array.from({length: n}, (_, i) => n - i);
    displayArray();
}

// Array-Visualisierung
function displayArray(comparing = [], swapping = [], sorted = []) {
    const visualizationArea = document.getElementById('visualizationArea');
    visualizationArea.innerHTML = '';
    
    const maxHeight = Math.max(...array) * 2;
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxHeight) * 100}%`;
        bar.style.width = `${100 / array.length}%`;
        
        if (comparing.includes(index)) {
            bar.classList.add('comparing');
        }
        if (swapping.includes(index)) {
            bar.classList.add('swapping');
        }
        if (sorted.includes(index)) {
            bar.classList.add('sorted');
        }
        
        visualizationArea.appendChild(bar);
    });
}

// Algorithmus-Info aktualisieren
function updateAlgorithmInfo() {
    const algorithmSelect = document.getElementById('algorithmSelect');
    const algorithmInfo = document.getElementById('algorithmInfo');
    const selectedAlgorithm = algorithmDescriptions[algorithmSelect.value];

    algorithmInfo.innerHTML = `
        <h6>${selectedAlgorithm.name}</h6>
        <p>${selectedAlgorithm.description}</p>
        <div class="mt-3">
            <span class="badge bg-info me-2">Zeit: ${selectedAlgorithm.timeComplexity}</span>
            <span class="badge bg-warning me-2">Speicher: ${selectedAlgorithm.spaceComplexity}</span>
            <span class="badge bg-success">Bester Fall: ${selectedAlgorithm.bestCase}</span>
        </div>
        <div class="mt-2">
            <span class="badge ${selectedAlgorithm.stable ? 'bg-success' : 'bg-danger'}">
                ${selectedAlgorithm.stable ? 'Stabil' : 'Nicht stabil'}
            </span>
        </div>
    `;
}

// Sortierung starten
async function startSorting() {
    if (isAnimating) return;
    isAnimating = true;
    const algorithm = document.getElementById('algorithmSelect').value;
    const startSortBtn = document.getElementById('startSort');
    startSortBtn.disabled = true;

    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        case 'heap':
            await heapSort();
            break;
        case 'shell':
            await shellSort();
            break;
        case 'counting':
            await countingSort();
            break;
    }

    displayArray([], [], [...Array(array.length).keys()]);
    startSortBtn.disabled = false;
    isAnimating = false;
}

// Hilfsfunktionen
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function swap(i, j) {
    await sleep(animationSpeed);
    [array[i], array[j]] = [array[j], array[i]];
    displayArray([], [i, j]);
}

// Implementierung der Sortieralgorithmen
async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            displayArray([j, j + 1]);
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
        displayArray([], [], [n - i - 1]);
    }
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            displayArray([minIdx, j]);
            await sleep(animationSpeed / 2);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
        displayArray([], [], [...Array(i + 1).keys()]);
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        displayArray([i]);
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            displayArray([j, j + 1]);
            await sleep(animationSpeed);
            j--;
        }
        array[j + 1] = key;
        displayArray([], [], [...Array(i + 1).keys()]);
    }
}

async function quickSort(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        displayArray([j, high]);
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }
    await swap(i + 1, high);
    return i + 1;
}

async function mergeSort(l, r) {
    if (l < r) {
        const m = Math.floor((l + r) / 2);
        await mergeSort(l, m);
        await mergeSort(m + 1, r);
        await merge(l, m, r);
    }
}

async function merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = array.slice(l, m + 1);
    const R = array.slice(m + 1, r + 1);
    
    let i = 0, j = 0, k = l;
    
    while (i < n1 && j < n2) {
        displayArray([l + i, m + 1 + j]);
        await sleep(animationSpeed);
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        k++;
        displayArray();
    }
    
    while (i < n1) {
        array[k] = L[i];
        i++;
        k++;
        displayArray();
        await sleep(animationSpeed / 2);
    }
    
    while (j < n2) {
        array[k] = R[j];
        j++;
        k++;
        displayArray();
        await sleep(animationSpeed / 2);
    }
}

// Heap Sort Implementation
async function heapSort() {
    async function heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && array[left] > array[largest]) {
            largest = left;
        }

        if (right < n && array[right] > array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            displayArray([i, largest]);
            await swap(i, largest);
            await heapify(n, largest);
        }
    }

    const n = array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        await swap(0, i);
        displayArray([], [], [i]);
        await heapify(i, 0);
    }
}

// Shell Sort Implementation
async function shellSort() {
    const n = array.length;
    
    // Start with a big gap, then reduce the gap
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
        // Do a gapped insertion sort
        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j;
            
            displayArray([i, i-gap]);
            await sleep(animationSpeed);
            
            for (j = i; j >= gap && array[j-gap] > temp; j -= gap) {
                array[j] = array[j-gap];
                displayArray([j, j-gap]);
                await sleep(animationSpeed);
            }
            array[j] = temp;
        }
        // Mark sorted elements for this gap
        displayArray([], [], Array.from({length: gap}, (_, i) => i));
    }
}

// Counting Sort Implementation
async function countingSort() {
    const n = array.length;
    const max = Math.max(...array);
    const min = Math.min(...array);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(n);
    
    // Store count of each element
    for (let i = 0; i < n; i++) {
        count[array[i] - min]++;
        displayArray([i]);
        await sleep(animationSpeed);
    }
    
    // Modify count array to contain actual positions
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
        output[count[array[i] - min] - 1] = array[i];
        count[array[i] - min]--;
        displayArray([i]);
        await sleep(animationSpeed);
    }
    
    // Copy output array to original array
    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        displayArray([], [i], Array.from({length: i}, (_, idx) => idx));
        await sleep(animationSpeed);
    }
}

// Quiz-Funktionalität
document.addEventListener('DOMContentLoaded', () => {
    const checkQuizBtn = document.getElementById('checkQuiz');
    if (checkQuizBtn) {
        checkQuizBtn.addEventListener('click', () => {
            const answer = document.querySelector('input[name="q1"]:checked');
            if (!answer) {
                alert('Bitte wählen Sie eine Antwort aus!');
                return;
            }

            const isCorrect = answer.value === 'insertion';
            alert(isCorrect ? 
                'Richtig! Insertion Sort ist optimal für fast sortierte Arrays.' : 
                'Leider falsch. Insertion Sort wäre die beste Wahl für fast sortierte Arrays.');
        });
    }
});

// Implementierungsaufgabe
document.addEventListener('DOMContentLoaded', () => {
    const checkImplementationBtn = document.getElementById('checkImplementation');
    if (checkImplementationBtn) {
        checkImplementationBtn.addEventListener('click', () => {
            const code = document.getElementById('implementationInput').value;
            const result = document.getElementById('implementationResult');
            
            try {
                // Sicheres Eval des Codes durch Funktion-Wrapping
                const selectionSort = new Function('arr', code);
                
                // Test mit verschiedenen Arrays
                const testArrays = [
                    [64, 34, 25, 12, 22, 11, 90],
                    [1, 2, 3, 4, 5],
                    [5, 4, 3, 2, 1]
                ];
                
                let allTestsPassed = true;
                let output = '';
                
                testArrays.forEach((arr, index) => {
                    const original = [...arr];
                    const sorted = selectionSort([...arr]);
                    const expected = [...arr].sort((a, b) => a - b);
                    
                    const passed = JSON.stringify(sorted) === JSON.stringify(expected);
                    allTestsPassed &= passed;
                    
                    output += `Test ${index + 1}: ${passed ? '✅' : '❌'}\n`;
                    output += `Input: [${original}]\n`;
                    output += `Output: [${sorted}]\n`;
                    output += `Expected: [${expected}]\n\n`;
                });
                
                result.innerHTML = `<pre class="bg-light p-3 rounded">${output}</pre>`;
                if (allTestsPassed) {
                    result.innerHTML += '<div class="alert alert-success">Alle Tests bestanden! Gut gemacht!</div>';
                } else {
                    result.innerHTML += '<div class="alert alert-warning">Einige Tests sind fehlgeschlagen. Überprüfen Sie Ihre Implementierung.</div>';
                }
                
            } catch (error) {
                result.innerHTML = `<div class="alert alert-danger">Fehler: ${error.message}</div>`;
            }
        });
    }
});
