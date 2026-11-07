// ============================================================================
// CONFIGURATION
// ============================================================================
const OLD_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxT-6WdCNh-cRtN8g8K7CR28oC1R6YAqAw6bsbkU4FRHNG9BBblHrey3Ia47rmxlYc5yA/exec";
const NEW_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzJmNFmQddCZpDBEWWJB2f4oorGghmZ4hEifcGwqUpMR0lrRjGvx1QlMy2mFnEEF-scYQ/exec";
const IC2006_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxUacggoRnVVnpsQik52XBaMv9Aj9X1Fdw5f7rbK-bjsqrcmZR7vDsMnZIwfJU_zsPbuQ/exec"; // Update this with the IC2006 script deployed Web App URL
const ARRIVAL_REPORT_WEB_APP_URL = OLD_WEB_APP_URL; // Google Apps Script Web App URL for Arrival Report

function getWebAppUrl(train) {
    if (train === "IC2006") return IC2006_WEB_APP_URL;
    return train === "IC2059" ? NEW_WEB_APP_URL : OLD_WEB_APP_URL;
}

// Constants
const TRAIN_COACHES = {
    "IC2021": ['c1 235363', 'c2 235381', 'e1 235394', 'c3 235382', 'c4 235383', 'c5 235393', 'c6 235384', 'c7 235364'],
    "IC2058": ['c1 241554', 'c2 241574', 'e1 241608', 'c3 241576', 'c4 241575', 'c5 241609', 'c6 241577', 'c7 241555'],
    "IC2059": ['C1 241556', 'C2 241578', 'E1 241610', 'C3 241580', 'C4 241579', 'C5 241611', 'C6 241581', 'C7 241557'],
    "IC2029": ['c1 235565', 'c2 235567', 'e1 235571', 'c3 235569', 'c4 235568', 'c5 235572', 'c6 235570', 'c7 235566'],
    "IC2008": ['c1 235049', 'c2 235057', 'c3 235061', 'c4 235056', 'c5 235055', 'c6 235060', 'c7 235054', 'e1 231078', 'e2 231077', 'c8 235053', 'c9 235059', 'c10 235052', 'c11 235051', 'c12 235058', 'c13 235050', 'c14 235048'],
    "IC2006": ['c14 235002', 'c13 235010', 'c12 235014', 'c11 235009', 'c10 235008', 'c9 235013', 'c8 235007', 'e2 231003', 'e1 231002', 'c7 235006', 'c6 235012', 'c5 235005', 'c4 235004', 'c3 235011', 'c2 235003', 'c1 235001'],
    "IC2015": ['C1', 'C2', 'E1', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']
};
const AXLES = ['L1', 'R1', 'L2', 'R2', 'L3', 'R3', 'L4', 'R4'];
const STATIONS = {
    "IC2021": ["SBC", "DWR"],
    "IC2058": ["SBC", "ERS"],
    "IC2059": ["MYS", "MAS"],
    "IC2029": ["SBC", "DWR"],
    "IC2008": ["SBC", "ERS"],
    "IC2006": ["KCG", "YPR"]
};
const TOKENS = {
    "IC2021": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2058": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2059": ["T59", "K69", "K65", "T26", "T30", "T40", "T38", "T87", "T140", "T123", "T118", "T131", "K356", "T171", "T166", "K439", "K447", "K398"],
    "IC2029": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2008": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2006": ["KCG staff"]
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
const arrivalReportScreen = document.getElementById('arrivalReportScreen');

const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
const passwordError = document.getElementById('passwordError');

const form = document.getElementById('dataForm');
const trainSelect = document.getElementById('trainSelect');
const stationSelect = document.getElementById('stationSelect');
const technicianSelect = document.getElementById('technicianSelect');
const dateInput = document.getElementById('dateInput');
const coachesContainer = document.getElementById('coachesContainer');
const submitBtn = document.getElementById('submitBtn');
const statusIndicator = document.getElementById('status');

// Arrival Report Elements
const arrivalForm = document.getElementById('arrivalForm');
const arrivalSubmitBtn = document.getElementById('arrivalSubmitBtn');
const arrivalStatus = document.getElementById('arrivalStatus');
const arrivalDateInput = document.getElementById('arrivalDateInput');
const arrivalRakeSelect = document.getElementById('arrivalRakeSelect');
const arrivalTrainSelect = document.getElementById('arrivalTrainSelect');
const arrivalOtherTrainGroup = document.getElementById('arrivalOtherTrainGroup');
const arrivalOtherTrainInput = document.getElementById('arrivalOtherTrainInput');
const arrivalEnteredBy = document.getElementById('arrivalEnteredBy');
const arrivalLoadBtn = document.getElementById('arrivalLoadBtn');
const arrivalLoadStatus = document.getElementById('arrivalLoadStatus');

const defectsContainer = document.getElementById('defectsContainer');
const addDefectBtn = document.getElementById('addDefectBtn');
const railMadadContainer = document.getElementById('railMadadContainer');
const addRailMadadBtn = document.getElementById('addRailMadadBtn');
const detentionsContainer = document.getElementById('detentionsContainer');
const addDetentionBtn = document.getElementById('addDetentionBtn');

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
    maxDate: "today",
    onChange: function (selectedDates, dateStr, instance) {
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

// Initialize Calendar for Arrival Report
const arrivalDatePicker = flatpickr("#arrivalDateInput", {
    dateFormat: "Y-m-d",
    defaultDate: "today",
    disableMobile: "true",
    theme: "dark",
    maxDate: "today"
});

// Navigation Functions
function hideAllScreens() {
    passwordModal.style.display = 'none';
    menuScreen.style.display = 'none';
    dataEntryScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
    if (arrivalReportScreen) arrivalReportScreen.style.display = 'none';
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
    technicianSelect.innerHTML = '<option value="">-- Select Token --</option>';
    technicianSelect.disabled = true;
    updateStatus("", "");
}

// Calculation of detention duration
function calculateDetentionDuration(fromStr, toStr) {
    if (!fromStr || !toStr) return '';
    const [h1, m1] = fromStr.split(':').map(Number);
    const [h2, m2] = toStr.split(':').map(Number);
    if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return '';

    let diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Crosses midnight
    }

    if (diffMinutes === 0) return '0 mins';
    if (diffMinutes < 60) return `${diffMinutes} mins`;
    
    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return mins > 0 ? `${hrs} hr ${mins} mins` : `${hrs} hr`;
}

// ============================================================================
// DYNAMIC DROPDOWN DATA MANAGEMENT (READ FROM "drop down data" GOOGLE SHEET)
// ============================================================================
const DEFAULT_DROPDOWN_DATA = {
    trainNos: ["26651/2", "20661/2", "20607/8", "20641/2", "20663/4", "20703/4"],
    rakeNos: ["IC2008", "IC2015", "IC2021", "IC2058", "IC2059", "IC2029", "IC2006"],
    mainCategories: [
        "Coach Cleanliness & Maintenance",
        "Water Availability",
        "Staff Behavior",
        "Corruption & Bribery",
        "miscellaneous"
    ],
    subCategories: [
        "Broken / Missing Toilet Fittings",
        "Tap Leaking / Tap Not Working:",
        "Window / Door Locking System Broken:",
        "Window / Seat Broken:",
        "Jerks / Abnormal Sound:",
        "Others:",
        "Toilets:",
        "Washbasins:",
        "Coach Interior",
        "Coach Exterior",
        "Cockroach / Rodent"
    ]
};

let cachedDropdownData = (() => {
    try {
        const saved = localStorage.getItem('app_dropdown_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.trainNos) && Array.isArray(parsed.rakeNos) &&
                Array.isArray(parsed.mainCategories) && Array.isArray(parsed.subCategories)) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Could not read cached dropdown data:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DROPDOWN_DATA));
})();

function isCustomSubCategory(val) {
    if (!val) return false;
    const clean = String(val).replace(/:$/, '').trim().toLowerCase();
    const list = (cachedDropdownData.subCategories && cachedDropdownData.subCategories.length > 0)
        ? cachedDropdownData.subCategories
        : DEFAULT_DROPDOWN_DATA.subCategories;
    return !list.some(s => String(s).replace(/:$/, '').trim().toLowerCase() === clean);
}

function buildMainCategoryOptions(selected = '') {
    let html = '<option value="">-- Select Main Category --</option>';
    let found = false;
    const list = (cachedDropdownData.mainCategories && cachedDropdownData.mainCategories.length > 0)
        ? cachedDropdownData.mainCategories
        : DEFAULT_DROPDOWN_DATA.mainCategories;

    list.forEach(cat => {
        const isSel = (cat.trim().toLowerCase() === (selected || '').trim().toLowerCase());
        if (isSel) found = true;
        html += `<option value="${cat}" ${isSel ? 'selected' : ''}>${cat}</option>`;
    });

    if (selected && !found) {
        html += `<option value="${selected}" selected>${selected}</option>`;
    }
    return html;
}

function buildSubCategoryOptions(selected = '') {
    let html = '<option value="">-- Select Sub Category --</option>';
    let found = false;
    const list = (cachedDropdownData.subCategories && cachedDropdownData.subCategories.length > 0)
        ? cachedDropdownData.subCategories
        : DEFAULT_DROPDOWN_DATA.subCategories;

    list.forEach(sub => {
        const clean = sub.replace(/:$/, '').trim();
        const isSel = (clean.toLowerCase() === (selected || '').trim().toLowerCase() ||
                       sub.trim().toLowerCase() === (selected || '').trim().toLowerCase());
        if (isSel) found = true;
        html += `<option value="${clean}" ${isSel ? 'selected' : ''}>${clean}</option>`;
    });

    const isCustom = selected && !found && selected !== 'Other' && selected !== 'Others:';
    if (isCustom) {
        html += `<option value="${selected}" selected>${selected}</option>`;
        found = true;
    }
    html += `<option value="Other" ${(!found && selected) || selected === 'Other' || selected === 'Others:' ? 'selected' : ''}>Other (Type custom)</option>`;
    return html;
}

function populateArrivalDropdowns() {
    if (arrivalRakeSelect) {
        const currentRake = arrivalRakeSelect.value;
        const rakes = (cachedDropdownData.rakeNos && cachedDropdownData.rakeNos.length > 0)
            ? cachedDropdownData.rakeNos
            : DEFAULT_DROPDOWN_DATA.rakeNos;

        let html = '<option value="">-- Select Rake --</option>';
        rakes.forEach(r => {
            const sel = (r === currentRake) ? 'selected' : '';
            html += `<option value="${r}" ${sel}>${r}</option>`;
        });
        if (currentRake && !rakes.includes(currentRake)) {
            html += `<option value="${currentRake}" selected>${currentRake}</option>`;
        }
        arrivalRakeSelect.innerHTML = html;
        if (currentRake) arrivalRakeSelect.value = currentRake;
    }

    if (arrivalTrainSelect) {
        const currentTrain = arrivalTrainSelect.value;
        const trains = (cachedDropdownData.trainNos && cachedDropdownData.trainNos.length > 0)
            ? cachedDropdownData.trainNos
            : DEFAULT_DROPDOWN_DATA.trainNos;

        let html = '<option value="">-- Select Train No --</option>';
        let found = false;
        trains.forEach(t => {
            const sel = (t === currentTrain) ? 'selected' : '';
            if (sel) found = true;
            html += `<option value="${t}" ${sel}>${t}</option>`;
        });
        if (currentTrain && !found && currentTrain !== 'Other') {
            html += `<option value="${currentTrain}" selected>${currentTrain}</option>`;
        }
        html += `<option value="Other" ${currentTrain === 'Other' ? 'selected' : ''}>Other (Enter custom)</option>`;
        arrivalTrainSelect.innerHTML = html;
        if (currentTrain) arrivalTrainSelect.value = currentTrain;
    }
}

function refreshRailMadadDropdowns() {
    if (!railMadadContainer) return;
    railMadadContainer.querySelectorAll('.entry-card').forEach(card => {
        const mainSel = card.querySelector('.rm-main-category');
        if (mainSel) {
            const currentMain = mainSel.value;
            mainSel.innerHTML = buildMainCategoryOptions(currentMain);
            if (currentMain) mainSel.value = currentMain;
        }
        const subSel = card.querySelector('.rm-sub-category');
        const subCustom = card.querySelector('.rm-sub-category-custom');
        if (subSel) {
            const currentSub = (subSel.value === 'Other' && subCustom) ? subCustom.value : subSel.value;
            const isCustom = isCustomSubCategory(currentSub);
            subSel.innerHTML = buildSubCategoryOptions(isCustom ? 'Other' : currentSub);
            if (isCustom && currentSub) {
                subSel.value = 'Other';
                if (subCustom) {
                    subCustom.style.display = 'block';
                    subCustom.value = currentSub;
                }
            } else if (currentSub) {
                subSel.value = currentSub;
            }
        }
    });
}

async function fetchDropdownData() {
    if (!currentPassword) return;
    try {
        const targetUrl = ARRIVAL_REPORT_WEB_APP_URL || OLD_WEB_APP_URL;
        const res = await fetch(`${targetUrl}?action=get_dropdown_data&password=${encodeURIComponent(currentPassword)}`);
        const result = await res.json();
        if (result && result.status === "success") {
            let updated = false;
            if (Array.isArray(result.trainNos) && result.trainNos.length > 0) {
                cachedDropdownData.trainNos = result.trainNos;
                updated = true;
            }
            if (Array.isArray(result.rakeNos) && result.rakeNos.length > 0) {
                cachedDropdownData.rakeNos = result.rakeNos;
                updated = true;
            }
            if (Array.isArray(result.mainCategories) && result.mainCategories.length > 0) {
                cachedDropdownData.mainCategories = result.mainCategories;
                updated = true;
            }
            if (Array.isArray(result.subCategories) && result.subCategories.length > 0) {
                cachedDropdownData.subCategories = result.subCategories;
                updated = true;
            }

            if (updated) {
                try {
                    localStorage.setItem('app_dropdown_data', JSON.stringify(cachedDropdownData));
                } catch (e) {
                    console.warn('Failed to save dropdown data to localStorage:', e);
                }
                populateArrivalDropdowns();
                refreshRailMadadDropdowns();
                refreshAllCoachDropdowns();
            }
        }
    } catch (err) {
        console.warn('Failed to fetch dropdown data from sheet:', err);
    }
}

function getCoachesList() {
    const rake = arrivalRakeSelect ? arrivalRakeSelect.value : '';
    if (rake && TRAIN_COACHES[rake]) {
        return TRAIN_COACHES[rake];
    }
    if (rake) {
        return ['C1', 'C2', 'E1', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
    }
    return [];
}

function buildCoachOptions(selectedCoach = '', includeAllOption = false) {
    const coaches = getCoachesList();
    let html = '<option value="">-- Select Coach --</option>';
    if (includeAllOption) {
        const isAllSelected = (selectedCoach === 'Rake / Loco / All') ? 'selected' : '';
        html += `<option value="Rake / Loco / All" ${isAllSelected}>Rake / Loco / All</option>`;
    }
    let found = false;
    coaches.forEach(c => {
        const sel = (c.toLowerCase() === (selectedCoach || '').toLowerCase()) ? 'selected' : '';
        if (sel) found = true;
        html += `<option value="${c}" ${sel}>${c.toUpperCase()}</option>`;
    });
    if (selectedCoach && !found && selectedCoach !== 'Rake / Loco / All') {
        html += `<option value="${selectedCoach}" selected>${selectedCoach.toUpperCase()}</option>`;
    }
    return html;
}

function refreshAllCoachDropdowns() {
    if (!defectsContainer || !railMadadContainer || !detentionsContainer) return;
    defectsContainer.querySelectorAll('.defect-coach-select').forEach(sel => {
        const current = sel.value;
        sel.innerHTML = buildCoachOptions(current);
    });
    railMadadContainer.querySelectorAll('.rm-coach-select').forEach(sel => {
        const current = sel.value;
        sel.innerHTML = buildCoachOptions(current);
    });
    detentionsContainer.querySelectorAll('.detention-coach-select').forEach(sel => {
        const current = sel.value;
        sel.innerHTML = buildCoachOptions(current, true);
    });
}

// Section 1: Defects
function addDefectRow(coach = '', desc = '') {
    if (!defectsContainer) return;
    const row = document.createElement('div');
    row.className = 'defect-row';
    row.innerHTML = `
        <div>
            <select class="defect-coach-select" required>
                ${buildCoachOptions(coach)}
            </select>
        </div>
        <div>
            <input type="text" class="defect-desc-input" placeholder="Enter defect / issue description" value="${desc || ''}" required>
        </div>
        <div>
            <button type="button" class="remove-btn" title="Remove Defect">✕</button>
        </div>
    `;
    row.querySelector('.remove-btn').addEventListener('click', () => {
        row.remove();
        checkDefectsEmpty();
    });
    defectsContainer.appendChild(row);
    checkDefectsEmpty();
}

function checkDefectsEmpty() {
    if (!defectsContainer) return;
    const rows = defectsContainer.querySelectorAll('.defect-row');
    const existingPlaceholder = defectsContainer.querySelector('.empty-placeholder');
    if (rows.length === 0) {
        if (!existingPlaceholder) {
            const ph = document.createElement('div');
            ph.className = 'empty-placeholder';
            ph.textContent = 'No defects added yet. Click "+ Add Defect" below to add.';
            defectsContainer.appendChild(ph);
        }
    } else if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
}

// Section 2: Rail Madad
function addRailMadadCard(data = {}) {
    if (!railMadadContainer) return;
    const index = railMadadContainer.querySelectorAll('.entry-card').length + 1;
    const card = document.createElement('div');
    card.className = 'entry-card';

    const rawSubCat = data.SubCategory || '';
    const isCustomSub = isCustomSubCategory(rawSubCat);

    card.innerHTML = `
        <div class="entry-card-header">
            <span>Rail Madad Complaint #${index}</span>
            <button type="button" class="remove-btn">✕ Remove</button>
        </div>
        <div class="form-row-2">
            <div class="form-group" style="margin-bottom: 0;">
                <label>Coach Number</label>
                <select class="rm-coach-select" required>
                    ${buildCoachOptions(data.CoachNo || '')}
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>RM Reference Number</label>
                <input type="text" class="rm-ref-input" placeholder="e.g. RM-123456" value="${data.RMReferenceNo || ''}" required>
            </div>
        </div>
        <div class="form-row-2">
            <div class="form-group" style="margin-bottom: 0;">
                <label>Complaint Main Category</label>
                <select class="rm-main-category" required>
                    ${buildMainCategoryOptions(data.MainCategory || '')}
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Complaint Sub Category</label>
                <select class="rm-sub-category" required>
                    ${buildSubCategoryOptions(isCustomSub ? 'Other' : rawSubCat)}
                </select>
                <input type="text" class="rm-sub-category-custom" placeholder="Type custom sub category" value="${isCustomSub ? rawSubCat : ''}" style="${isCustomSub ? 'display: block; margin-top: 0.4rem;' : 'display: none; margin-top: 0.4rem;'}">
            </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Complaint Description</label>
            <textarea class="rm-desc-input" rows="2" placeholder="Details of passenger complaint" required>${data.ComplaintDescription || ''}</textarea>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Action Taken Enroute</label>
            <textarea class="rm-action-input" rows="2" placeholder="Action taken by technician / OBHS / crew" required>${data.ActionTaken || ''}</textarea>
        </div>
    `;

    const subSelect = card.querySelector('.rm-sub-category');
    const customInput = card.querySelector('.rm-sub-category-custom');
    subSelect.addEventListener('change', () => {
        if (subSelect.value === 'Other' || subSelect.value === 'Others:') {
            customInput.style.display = 'block';
            customInput.setAttribute('required', 'required');
            customInput.focus();
        } else {
            customInput.style.display = 'none';
            customInput.removeAttribute('required');
            customInput.value = '';
        }
    });

    card.querySelector('.remove-btn').addEventListener('click', () => {
        card.remove();
        renumberCards(railMadadContainer, 'Rail Madad Complaint');
        checkRailMadadEmpty();
    });
    railMadadContainer.appendChild(card);
    checkRailMadadEmpty();
}

function checkRailMadadEmpty() {
    if (!railMadadContainer) return;
    const cards = railMadadContainer.querySelectorAll('.entry-card');
    const existingPlaceholder = railMadadContainer.querySelector('.empty-placeholder');
    if (cards.length === 0) {
        if (!existingPlaceholder) {
            const ph = document.createElement('div');
            ph.className = 'empty-placeholder';
            ph.textContent = 'No Rail Madad complaints logged. Click "+ Add Rail Madad Complaint" if any occurred.';
            railMadadContainer.appendChild(ph);
        }
    } else if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
}

// Section 3: Detentions
function addDetentionCard(data = {}) {
    if (!detentionsContainer) return;
    const index = detentionsContainer.querySelectorAll('.entry-card').length + 1;
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
        <div class="entry-card-header">
            <span>Detention #${index}</span>
            <button type="button" class="remove-btn">✕ Remove</button>
        </div>
        <div class="form-row-2">
            <div class="form-group" style="margin-bottom: 0;">
                <label>Coach Number</label>
                <select class="detention-coach-select" required>
                    ${buildCoachOptions(data.CoachNo || '', true)}
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Station</label>
                <input type="text" class="detention-station" placeholder="e.g. SBC, KPN" value="${data.Station || ''}" required>
            </div>
        </div>
        <div class="form-row-3" style="display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 0.75rem;">
            <div class="form-group" style="margin-bottom: 0;">
                <label>Time From</label>
                <input type="time" class="detention-from" value="${data.TimeFrom || ''}" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Time To</label>
                <input type="time" class="detention-to" value="${data.TimeTo || ''}" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Total Detention</label>
                <input type="text" class="detention-total calculated-input" readonly placeholder="Auto-calculated" value="${data.TotalDetention || ''}">
            </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Issue Description</label>
            <textarea class="detention-desc" rows="2" placeholder="Reason for train detention" required>${data.IssueDescription || ''}</textarea>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Action Taken</label>
            <textarea class="detention-action" rows="2" placeholder="Action taken to rectify and dispatch" required>${data.ActionTaken || ''}</textarea>
        </div>
    `;

    const fromInput = card.querySelector('.detention-from');
    const toInput = card.querySelector('.detention-to');
    const totalInput = card.querySelector('.detention-total');

    const updateCalc = () => {
        totalInput.value = calculateDetentionDuration(fromInput.value, toInput.value);
    };
    fromInput.addEventListener('input', updateCalc);
    toInput.addEventListener('input', updateCalc);
    if (fromInput.value && toInput.value && !totalInput.value) {
        updateCalc();
    }

    card.querySelector('.remove-btn').addEventListener('click', () => {
        card.remove();
        renumberCards(detentionsContainer, 'Detention');
        checkDetentionsEmpty();
    });

    detentionsContainer.appendChild(card);
    checkDetentionsEmpty();
}

function checkDetentionsEmpty() {
    if (!detentionsContainer) return;
    const cards = detentionsContainer.querySelectorAll('.entry-card');
    const existingPlaceholder = detentionsContainer.querySelector('.empty-placeholder');
    if (cards.length === 0) {
        if (!existingPlaceholder) {
            const ph = document.createElement('div');
            ph.className = 'empty-placeholder';
            ph.textContent = 'No train detentions logged. Click "+ Add Detention" if the train was detained.';
            detentionsContainer.appendChild(ph);
        }
    } else if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
}

function renumberCards(container, prefix) {
    if (!container) return;
    const cards = container.querySelectorAll('.entry-card');
    cards.forEach((card, idx) => {
        const titleSpan = card.querySelector('.entry-card-header span');
        if (titleSpan) titleSpan.textContent = `${prefix} #${idx + 1}`;
    });
}

