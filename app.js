// ============================================================================
// CONFIGURATION
// ============================================================================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxT-6WdCNh-cRtN8g8K7CR28oC1R6YAqAw6bsbkU4FRHNG9BBblHrey3Ia47rmxlYc5yA/exec"; 

// Constants
const TRAIN_COACHES = {
    "IC2021": ['c1 235363', 'c2 235381', 'e1 235394', 'c3 235382', 'c4 235383', 'c5 235393', 'c6 235384', 'c7 235364'],
    "IC2058": ['c1 241554', 'c2 241574', 'e1 241608', 'c3 241576', 'c4 241575', 'c5 241609', 'c6 241577', 'c7 241555']
};
const AXLES = ['L1', 'R1', 'L2', 'R2', 'L3', 'R3', 'L4', 'R4'];
const STATIONS = {
    "IC2021": ["SBC", "DWR"],
    "IC2058": ["SBC", "ERS"]
};
const COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'
];

// DOM Elements
const passwordModal = document.getElementById('passwordModal');
const menuScreen = document.getElementById('menuScreen');
const dataEntryScreen = document.getElementById('dataEntryScreen');
const dashboardScreen = document.getElementById('dashboardScreen');

const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
const passwordError = document.getElementById('passwordError');

const form = document.getElementById('dataForm');
const trainSelect = document.getElementById('trainSelect');
const stationSelect = document.getElementById('stationSelect');
const dateInput = document.getElementById('dateInput');
const coachesContainer = document.getElementById('coachesContainer');
const submitBtn = document.getElementById('submitBtn');
const statusIndicator = document.getElementById('status');

const dashboardTitle = document.getElementById('dashboardTitle');
const dashboardLoading = document.getElementById('dashboardLoading');
const dashboardCharts = document.getElementById('dashboardCharts');

let currentPassword = "";
let currentCachedData = [];
let chartInstances = []; // To track and destroy old charts

// Initialize Calendar
const datePicker = flatpickr("#dateInput", {
    dateFormat: "Y-m-d",
    disableMobile: "true",
    theme: "dark",
    onChange: function(selectedDates, dateStr, instance) {
        if (!dateStr) return;
        const train = trainSelect.value;
        const station = stationSelect.value;
        
        if (!train || !station) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please select Rake Number and Station before selecting the Date.',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: 'var(--primary)',
                returnFocus: false
            });
            instance.clear();
            instance.close();
            document.getElementById('dateInput').blur();
            return;
        }
        
        instance.close();
        document.getElementById('dateInput').blur();
        fetchAndPopulateData(train, station, dateStr);
    }
});

// Navigation Functions
function hideAllScreens() {
    passwordModal.style.display = 'none';
    menuScreen.style.display = 'none';
    dataEntryScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
}

function backToMenu() {
    hideAllScreens();
    menuScreen.style.display = 'flex';
}

function clearForm() {
    form.reset();
    datePicker.clear();
    coachesContainer.innerHTML = '';
    stationSelect.innerHTML = '<option value="">-- Select Station --</option>';
    stationSelect.disabled = true;
    updateStatus("", "");
}

function openDataEntry() {
    hideAllScreens();
    clearForm();
    dataEntryScreen.style.display = 'flex';
}

