// ============================================================================
// CONFIGURATION
// ============================================================================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxT-6WdCNh-cRtN8g8K7CR28oC1R6YAqAw6bsbkU4FRHNG9BBblHrey3Ia47rmxlYc5yA/exec"; 

// Constants
const COACHES = ['C1', 'C2', 'E1', 'C3', 'C4', 'C5', 'C6', 'C7'];
const AXLES = ['L1', 'R1', 'L2', 'R2', 'L3', 'R3', 'L4', 'R4'];
const STATIONS = {
    "20661": ["SBC", "DWR"],
    "26651": ["SBC", "ERS"]
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
const loadDataBtn = document.getElementById('loadDataBtn');
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
flatpickr("#dateInput", {
    defaultDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: "true",
    theme: "dark"
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

function openDataEntry() {
    hideAllScreens();
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
            renderCharts(result.data);
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
function renderCharts(allData) {
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

    // Create charts for each coach
    COACHES.forEach(coach => {
        // --- 1. Axle Temperatures Chart ---
        const tempContainer = document.createElement('div');
        tempContainer.className = 'chart-container';
        
        const tempTitle = document.createElement('h3');
        tempTitle.className = 'chart-title';
        tempTitle.textContent = `Coach ${coach} - Axle Temperatures`;
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
        diffTitle.textContent = `Coach ${coach} - Axle Differences`;
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
    } else {
        stationSelect.disabled = true;
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

// Generate Coach Accordions
function buildCoachInputs() {
    coachesContainer.innerHTML = '';
    
    COACHES.forEach((coach, coachIndex) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';
        
        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'accordion-header';
        header.innerHTML = `<span>Coach ${coach}</span><span class="accordion-icon">▼</span>`;
        
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

buildCoachInputs();

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
        const urlWithParams = `${WEB_APP_URL}?password=${encodeURIComponent(enteredPassword)}&train=20661`;
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

// Load Existing Data
loadDataBtn.addEventListener('click', async () => {
    const train = trainSelect.value;
    const date = dateInput.value;
    const station = stationSelect.value;
    
    if (!train || !date || !station) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'Please select Train, Station, and Date first!',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--primary)'
        });
        return;
    }
    
    const originalText = loadDataBtn.textContent;
    loadDataBtn.textContent = 'Loading...';
    loadDataBtn.disabled = true;
    updateStatus("Fetching...", "loading");
    
    try {
        const url = `${WEB_APP_URL}?password=${encodeURIComponent(currentPassword)}&train=${train}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.status === "success") {
            currentCachedData = result.data;
            populateFormIfExists(date, station);
            updateStatus("Data Loaded", "online");
        } else if (result.status === "unauthorized") {
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
    } finally {
        loadDataBtn.textContent = originalText;
        loadDataBtn.disabled = false;
    }
});

function populateFormIfExists(dateStr, stationStr) {
    const record = currentCachedData.find(r => 
        String(r.Date).trim() === String(dateStr).trim() && 
        String(r.Station).trim() === String(stationStr).trim()
    );
    
    if (record) {
        document.getElementById('technicianSelect').value = record.Technician || "";
        COACHES.forEach(coach => {
            AXLES.forEach(axle => {
                const key = `${coach}_${axle}`;
                const input = document.querySelector(`input[name="${key}"]`);
                if (input) input.value = record[key] !== undefined ? record[key] : "";
            });
        });
        Swal.fire({
            icon: 'success',
            title: 'Record Found',
            text: 'Existing data has been loaded. You can edit it now.',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--success)'
        });
    } else {
        COACHES.forEach(coach => {
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
            confirmButtonColor: 'var(--primary)'
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
    
    // Calculate Absolute Temperature Differences
    COACHES.forEach(coach => {
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