function clearArrivalForm() {
    if (arrivalForm) arrivalForm.reset();
    populateArrivalDropdowns();
    if (arrivalDatePicker) arrivalDatePicker.setDate(new Date());
    if (defectsContainer) defectsContainer.innerHTML = '';
    if (railMadadContainer) railMadadContainer.innerHTML = '';
    if (detentionsContainer) detentionsContainer.innerHTML = '';
    if (arrivalOtherTrainGroup) arrivalOtherTrainGroup.style.display = 'none';
    if (arrivalLoadStatus) {
        arrivalLoadStatus.textContent = 'Select Date & Rake, then click Load to view or edit existing records';
        arrivalLoadStatus.style.color = 'var(--text-muted)';
    }
    checkDefectsEmpty();
    checkRailMadadEmpty();
    checkDetentionsEmpty();
    updateArrivalStatus("Ready to load/submit", "");
}

function openDataEntry() {
    hideAllScreens();
    clearForm();
    dataEntryScreen.style.display = 'flex';
}

function openArrivalReport() {
    hideAllScreens();
    populateArrivalDropdowns();
    clearArrivalForm();
    // Start with 1 empty defect row ready for entry
    addDefectRow();
    if (arrivalReportScreen) arrivalReportScreen.style.display = 'flex';
    window.scrollTo(0, 0);
    fetchDropdownData();
}