async function openDashboard(train) {
    hideAllScreens();
    dashboardScreen.style.display = 'flex';
    dashboardTitle.textContent = `${train} Dashboard`;
    dashboardLoading.style.display = 'block';
    dashboardCharts.style.display = 'none';
    dashboardCharts.innerHTML = '';
    
    // Destroy previous charts
    chartInstances.forEach(chart => chart.destroy());
    chartInstances = [];
    
    try {
        const url = `${WEB_APP_URL}?password=${encodeURIComponent(currentPassword)}&train=${train}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.status === "success") {
            renderCharts(result.data, train);
            dashboardLoading.style.display = 'none';
            dashboardCharts.style.display = 'block';
        } else if (result.status === "unauthorized") {
            handleSessionExpired();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        dashboardLoading.innerHTML = `<p style="color: var(--error)">Failed to load data: ${error.message}</p>`;
    }
}

// Chart Generation Logic
function renderCharts(allData, train) {
    if (!allData || allData.length === 0) {
        dashboardCharts.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No data available for this train yet.</p>';
        return;
    }

    // Filter last 7 days and sort chronologically
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let filteredData = allData.filter(row => {
        if (!row.Date) return false;
        const rowDate = new Date(row.Date);
        return rowDate >= sevenDaysAgo;
    });

    // Sort by Date
    filteredData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    if (filteredData.length === 0) {
         dashboardCharts.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No data recorded in the last 7 days.</p>';
         return;
    }

    // X-axis labels: e.g., "2026-06-25" (Multiple entries on the same date will appear as sequential points)
    const labels = filteredData.map(row => row.Date);

    const currentCoaches = TRAIN_COACHES[train] || [];

    // Create charts for each coach
    currentCoaches.forEach(coach => {
        // --- 1. Axle Temperatures Chart ---
        const tempContainer = document.createElement('div');
        tempContainer.className = 'chart-container';
        
        const tempTitle = document.createElement('h3');
        tempTitle.className = 'chart-title';
        tempTitle.textContent = `${coach} - Axle Temperatures`;
        tempContainer.appendChild(tempTitle);

        const tempCanvas = document.createElement('canvas');
        tempContainer.appendChild(tempCanvas);
        dashboardCharts.appendChild(tempContainer);

        // Prepare datasets (8 axles)
        const tempDatasets = AXLES.map((axle, index) => {
            const dataPoints = filteredData.map(row => {
                const val = parseFloat(row[`${coach}_${axle}`]);
                return isNaN(val) ? null : val;
            });
            return {
                label: axle,
                data: dataPoints,
                borderColor: COLORS[index],
                backgroundColor: COLORS[index],
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        });

        // Initialize Chart.js for Temperatures
        const tempChart = new Chart(tempCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: tempDatasets
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(51, 65, 85, 0.5)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(51, 65, 85, 0.5)' },
                        title: {
                            display: true,
                            text: 'Temperature (°C)',
                            color: '#94a3b8'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f8fafc', usePointStyle: true, boxWidth: 8 }
                    }
                }
            }
        });
        
        chartInstances.push(tempChart);

        // --- 2. Axle Differences Chart ---
        const diffContainer = document.createElement('div');
        diffContainer.className = 'chart-container';
        
        const diffTitle = document.createElement('h3');
        diffTitle.className = 'chart-title';
        diffTitle.textContent = `${coach} - Axle Differences`;
        diffContainer.appendChild(diffTitle);

        const diffCanvas = document.createElement('canvas');
        diffContainer.appendChild(diffCanvas);
        dashboardCharts.appendChild(diffContainer);

        // Prepare datasets (4 axle differences)
        const diffDatasets = [1, 2, 3, 4].map((axleNum, index) => {
            const diffKey = `Diff_${coach}_axle${axleNum}`;
            const dataPoints = filteredData.map(row => {
                const val = parseFloat(row[diffKey]);
                return isNaN(val) ? null : val;
            });
            return {
                label: `Diff Axle ${axleNum}`,
                data: dataPoints,
                // Offset colors so they look distinct from the first chart
                borderColor: COLORS[(index + 4) % COLORS.length],
                backgroundColor: COLORS[(index + 4) % COLORS.length],
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        });

        // Initialize Chart.js for Differences
        const diffChart = new Chart(diffCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: diffDatasets
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(51, 65, 85, 0.5)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(51, 65, 85, 0.5)' },
                        title: {
                            display: true,
                            text: 'Difference (°C)',
                            color: '#94a3b8'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f8fafc', usePointStyle: true, boxWidth: 8 }
                    }
                }
            }
        });
        
        chartInstances.push(diffChart);
    });
}


// Set up the dynamic station dropdown based on train selection
trainSelect.addEventListener('change', (e) => {
    const train = e.target.value;
    stationSelect.innerHTML = '<option value="">-- Select Station --</option>';
    
    if (train && STATIONS[train]) {
        STATIONS[train].forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            stationSelect.appendChild(option);
        });
        stationSelect.disabled = false;
        buildCoachInputs(train); // Rebuild coaches based on selected train
    } else {
        stationSelect.disabled = true;
        coachesContainer.innerHTML = '';
    }
});

// Toggle Password Visibility
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordBtn.textContent = 'Hide';
        } else {
            passwordInput.type = 'password';
            togglePasswordBtn.textContent = 'Show';
        }
    });
}

// Validation Colors
function updateInputAlert(input, val, diffExceeded) {
    input.classList.remove('alert-red', 'alert-orange');
    if (!isNaN(val)) {
        if (val > 60 || diffExceeded) {
            input.classList.add('alert-red');
        } else if (val > 50) {
            input.classList.add('alert-orange');
        }
    }
}

function evaluateAxlePair(coach, axleNum) {
    const leftInput = document.querySelector(`input[name="${coach}_L${axleNum}"]`);
    const rightInput = document.querySelector(`input[name="${coach}_R${axleNum}"]`);
    
    if (!leftInput || !rightInput) return;

    const lVal = parseFloat(leftInput.value);
    const rVal = parseFloat(rightInput.value);

    let diffExceeded = false;
    if (!isNaN(lVal) && !isNaN(rVal)) {
        diffExceeded = Math.abs(lVal - rVal) > 10;
    }

    updateInputAlert(leftInput, lVal, diffExceeded);
    updateInputAlert(rightInput, rVal, diffExceeded);
}

// Generate Coach Accordions
function buildCoachInputs(train) {
    coachesContainer.innerHTML = '';
    const currentCoaches = TRAIN_COACHES[train] || [];
    
    currentCoaches.forEach((coach, coachIndex) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        
        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'accordion-header';
        header.innerHTML = `<span>${coach}</span><span class="accordion-icon">▼</span>`;
        
        const content = document.createElement('div');
        content.className = 'accordion-content';
        
        const inner = document.createElement('div');
        inner.className = 'accordion-content-inner';
        
        AXLES.forEach(axle => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = `${axle}`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.1';
            input.name = `${coach}_${axle}`;
            input.placeholder = 'Temp';
            
            input.addEventListener('input', () => {
                const axleNum = axle.substring(1); // extracts 1, 2, 3, or 4
                evaluateAxlePair(coach, axleNum);
            });
            
            group.appendChild(label);
            group.appendChild(input);
            inner.appendChild(group);
        });
        
        content.appendChild(inner);
        item.appendChild(header);
        item.appendChild(content);
        coachesContainer.appendChild(item);
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.accordion-content').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

// Do NOT build initially, wait for train selection
// buildCoachInputs();

// Handle Password Submission
passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const enteredPassword = passwordInput.value;
    
    const btnText = passwordSubmitBtn.querySelector('span');
    const spinner = passwordSubmitBtn.querySelector('.spinner');
    passwordSubmitBtn.disabled = true;
    btnText.textContent = 'Verifying...';
    spinner.classList.remove('hidden');
    passwordError.classList.add('hidden');
    
    try {
        const urlWithParams = `${WEB_APP_URL}?password=${encodeURIComponent(enteredPassword)}&train=IC2021`;
        const response = await fetch(urlWithParams);
        const result = await response.json();
        
        if (result.status === "success") {
            currentPassword = enteredPassword;
            hideAllScreens();
            menuScreen.style.display = 'flex'; // Go to menu instead of data entry
        } else {
            passwordError.textContent = result.message || "Incorrect password. Try again.";
            passwordError.classList.remove('hidden');
        }
    } catch (error) {
        passwordError.textContent = "Network error. Check connection.";
        passwordError.classList.remove('hidden');
    } finally {
        passwordSubmitBtn.disabled = false;
        btnText.textContent = 'Unlock';
        spinner.classList.add('hidden');
    }
});

// Auto Load Existing Data
async function fetchAndPopulateData(train, station, date) {
    Swal.fire({
        title: 'Checking Data...',
        text: 'Looking for existing records...',
        background: 'var(--surface)',
        color: 'var(--text-main)',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    updateStatus("Fetching...", "loading");
    
    try {
        const url = `${WEB_APP_URL}?password=${encodeURIComponent(currentPassword)}&train=${train}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.status === "success") {
            currentCachedData = result.data;
            populateFormIfExists(date, station, train);
            updateStatus("Data Loaded", "online");
            // The success alert inside populateFormIfExists will automatically overwrite the loading Swal
        } else if (result.status === "unauthorized") {
            Swal.close();
            handleSessionExpired();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        updateStatus("Fetch Error", "error");
        Swal.fire({
            icon: 'error',
            title: 'Fetch Failed',
            text: error.message,
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--primary)'
        });
    }
}

function populateFormIfExists(dateStr, stationStr, train) {
    const record = currentCachedData.find(r => 
        String(r.Date).trim() === String(dateStr).trim() && 
        String(r.Station).trim() === String(stationStr).trim()
    );
    
    const currentCoaches = TRAIN_COACHES[train] || [];
    
    if (record) {
        document.getElementById('technicianSelect').value = record.Technician || "";
        currentCoaches.forEach(coach => {
            AXLES.forEach(axle => {
                const key = `${coach}_${axle}`;
                const input = document.querySelector(`input[name="${key}"]`);
                if (input) input.value = record[key] !== undefined ? record[key] : "";
            });
            // Evaluate colors for existing populated data
            [1, 2, 3, 4].forEach(axleNum => evaluateAxlePair(coach, axleNum));
        });
        Swal.fire({
            icon: 'success',
            title: 'Record Found',
            text: 'Existing data has been loaded. You can edit it now.',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--success)',
            returnFocus: false
        });
    } else {
        currentCoaches.forEach(coach => {
            AXLES.forEach(axle => {
                const key = `${coach}_${axle}`;
                const input = document.querySelector(`input[name="${key}"]`);
                if (input) input.value = "";
            });
        });
        Swal.fire({
            icon: 'info',
            title: 'No Record Found',
            text: 'No existing record found for this Date and Station. You can enter new data.',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--primary)',
            returnFocus: false
        });
    }
}