function updateArrivalStatus(text, type) {
    if (!arrivalStatus) return;
    arrivalStatus.textContent = text;
    arrivalStatus.className = `status-indicator ${type}`;
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
        const url = `${getWebAppUrl(train)}?password=${encodeURIComponent(currentPassword)}&train=${train}`;
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

    // Filter last 7 days from the latest entry and sort chronologically
    let latestDate = null;
    allData.forEach(row => {
        if (row.Date) {
            const rowDate = new Date(row.Date);
            if (!latestDate || rowDate > latestDate) {
                latestDate = rowDate;
            }
        }
    });

    if (!latestDate) {
        latestDate = new Date();
    }

    const sevenDaysAgo = new Date(latestDate);
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
        tempTitle.textContent = `${coach.toUpperCase()} - Axle Temperatures`;
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
        diffTitle.textContent = `${coach.toUpperCase()} - Axle Differences`;
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


// Set up the dynamic station and token dropdown based on train selection
trainSelect.addEventListener('change', (e) => {
    const train = e.target.value;
    stationSelect.innerHTML = '<option value="">-- Select Station --</option>';
    technicianSelect.innerHTML = '<option value="">-- Select Token --</option>';

    if (train && STATIONS[train]) {
        STATIONS[train].forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            stationSelect.appendChild(option);
        });
        stationSelect.disabled = false;

        if (TOKENS[train]) {
            TOKENS[train].forEach(token => {
                const option = document.createElement('option');
                option.value = token;
                option.textContent = token;
                technicianSelect.appendChild(option);
            });
            technicianSelect.disabled = false;
        } else {
            technicianSelect.disabled = true;
        }

        buildCoachInputs(train); // Rebuild coaches based on selected train
    } else {
        stationSelect.disabled = true;
        technicianSelect.disabled = true;
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
        header.innerHTML = `<span>${coach.toUpperCase()}</span><span class="accordion-icon">▼</span>`;

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
        const urlWithParams = `${getWebAppUrl('IC2021')}?password=${encodeURIComponent(enteredPassword)}&train=IC2021`;
        const response = await fetch(urlWithParams);
        const result = await response.json();

        if (result.status === "success") {
            currentPassword = enteredPassword;
            hideAllScreens();
            menuScreen.style.display = 'flex'; // Go to menu instead of data entry
            fetchDropdownData(); // Sync latest dropdown data from Google Sheets in background
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
        const url = `${getWebAppUrl(train)}?password=${encodeURIComponent(currentPassword)}&train=${train}`;
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
            validationError = `${coach.toUpperCase()} is incomplete. You entered ${filledCount} out of 8 axle temperatures. Please complete all 8 readings.`;
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
        const response = await fetch(getWebAppUrl(train), {
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

// ============================================================================
// ARRIVAL REPORT EVENT LISTENERS
// ============================================================================

// When Rake changes, refresh coach dropdowns in all dynamic cards & suggest default train
if (arrivalRakeSelect) {
    arrivalRakeSelect.addEventListener('change', () => {
        const selectedRake = arrivalRakeSelect.value;
        refreshAllCoachDropdowns();

        const defaultTrains = {
            "IC2021": "20661",
            "IC2058": "26651",
            "IC2059": "20607",
            "IC2029": "20661",
            "IC2008": "26651",
            "IC2006": "20703"
        };
        if (defaultTrains[selectedRake] && !arrivalTrainSelect.value) {
            arrivalTrainSelect.value = defaultTrains[selectedRake];
        }
    });
}

// Toggle "Other" custom train number field
if (arrivalTrainSelect) {
    arrivalTrainSelect.addEventListener('change', () => {
        if (arrivalTrainSelect.value === 'Other') {
            arrivalOtherTrainGroup.style.display = 'block';
            arrivalOtherTrainInput.setAttribute('required', 'required');
            arrivalOtherTrainInput.focus();
        } else {
            arrivalOtherTrainGroup.style.display = 'none';
            arrivalOtherTrainInput.removeAttribute('required');
            arrivalOtherTrainInput.value = '';
        }
    });
}

// Add row buttons
if (addDefectBtn) {
    addDefectBtn.addEventListener('click', () => {
        addDefectRow();
    });
}

if (addRailMadadBtn) {
    addRailMadadBtn.addEventListener('click', () => {
        addRailMadadCard();
    });
}

if (addDetentionBtn) {
    addDetentionBtn.addEventListener('click', () => {
        addDetentionCard();
    });
}

// Load Existing Report Button
if (arrivalLoadBtn) {
    arrivalLoadBtn.addEventListener('click', async () => {
        if (!currentPassword) {
            handleSessionExpired();
            return;
        }

        const date = arrivalDateInput.value.trim();
        const rake = arrivalRakeSelect.value;
        const train = arrivalTrainSelect.value;

        if (!date || !rake) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Date or Rake',
                text: 'Please select both Date and Rake Number before loading.',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: 'var(--primary)'
            });
            return;
        }

        const btnText = arrivalLoadBtn.querySelector('span');
        const spinner = arrivalLoadBtn.querySelector('.spinner');
        arrivalLoadBtn.disabled = true;
        btnText.textContent = 'Loading...';
        spinner.classList.remove('hidden');
        arrivalLoadStatus.textContent = 'Checking for existing records in Google Sheets...';
        arrivalLoadStatus.style.color = '#38bdf8';

        try {
            const targetUrl = ARRIVAL_REPORT_WEB_APP_URL || getWebAppUrl(rake);
            const url = `${targetUrl}?action=get_arrival_report&password=${encodeURIComponent(currentPassword)}&date=${encodeURIComponent(date)}&rake=${encodeURIComponent(rake)}&train=${encodeURIComponent(train)}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.status === 'unauthorized') {
                handleSessionExpired();
                return;
            }

            if (result.status === 'success' && result.found) {
                // Populate basic details
                if (result.basic) {
                    if (result.basic.DataEnteredBy) arrivalEnteredBy.value = result.basic.DataEnteredBy;
                    if (result.basic.TrainNo) {
                        arrivalTrainSelect.value = result.basic.TrainNo;
                        if (!arrivalTrainSelect.value) {
                            let match = Array.from(arrivalTrainSelect.options).find(opt => opt.value && (opt.value.includes(result.basic.TrainNo) || result.basic.TrainNo.includes(opt.value)));
                            if (match && match.value !== 'Other') {
                                arrivalTrainSelect.value = match.value;
                            } else {
                                arrivalTrainSelect.value = 'Other';
                                arrivalOtherTrainGroup.style.display = 'block';
                                arrivalOtherTrainInput.value = result.basic.TrainNo;
                            }
                        }
                    }
                }

                // Populate Section 1: Defects
                defectsContainer.innerHTML = '';
                if (result.defects && result.defects.length > 0) {
                    result.defects.forEach(d => {
                        if (d.CoachNo !== 'NIL' || result.defects.length > 1) {
                            addDefectRow(d.CoachNo, d.IssueDescription);
                        }
                    });
                }
                checkDefectsEmpty();

                // Populate Section 2: Rail Madad
                railMadadContainer.innerHTML = '';
                if (result.railMadad && result.railMadad.length > 0) {
                    result.railMadad.forEach(rm => {
                        addRailMadadCard(rm);
                    });
                }
                checkRailMadadEmpty();

                // Populate Section 3: Detentions
                detentionsContainer.innerHTML = '';
                if (result.detentions && result.detentions.length > 0) {
                    result.detentions.forEach(dt => {
                        addDetentionCard(dt);
                    });
                }
                checkDetentionsEmpty();

                arrivalLoadStatus.textContent = `Loaded existing report for ${rake} on ${date}. You can edit and re-save.`;
                arrivalLoadStatus.style.color = 'var(--success)';
                updateArrivalStatus('Existing report loaded', 'online');

                Swal.fire({
                    icon: 'info',
                    title: 'Report Loaded',
                    text: `Existing report found for ${rake} on ${date}. You can review or edit details and click Save.`,
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    confirmButtonColor: 'var(--primary)'
                });
            } else {
                // No prior report found
                arrivalLoadStatus.textContent = `No existing report found for ${rake} on ${date}. You can enter new details.`;
                arrivalLoadStatus.style.color = 'var(--text-muted)';
                updateArrivalStatus('Ready to submit new report', '');

                // Ensure at least 1 defect row is open
                if (defectsContainer.querySelectorAll('.defect-row').length === 0) {
                    addDefectRow();
                }

                Swal.fire({
                    icon: 'info',
                    title: 'No Prior Report Found',
                    text: `No report exists yet for ${rake} on ${date}. You can enter new records below.`,
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    confirmButtonColor: 'var(--primary)'
                });
            }
        } catch (err) {
            console.error(err);
            arrivalLoadStatus.textContent = 'Failed to load report from server. You can still enter new data.';
            arrivalLoadStatus.style.color = 'var(--error)';
        } finally {
            arrivalLoadBtn.disabled = false;
            btnText.textContent = '🔍 Load Report';
            spinner.classList.add('hidden');
        }
    });
}

// Handle Arrival Report Submission (Syncs to 3 sheets: Arrival Report, Rail Madad, Detentions)
if (arrivalForm) {
    arrivalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            handleSessionExpired();
            return;
        }

        const date = arrivalDateInput.value.trim();
        const rakeNo = arrivalRakeSelect.value;
        let trainNo = arrivalTrainSelect.value;
        if (trainNo === 'Other') {
            trainNo = arrivalOtherTrainInput.value.trim();
        }
        const enteredBy = arrivalEnteredBy.value.trim();

        if (!date || !rakeNo || !trainNo || !enteredBy) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Basic Details',
                text: 'Please complete Date, Rake Number, Train Number, and Data Entered By.',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: 'var(--primary)'
            });
            return;
        }

        // Collect Section 1: Defects
        const defectRows = defectsContainer.querySelectorAll('.defect-row');
        const defects = [];
        defectRows.forEach(row => {
            const coach = row.querySelector('.defect-coach-select').value;
            const desc = row.querySelector('.defect-desc-input').value.trim();
            if (coach || desc) {
                defects.push({
                    CoachNo: coach,
                    IssueDescription: desc
                });
            }
        });

        // Collect Section 2: Rail Madad
        const rmCards = railMadadContainer.querySelectorAll('.entry-card');
        const railMadad = [];
        rmCards.forEach(card => {
            const subSelect = card.querySelector('.rm-sub-category');
            const customInput = card.querySelector('.rm-sub-category-custom');
            let subCategoryValue = subSelect ? subSelect.value.trim() : '';
            if ((subCategoryValue === 'Other' || subCategoryValue === 'Others:') && customInput) {
                subCategoryValue = customInput.value.trim() || 'Other';
            }

            railMadad.push({
                CoachNo: card.querySelector('.rm-coach-select').value,
                RMReferenceNo: card.querySelector('.rm-ref-input').value.trim(),
                MainCategory: card.querySelector('.rm-main-category').value,
                SubCategory: subCategoryValue,
                ComplaintDescription: card.querySelector('.rm-desc-input').value.trim(),
                ActionTaken: card.querySelector('.rm-action-input').value.trim()
            });
        });

        // Collect Section 3: Detentions
        const detentionCards = detentionsContainer.querySelectorAll('.entry-card');
        const detentions = [];
        detentionCards.forEach(card => {
            const timeFrom = card.querySelector('.detention-from').value;
            const timeTo = card.querySelector('.detention-to').value;
            const totalDetention = card.querySelector('.detention-total').value || calculateDetentionDuration(timeFrom, timeTo);

            detentions.push({
                CoachNo: card.querySelector('.detention-coach-select').value,
                Station: card.querySelector('.detention-station').value.trim(),
                TimeFrom: timeFrom,
                TimeTo: timeTo,
                TotalDetention: totalDetention,
                IssueDescription: card.querySelector('.detention-desc').value.trim(),
                ActionTaken: card.querySelector('.detention-action').value.trim()
            });
        });

        // Format current timestamp
        const now = new Date();
        const pad = n => String(n).padStart(2, '0');
        const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        const payload = {
            password: currentPassword,
            action: "save_arrival_report",
            train: rakeNo,
            basic: {
                Timestamp: timestamp,
                Date: date,
                RakeNo: rakeNo,
                TrainNo: trainNo,
                DataEnteredBy: enteredBy
            },
            defects: defects,
            railMadad: railMadad,
            detentions: detentions
        };

        const btnText = arrivalSubmitBtn.querySelector('span');
        const spinner = arrivalSubmitBtn.querySelector('.spinner');
        arrivalSubmitBtn.disabled = true;
        btnText.textContent = 'Syncing 3 Sheets...';
        spinner.classList.remove('hidden');
        updateArrivalStatus("Syncing to Arrival Report, Rail Madad & Detentions sheets...", "loading");

        try {
            const targetUrl = ARRIVAL_REPORT_WEB_APP_URL || getWebAppUrl(rakeNo);
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.status === "success") {
                updateArrivalStatus("Saved & Synced", "online");
                Swal.fire({
                    icon: 'success',
                    title: 'Arrival Report Saved!',
                    html: `
                        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                            Successfully synced to all 3 Google Sheets:<br>
                            ✔ <strong>Arrival Report</strong>: ${defects.length} defect(s)<br>
                            ✔ <strong>Rail Madad</strong>: ${railMadad.length} complaint(s)<br>
                            ✔ <strong>Detentions</strong>: ${detentions.length} detention record(s)
                        </div>
                    `,
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    confirmButtonColor: 'var(--success)'
                }).then(() => {
                    clearArrivalForm();
                    backToMenu();
                });
            } else if (result.status === "unauthorized") {
                handleSessionExpired();
            } else {
                throw new Error(result.message || 'Error saving report');
            }
        } catch (error) {
            updateArrivalStatus("Save Failed", "error");
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: error.message,
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: 'var(--error)'
            });
        } finally {
            arrivalSubmitBtn.disabled = false;
            btnText.textContent = '💾 Save Arrival Report (Sync to 3 Sheets)';
            spinner.classList.add('hidden');
        }
    });
}

// Changelog Modal
function showChangelog() {
    Swal.fire({
        title: 'Changelog',
        html: `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">
                <strong>v2.3 (Arrival Report 3-Section Overhaul)</strong><br>
                <ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.5rem;">
                    <li>Load button to retrieve and display existing arrival reports.</li>
                    <li>Section 1: Defects with dynamic coach dropdown & add defect rows.</li>
                    <li>Section 2: Rail Madad Complaints with categories & enroute actions.</li>
                    <li>Section 3: Detentions with auto-calculated duration.</li>
                    <li>Auto-syncs across 3 separate Google Sheets (Arrival Report, Rail Madad, Detentions).</li>
                </ul>
                <strong>v2.1 (PWA Update)</strong><br>
                <ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.5rem;">
                    <li>Progressive Web App (PWA) support added.</li>
                    <li>Installable on Android, iOS, Windows, and macOS.</li>
                    <li>Offline app shell caching via Service Worker.</li>
                    <li>Custom train & thermometer app icons.</li>
                </ul>
                <strong>v2.0</strong><br>
                <ul style="margin-top: 0.5rem; margin-bottom: 1rem; padding-left: 1.5rem;">
                    <li>IC2006 added date - 24/09/2026</li>
                </ul>
                <strong>Older Versions</strong><br>
                <ul style="margin-top: 0.5rem; margin-bottom: 0; padding-left: 1.5rem;">
                    <li>Initial releases and UI updates.</li>
                    <li>Added dashboard charts and security layers.</li>
                </ul>
            </div>
        `,
        background: 'var(--surface)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'Close',
        width: '400px'
    });
}

// ============================================================================
// PWA & SERVICE WORKER REGISTRATION
// ============================================================================
let deferredInstallPrompt = null;
const installAppBtn = document.getElementById('installAppBtn');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('[PWA] Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.warn('[PWA] Service Worker registration failed:', error);
            });
    });
}

// Capture beforeinstallprompt for install button
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installAppBtn) {
        installAppBtn.style.display = 'flex';
    }
});

if (installAppBtn) {
    installAppBtn.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log(`[PWA] Install prompt outcome: ${outcome}`);
        deferredInstallPrompt = null;
        installAppBtn.style.display = 'none';
    });
}

window.addEventListener('appinstalled', () => {
    console.log('[PWA] App successfully installed');
    if (installAppBtn) {
        installAppBtn.style.display = 'none';
    }
});

// Network status listeners
window.addEventListener('offline', () => {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'You are currently offline',
            text: 'Cached app shell is available. Sync requires connection.',
            showConfirmButton: false,
            timer: 4000,
            background: 'var(--surface)',
            color: 'var(--text-main)'
        });
    }
});

window.addEventListener('online', () => {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Back online',
            showConfirmButton: false,
            timer: 3000,
            background: 'var(--surface)',
            color: 'var(--text-main)'
        });
    }
});

// Initialize dynamic dropdowns from cache/defaults
populateArrivalDropdowns();