// Handle Form Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentPassword) return;

    const btnText = submitBtn.querySelector('span');
    const spinner = submitBtn.querySelector('.spinner');
    submitBtn.disabled = true;
    btnText.textContent = 'Saving...';
    spinner.classList.remove('hidden');
    
    const formData = new FormData(form);
    const rowData = {};
    formData.forEach((value, key) => {
        rowData[key] = value;
    });

    // ----------------------------------------------------
    // VALIDATION LOGIC
    // ----------------------------------------------------
    let validationError = null;
    let totalFilledCoaches = 0;
    
    const train = trainSelect.value;
    const currentCoaches = TRAIN_COACHES[train] || [];
    
    for (const coach of currentCoaches) {
        let filledCount = 0;
        AXLES.forEach(axle => {
            const val = rowData[`${coach}_${axle}`];
            if (val !== undefined && val.trim() !== "") {
                filledCount++;
            }
        });
        
        // If they started filling out a coach, they MUST complete all 8 axles
        if (filledCount > 0 && filledCount < 8) {
            validationError = `${coach} is incomplete. You entered ${filledCount} out of 8 axle temperatures. Please complete all 8 readings.`;
            break;
        }
        
        if (filledCount === 8) {
            totalFilledCoaches++;
        }
    }
    
    if (!validationError && totalFilledCoaches === 0) {
        validationError = "Please enter temperature data for at least one coach before saving.";
    }

    if (validationError) {
        submitBtn.disabled = false;
        btnText.textContent = 'Save Records';
        spinner.classList.add('hidden');
        
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Data',
            text: validationError,
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--primary)'
        });
        return; // Stop form submission
    }
    // ----------------------------------------------------
    
    // Calculate Absolute Temperature Differences
    currentCoaches.forEach(coach => {
        [1, 2, 3, 4].forEach(axleNum => {
            const leftVal = rowData[`${coach}_L${axleNum}`];
            const rightVal = rowData[`${coach}_R${axleNum}`];
            const diffKey = `Diff_${coach}_axle${axleNum}`;
            
            if (leftVal !== "" && rightVal !== "" && leftVal !== undefined && rightVal !== undefined) {
                const diff = Math.abs(parseFloat(leftVal) - parseFloat(rightVal));
                rowData[diffKey] = diff.toFixed(1); // Keep one decimal place
            } else {
                rowData[diffKey] = ""; // Leave blank if either side is missing
            }
        });
    });
    
    const payload = {
        password: currentPassword,
        train: trainSelect.value,
        rowData: rowData
    };
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        if (result.status === "success") {
            updateStatus("Saved successfully", "online");
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: result.message,
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: 'var(--success)'
            }).then(() => {
                clearForm();
                backToMenu(); // Return to menu after saving
            });
        } else if (result.status === "unauthorized") {
            handleSessionExpired();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        updateStatus("Save Failed", "error");
        Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: error.message,
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--error)'
        });
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Save Records';
        spinner.classList.add('hidden');
    }
});

function handleSessionExpired() {
    currentPassword = "";
    hideAllScreens();
    passwordModal.style.display = 'flex';
    passwordError.textContent = "Session expired or password changed. Please log in again.";
    passwordError.classList.remove('hidden');
}

function updateStatus(text, type) {
    statusIndicator.textContent = text;
    statusIndicator.className = `status-indicator ${type}`;
}
