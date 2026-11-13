// ============================================================================
// CONFIGURATION
// ============================================================================
const OLD_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzG9U7ml4EihL5qSh-CMbV7VGXMXUzdkqeYy0MXJy21XKSO0_O5_RycGqAbFMBzawJPHg/exec";
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
    "IC2015": ['c14 235292', 'c13 235310', 'c12 235326', 'c11 235309', 'c10 235308', 'c9 235325', 'c8 235307', 'e2 231532', 'e1 231531', 'c7 235306', 'c6 235323', 'c5 235303', 'c4 235304', 'c3 235324', 'c2 235305', 'c1 235391']
};
const AXLES = ['L1', 'R1', 'L2', 'R2', 'L3', 'R3', 'L4', 'R4'];
const STATIONS = {
    "IC2021": ["SBC", "DWR"],
    "IC2058": ["SBC", "ERS"],
    "IC2059": ["MYS", "MAS"],
    "IC2029": ["SBC", "DWR"],
    "IC2008": ["SBC", "ERS"],
    "IC2006": ["KCG", "YPR"],
    "IC2015": ["SBC", "ERS"]
};
const TOKENS = {
    "IC2021": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2058": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2059": ["T59", "K69", "K65", "T26", "T30", "T40", "T38", "T87", "T140", "T123", "T118", "T131", "K356", "T171", "T166", "K439", "K447", "K398"],
    "IC2029": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2008": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"],
    "IC2006": ["KCG staff"],
    "IC2015": ["261", "269", "270", "274", "294", "295", "305", "314", "334", "384", "412", "429", "446", "464", "485", "486", "490", "534", "591", "638", "705", "733", "755", "758", "792", "796", "807", "837", "838", "839", "858", "878", "909", "921", "924", "935", "941", "958", "973", "980", "981", "990", "992"]
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
const arrivalSectionsWrapper = document.getElementById('arrivalSectionsWrapper');

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

// Initialize Calendar for Arrival Report (DD-MM-YYYY format)
const arrivalDatePicker = flatpickr("#arrivalDateInput", {
    dateFormat: "d-m-Y",
    defaultDate: "today",
    disableMobile: "true",
    theme: "dark",
    maxDate: "today",
    onChange: function () {
        if (arrivalSectionsWrapper && arrivalSectionsWrapper.style.display !== 'none') {
            arrivalSectionsWrapper.style.display = 'none';
            if (arrivalLoadStatus) {
                arrivalLoadStatus.textContent = 'Date changed. Click "Load Report" to view or enter data for this date.';
                arrivalLoadStatus.style.color = 'var(--text-muted)';
            }
        }
    }
});

// Navigation Functions
function hideAllScreens() {
    document.body.classList.remove('arrival-report-active');
    passwordModal.style.display = 'none';
    menuScreen.style.display = 'none';
    dataEntryScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
    if (arrivalReportScreen) arrivalReportScreen.style.display = 'none';
    const settingsScreen = document.getElementById('settingsScreen');
    if (settingsScreen) settingsScreen.style.display = 'none';
    const manualsScreen = document.getElementById('manualsScreen');
    if (manualsScreen) manualsScreen.style.display = 'none';
    const pdfOverlay = document.getElementById('pdfViewerOverlay');
    if (pdfOverlay) {
        if (typeof closePdfViewer === 'function') {
            closePdfViewer();
        } else {
            pdfOverlay.style.display = 'none';
            const iframe = document.getElementById('pdfIframe');
            if (iframe) iframe.src = '';
        }
    }
    const genPdfOverlay = document.getElementById('generatedPdfOverlay');
    if (genPdfOverlay) {
        if (typeof closeGeneratedPdfPreview === 'function') {
            closeGeneratedPdfPreview();
        } else {
            genPdfOverlay.style.display = 'none';
        }
    }
}

function backToMenu() {
    hideAllScreens();
    menuScreen.style.display = 'flex';
}

function toggleRakeDashboards() {
    const list = document.getElementById('rakeDashboardsList');
    const chevron = document.getElementById('dashboardsChevron');
    const toggleBtn = document.getElementById('rakeDashboardsBtn');
    if (!list) return;

    const isHidden = (list.style.display === 'none');
    if (isHidden) {
        list.style.display = 'flex';
        list.classList.add('expanded');
        if (chevron) {
            chevron.textContent = '▲';
            chevron.classList.add('rotated');
        }
        if (toggleBtn) toggleBtn.classList.add('active');
        setTimeout(() => {
            list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
    } else {
        list.style.display = 'none';
        list.classList.remove('expanded');
        if (chevron) {
            chevron.textContent = '▼';
            chevron.classList.remove('rotated');
        }
        if (toggleBtn) toggleBtn.classList.remove('active');
    }
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

// Convert any date value/string to DD-MM-YYYY format
function formatToDDMMYYYY(val) {
    if (!val) return '';
    if (val instanceof Date) {
        const d = String(val.getDate()).padStart(2, '0');
        const m = String(val.getMonth() + 1).padStart(2, '0');
        const y = val.getFullYear();
        return `${d}-${m}-${y}`;
    }
    const s = String(val).trim();
    // Match YYYY-MM-DD
    const ymd = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (ymd) {
        return `${String(ymd[3]).padStart(2, '0')}-${String(ymd[2]).padStart(2, '0')}-${ymd[1]}`;
    }
    // Match DD-MM-YYYY
    const dmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dmy) {
        return `${String(dmy[1]).padStart(2, '0')}-${String(dmy[2]).padStart(2, '0')}-${dmy[3]}`;
    }
    return s;
}

// Parse time string in HH:MM, HH;MM, HH.MM, or 4-digit HHMM formats
function parseTimeComponents(str) {
    if (!str) return null;
    const clean = String(str).trim();
    // Match HH:MM or HH;MM or HH.MM or HH-MM
    let m = clean.match(/^(\d{1,2})[:;\.\-\s](\d{1,2})$/);
    if (m) {
        let h = parseInt(m[1], 10);
        let min = parseInt(m[2], 10);
        if (h >= 0 && h < 24 && min >= 0 && min < 60) {
            return {
                h,
                min,
                formatted: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
            };
        }
    }
    // Match 3 or 4 digits like 930 or 1430
    m = clean.match(/^(\d{1,2})(\d{2})$/);
    if (m) {
        let h = parseInt(m[1], 10);
        let min = parseInt(m[2], 10);
        if (h >= 0 && h < 24 && min >= 0 && min < 60) {
            return {
                h,
                min,
                formatted: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
            };
        }
    }
    return null;
}

// Calculation of detention duration
function calculateDetentionDuration(fromStr, toStr) {
    const t1 = parseTimeComponents(fromStr);
    const t2 = parseTimeComponents(toStr);
    if (!t1 || !t2) return '';

    let diffMinutes = (t2.h * 60 + t2.min) - (t1.h * 60 + t1.min);
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
    trainNos: ["26651/2", "20661/2"],
    rakeNos: ["IC2008", "IC2015", "IC2021"],
    mainCategories: [
        "Coach Cleanliness",
        "Coach Maintenenace",
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
    ],
    defectCategories: [
        "IC door",
        "Plug door",
        "Vaccum Toilet",
        "Seat and accessory",
        "Gangway",
        "CCTV",
        "Driver cab",
        "Undergear",
        "Air",
        "Propulsion",
        "Window glass",
        "Roller Blinder",
        "Others"
    ],
    detentionCategories: [
        "Plug door",
        "CRO",
        "Propulsion",
        "Air Brake",
        "Undergear",
        "Others"
    ]
};

// Clear legacy cached dropdown keys to purge stale train numbers
try {
    ['app_dropdown_data', 'app_dropdown_data_v2', 'app_dropdown_data_v3', 'app_dropdown_data_v4', 'app_dropdown_data_v5'].forEach(k => localStorage.removeItem(k));
} catch (e) {
    console.warn('Storage cleanup warning:', e);
}

const DROPDOWN_CACHE_KEY = 'app_dropdown_data_v6';

let cachedDropdownData = (() => {
    try {
        const saved = localStorage.getItem(DROPDOWN_CACHE_KEY);
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

function buildDefectCategoryOptions(selected = '') {
    let html = '<option value="">-- Select Defect Category --</option>';
    let found = false;
    const list = (cachedDropdownData.defectCategories && cachedDropdownData.defectCategories.length > 0)
        ? cachedDropdownData.defectCategories
        : DEFAULT_DROPDOWN_DATA.defectCategories;

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

function buildDetentionCategoryOptions(selected = '') {
    let html = '<option value="">-- Select Detention Category --</option>';
    let found = false;
    const list = (cachedDropdownData.detentionCategories && cachedDropdownData.detentionCategories.length > 0)
        ? cachedDropdownData.detentionCategories
        : DEFAULT_DROPDOWN_DATA.detentionCategories;

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
        arrivalRakeSelect.innerHTML = html;
        if (currentRake && rakes.includes(currentRake)) {
            arrivalRakeSelect.value = currentRake;
        } else {
            arrivalRakeSelect.value = '';
        }
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
        html += `<option value="Other" ${currentTrain === 'Other' ? 'selected' : ''}>Other (Enter custom)</option>`;
        arrivalTrainSelect.innerHTML = html;
        if (currentTrain && found) {
            arrivalTrainSelect.value = currentTrain;
        } else if (currentTrain === 'Other') {
            arrivalTrainSelect.value = 'Other';
        } else {
            arrivalTrainSelect.value = '';
        }
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

function refreshDefectDropdowns() {
    if (!defectsContainer) return;
    defectsContainer.querySelectorAll('.defect-row').forEach(row => {
        const catSel = row.querySelector('.defect-cat-select');
        if (catSel) {
            const current = catSel.value;
            catSel.innerHTML = buildDefectCategoryOptions(current);
            if (current) catSel.value = current;
        }
    });
}

function refreshDetentionDropdowns() {
    if (!detentionsContainer) return;
    detentionsContainer.querySelectorAll('.entry-card').forEach(card => {
        const catSel = card.querySelector('.detention-category-select');
        if (catSel) {
            const current = catSel.value;
            catSel.innerHTML = buildDetentionCategoryOptions(current);
            if (current) catSel.value = current;
        }
    });
}

async function fetchDropdownData() {
    try {
        const targetUrl = ARRIVAL_REPORT_WEB_APP_URL || OLD_WEB_APP_URL;
        const passwordParam = currentPassword ? `&password=${encodeURIComponent(currentPassword)}` : '';
        const res = await fetch(`${targetUrl}?action=get_dropdown_data${passwordParam}`);
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
            if (Array.isArray(result.defectCategories) && result.defectCategories.length > 0) {
                cachedDropdownData.defectCategories = result.defectCategories;
                updated = true;
            }
            if (Array.isArray(result.detentionCategories) && result.detentionCategories.length > 0) {
                cachedDropdownData.detentionCategories = result.detentionCategories;
                updated = true;
            }

            if (updated) {
                try {
                    localStorage.setItem(DROPDOWN_CACHE_KEY, JSON.stringify(cachedDropdownData));
                } catch (e) {
                    console.warn('Failed to save dropdown data to localStorage:', e);
                }
                populateArrivalDropdowns();
                refreshRailMadadDropdowns();
                refreshDefectDropdowns();
                refreshDetentionDropdowns();
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
function addDefectRow(coach = '', category = '', desc = '') {
    if (!defectsContainer) return;
    let c = coach;
    let cat = category;
    let d = desc;
    if (typeof coach === 'object' && coach !== null) {
        c = coach.CoachNo || '';
        cat = coach.Category || '';
        d = coach.IssueDescription || '';
    }
    const index = defectsContainer.querySelectorAll('.defect-row').length + 1;
    const card = document.createElement('div');
    card.className = 'entry-card defect-card defect-row';
    card.innerHTML = `
        <div class="entry-card-header">
            <span>Defect #${index}</span>
            <button type="button" class="remove-btn">✕ Remove</button>
        </div>
        <div class="form-row-2">
            <div class="form-group" style="margin-bottom: 0;">
                <label>Coach Number</label>
                <select class="defect-coach-select" required>
                    ${buildCoachOptions(c)}
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Defect Category</label>
                <select class="defect-cat-select" required>
                    ${buildDefectCategoryOptions(cat)}
                </select>
            </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Defect Description</label>
            <textarea class="defect-desc-input" rows="3" placeholder="Enter defect / issue description" required>${d || ''}</textarea>
        </div>
    `;

    card.querySelector('.remove-btn').addEventListener('click', () => {
        card.remove();
        renumberCards(defectsContainer, 'Defect');
        checkDefectsEmpty();
    });

    defectsContainer.appendChild(card);
    checkDefectsEmpty();
}

function checkDefectsEmpty() {
    if (!defectsContainer) return;
    const rows = defectsContainer.querySelectorAll('.defect-row');
    if (rows.length === 0) {
        defectsContainer.innerHTML = '';
    }
    updateArrivalSectionCounts();
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
        <div class="form-group" style="margin-bottom: 0;">
            <label>Complaint Description</label>
            <textarea class="rm-desc-input" rows="3" placeholder="Details of passenger complaint" required>${data.ComplaintDescription || ''}</textarea>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Action Taken Enroute</label>
            <textarea class="rm-action-input" rows="3" placeholder="Action taken by technician / OBHS / crew" required>${data.ActionTaken || ''}</textarea>
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
    const existingPlaceholder = railMadadContainer.querySelector('.empty-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    updateArrivalSectionCounts();
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
        <div class="form-group" style="margin-bottom: 0;">
            <label>Detention Category</label>
            <select class="detention-category-select" required>
                ${buildDetentionCategoryOptions(data.Category || '')}
            </select>
        </div>
        <div class="form-row-3 detention-times-row">
            <div class="form-group" style="margin-bottom: 0;">
                <label>Time From <span class="input-hint">(HH:MM)</span></label>
                <input type="text" class="detention-from" placeholder="HH:MM" maxlength="5" value="${data.TimeFrom || ''}" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Time To <span class="input-hint">(HH:MM)</span></label>
                <input type="text" class="detention-to" placeholder="HH:MM" maxlength="5" value="${data.TimeTo || ''}" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Total Detention</label>
                <input type="text" class="detention-total calculated-input" readonly placeholder="Auto-calculated" value="${data.TotalDetention || ''}">
            </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Issue Description</label>
            <textarea class="detention-desc" rows="3" placeholder="Reason for train detention" required>${data.IssueDescription || ''}</textarea>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label>Action Taken</label>
            <textarea class="detention-action" rows="3" placeholder="Action taken to rectify and dispatch" required>${data.ActionTaken || ''}</textarea>
        </div>
    `;

    const fromInput = card.querySelector('.detention-from');
    const toInput = card.querySelector('.detention-to');
    const totalInput = card.querySelector('.detention-total');

    const formatTimeInput = (input) => {
        let val = input.value;
        if (val.includes(';') || val.includes('.')) {
            val = val.replace(/[;\.]/g, ':');
            input.value = val;
        }
        if (/^\d{4}$/.test(val)) {
            input.value = val.slice(0, 2) + ':' + val.slice(2);
        }
    };

    const updateCalc = () => {
        totalInput.value = calculateDetentionDuration(fromInput.value, toInput.value);
    };

    [fromInput, toInput].forEach(inp => {
        inp.addEventListener('input', () => {
            formatTimeInput(inp);
            updateCalc();
        });
        inp.addEventListener('blur', () => {
            const parsed = parseTimeComponents(inp.value);
            if (parsed) {
                inp.value = parsed.formatted;
            }
            updateCalc();
        });
    });

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
    const existingPlaceholder = detentionsContainer.querySelector('.empty-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    updateArrivalSectionCounts();
}

function renumberCards(container, prefix) {
    if (!container) return;
    const cards = container.querySelectorAll('.entry-card');
    cards.forEach((card, idx) => {
        const titleSpan = card.querySelector('.entry-card-header span');
        if (titleSpan) titleSpan.textContent = `${prefix} #${idx + 1}`;
    });
}

// Collapsible Section (Accordion) Handlers for Arrival Report
function toggleSectionCollapse(contentId, chevronId) {
    const content = document.getElementById(contentId);
    const chevron = document.getElementById(chevronId);
    if (!content) return;
    const parentSection = content.closest('.collapsible-section');
    const isHidden = (content.style.display === 'none' || !content.style.display);
    if (isHidden) {
        content.style.display = 'block';
        if (chevron) chevron.classList.add('rotated');
        if (parentSection) parentSection.classList.add('is-open');
    } else {
        content.style.display = 'none';
        if (chevron) chevron.classList.remove('rotated');
        if (parentSection) parentSection.classList.remove('is-open');
    }
}
window.toggleSectionCollapse = toggleSectionCollapse;

function collapseAllArrivalSections() {
    ['defectsContent', 'railMadadContent', 'detentionsContent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            const parent = el.closest('.collapsible-section');
            if (parent) parent.classList.remove('is-open');
        }
    });
    ['defectsChevron', 'railMadadChevron', 'detentionsChevron'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('rotated');
    });
}
window.collapseAllArrivalSections = collapseAllArrivalSections;

function expandArrivalSection(key) {
    const mapping = {
        defects: { content: 'defectsContent', chevron: 'defectsChevron' },
        railMadad: { content: 'railMadadContent', chevron: 'railMadadChevron' },
        detentions: { content: 'detentionsContent', chevron: 'detentionsChevron' }
    };
    const target = mapping[key];
    if (target) {
        const content = document.getElementById(target.content);
        const chevron = document.getElementById(target.chevron);
        if (content) {
            content.style.display = 'block';
            const parent = content.closest('.collapsible-section');
            if (parent) parent.classList.add('is-open');
        }
        if (chevron) chevron.classList.add('rotated');
    }
}
window.expandArrivalSection = expandArrivalSection;

function updateArrivalSectionCounts() {
    const defectsCount = defectsContainer ? defectsContainer.querySelectorAll('.defect-row').length : 0;
    const railMadadCount = railMadadContainer ? railMadadContainer.querySelectorAll('.entry-card').length : 0;
    const detentionsCount = detentionsContainer ? detentionsContainer.querySelectorAll('.entry-card').length : 0;

    const defBadge = document.getElementById('defectsCountBadge');
    const rmBadge = document.getElementById('railMadadCountBadge');
    const detBadge = document.getElementById('detentionsCountBadge');

    if (defBadge) {
        defBadge.textContent = `${defectsCount} ${defectsCount === 1 ? 'entry' : 'entries'}`;
        defBadge.classList.toggle('has-entries', defectsCount > 0);
    }
    if (rmBadge) {
        rmBadge.textContent = `${railMadadCount} ${railMadadCount === 1 ? 'entry' : 'entries'}`;
        rmBadge.classList.toggle('has-entries', railMadadCount > 0);
    }
    if (detBadge) {
        detBadge.textContent = `${detentionsCount} ${detentionsCount === 1 ? 'entry' : 'entries'}`;
        detBadge.classList.toggle('has-entries', detentionsCount > 0);
    }
}
window.updateArrivalSectionCounts = updateArrivalSectionCounts;

function clearArrivalForm() {
    if (arrivalForm) arrivalForm.reset();
    populateArrivalDropdowns();
    if (arrivalDatePicker) arrivalDatePicker.setDate(new Date());
    if (defectsContainer) defectsContainer.innerHTML = '';
    if (railMadadContainer) railMadadContainer.innerHTML = '';
    if (detentionsContainer) detentionsContainer.innerHTML = '';
    if (arrivalOtherTrainGroup) arrivalOtherTrainGroup.style.display = 'none';
    if (arrivalSectionsWrapper) arrivalSectionsWrapper.style.display = 'none';
    if (arrivalLoadStatus) {
        arrivalLoadStatus.textContent = 'Select Date & Rake, then click Load Report to view or enter data';
        arrivalLoadStatus.style.color = 'var(--text-muted)';
    }
    checkDefectsEmpty();
    checkRailMadadEmpty();
    checkDetentionsEmpty();
    collapseAllArrivalSections();
    updateArrivalSectionCounts();
    updateArrivalStatus("Ready to load", "");
}

function openDataEntry() {
    hideAllScreens();
    clearForm();
    dataEntryScreen.style.display = 'flex';
}

function openArrivalReport() {
    hideAllScreens();
    document.body.classList.add('arrival-report-active');
    populateArrivalDropdowns();
    clearArrivalForm();
    if (arrivalSectionsWrapper) arrivalSectionsWrapper.style.display = 'none';
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
            document.body.classList.add('logged-in');
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
    document.body.classList.remove('logged-in');
    hideAllScreens();
    passwordModal.style.display = 'flex';
    passwordError.textContent = "Session expired or password changed. Please log in again.";
    passwordError.classList.remove('hidden');
}

function updateStatus(text, type) {
    if (!statusIndicator) return;
    statusIndicator.textContent = text || "";
    statusIndicator.className = `status-indicator arrival-status ${type || ""}`;
    if (!text || !text.trim()) {
        statusIndicator.style.display = 'none';
    } else {
        statusIndicator.style.display = 'inline-flex';
    }
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
            "IC2021": "20661/2",
            "IC2008": "26651/2",
            "IC2015": "26651/2"
        };
        if (defaultTrains[selectedRake]) {
            arrivalTrainSelect.value = defaultTrains[selectedRake];
            if (arrivalOtherTrainGroup) {
                arrivalOtherTrainGroup.style.display = 'none';
            }
        }

        if (arrivalSectionsWrapper && arrivalSectionsWrapper.style.display !== 'none') {
            arrivalSectionsWrapper.style.display = 'none';
            if (arrivalLoadStatus) {
                arrivalLoadStatus.textContent = 'Rake changed. Click "Load Report" to view or enter data for this rake.';
                arrivalLoadStatus.style.color = 'var(--text-muted)';
            }
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
        expandArrivalSection('defects');
        addDefectRow();
    });
}

if (addRailMadadBtn) {
    addRailMadadBtn.addEventListener('click', () => {
        expandArrivalSection('railMadad');
        addRailMadadCard();
    });
}

if (addDetentionBtn) {
    addDetentionBtn.addEventListener('click', () => {
        expandArrivalSection('detentions');
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

        const date = formatToDDMMYYYY(arrivalDateInput.value);
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
                            addDefectRow(d.CoachNo, d.Category || '', d.IssueDescription);
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

                // Collapse all arrival sections by default & show accurate counts
                collapseAllArrivalSections();
                updateArrivalSectionCounts();

                arrivalLoadStatus.textContent = `Loaded existing report for ${rake} on ${date}. You can edit and re-save.`;
                arrivalLoadStatus.style.color = 'var(--success)';
                updateArrivalStatus('Existing report loaded', 'online');

                if (arrivalSectionsWrapper) {
                    arrivalSectionsWrapper.style.display = 'block';
                    setTimeout(() => {
                        arrivalSectionsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 250);
                }

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

                // Keep sections empty: start clean
                defectsContainer.innerHTML = '';
                railMadadContainer.innerHTML = '';
                detentionsContainer.innerHTML = '';
                checkDefectsEmpty();
                checkRailMadadEmpty();
                checkDetentionsEmpty();
                collapseAllArrivalSections();
                updateArrivalSectionCounts();

                if (arrivalSectionsWrapper) {
                    arrivalSectionsWrapper.style.display = 'block';
                    setTimeout(() => {
                        arrivalSectionsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 250);
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
            if (arrivalSectionsWrapper) {
                arrivalSectionsWrapper.style.display = 'block';
                defectsContainer.innerHTML = '';
                railMadadContainer.innerHTML = '';
                detentionsContainer.innerHTML = '';
                checkDefectsEmpty();
                checkRailMadadEmpty();
                checkDetentionsEmpty();
                collapseAllArrivalSections();
                updateArrivalSectionCounts();
            }
        } finally {
            arrivalLoadBtn.disabled = false;
            btnText.textContent = '🔍 Load Report';
            spinner.classList.add('hidden');
        }
    });
}

// Auto-expand any collapsed sections that contain invalid fields so browser validation works seamlessly
if (arrivalSubmitBtn) {
    arrivalSubmitBtn.addEventListener('click', () => {
        const sections = [
            { contentId: 'defectsContent', chevronId: 'defectsChevron' },
            { contentId: 'railMadadContent', chevronId: 'railMadadChevron' },
            { contentId: 'detentionsContent', chevronId: 'detentionsChevron' }
        ];
        sections.forEach(sec => {
            const el = document.getElementById(sec.contentId);
            if (el && el.style.display === 'none') {
                if (el.querySelector(':invalid')) {
                    el.style.display = 'block';
                    const chev = document.getElementById(sec.chevronId);
                    if (chev) chev.classList.add('rotated');
                    const parent = el.closest('.collapsible-section');
                    if (parent) parent.classList.add('is-open');
                }
            }
        });
    });
}

function collectArrivalReportData() {
    const date = formatToDDMMYYYY(arrivalDateInput.value);
    const rakeNo = arrivalRakeSelect.value;
    let trainNo = arrivalTrainSelect.value;
    if (trainNo === 'Other') {
        trainNo = arrivalOtherTrainInput.value.trim();
    }
    const enteredBy = arrivalEnteredBy.value.trim();

    // Collect Section 1: Defects
    const defectRows = defectsContainer.querySelectorAll('.defect-row');
    const defects = [];
    defectRows.forEach(row => {
        const coach = row.querySelector('.defect-coach-select').value;
        const cat = row.querySelector('.defect-cat-select') ? row.querySelector('.defect-cat-select').value : '';
        const desc = row.querySelector('.defect-desc-input').value.trim();
        if (coach || desc || cat) {
            defects.push({
                CoachNo: coach,
                Category: cat,
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
        let timeFrom = card.querySelector('.detention-from').value.trim();
        let timeTo = card.querySelector('.detention-to').value.trim();
        const pFrom = parseTimeComponents(timeFrom);
        if (pFrom) timeFrom = pFrom.formatted;
        const pTo = parseTimeComponents(timeTo);
        if (pTo) timeTo = pTo.formatted;
        const totalDetention = card.querySelector('.detention-total').value || calculateDetentionDuration(timeFrom, timeTo);
        const cat = card.querySelector('.detention-category-select') ? card.querySelector('.detention-category-select').value : '';

        detentions.push({
            CoachNo: card.querySelector('.detention-coach-select').value,
            Station: card.querySelector('.detention-station').value.trim(),
            TimeFrom: timeFrom,
            TimeTo: timeTo,
            TotalDetention: totalDetention,
            Category: cat,
            IssueDescription: card.querySelector('.detention-desc').value.trim(),
            ActionTaken: card.querySelector('.detention-action').value.trim()
        });
    });

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    return {
        basic: {
            Timestamp: timestamp,
            Date: date,
            RakeNo: rakeNo,
            TrainNo: trainNo,
            DataEnteredBy: enteredBy
        },
        defects,
        railMadad,
        detentions
    };
}

// Handle Arrival Report Submission (Syncs to 3 sheets: Arrival Report, Rail Madad, Detentions)
if (arrivalForm) {
    arrivalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            handleSessionExpired();
            return;
        }

        const report = collectArrivalReportData();
        const { Date: date, RakeNo: rakeNo, TrainNo: trainNo, DataEnteredBy: enteredBy } = report.basic;

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

        const payload = {
            password: currentPassword,
            action: "save_arrival_report",
            train: rakeNo,
            basic: report.basic,
            defects: report.defects,
            railMadad: report.railMadad,
            detentions: report.detentions
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

// Initialize dynamic dropdowns from cache/defaults & fetch latest from Google Sheet
populateArrivalDropdowns();
fetchDropdownData();

// ============================================================================
// SETTINGS SCREEN & DROPDOWN CATEGORIES MANAGEMENT
// ============================================================================
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

let currentSettingsPassword = "";
let settingsEditState = {
    activeCategory: 'mainCategories',
    mainCategories: [],
    subCategories: [],
    defectCategories: [],
    detentionCategories: [],
    hasUnsavedChanges: false
};

const CATEGORY_CONFIG = {
    mainCategories: {
        title: 'RM complaint main category',
        subtitle: 'Values stored in "drop down data" sheet (Column C)',
        placeholder: 'e.g. Coach Cleanliness, Water Availability...',
        cacheKey: 'mainCategories'
    },
    subCategories: {
        title: 'Sub category',
        subtitle: 'Values stored in "drop down data" sheet (Column D)',
        placeholder: 'e.g. Tap Leaking, Window/Door Broken...',
        cacheKey: 'subCategories'
    },
    defectCategories: {
        title: 'defect category',
        subtitle: 'Values stored in "drop down data" sheet (Column E)',
        placeholder: 'e.g. IC door, Plug door, CCTV, Propulsion...',
        cacheKey: 'defectCategories'
    },
    detentionCategories: {
        title: 'Detention category',
        subtitle: 'Values stored in "drop down data" sheet (Column F)',
        placeholder: 'e.g. Air Brake, Plug door, Undergear...',
        cacheKey: 'detentionCategories'
    }
};

async function openSettingsPrompt() {
    const { value: pass } = await Swal.fire({
        title: 'Settings Access',
        html: '<p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">Enter the Settings password (stored in cell A3 of "pass" sheet):</p>',
        input: 'password',
        inputPlaceholder: 'Settings password',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Unlock Settings',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: 'rgba(255, 255, 255, 0.1)',
        background: 'var(--surface)',
        color: 'var(--text-main)',
        showLoaderOnConfirm: true,
        preConfirm: async (enteredPassword) => {
            if (!enteredPassword || !enteredPassword.trim()) {
                Swal.showValidationMessage('Please enter the Settings password');
                return false;
            }
            try {
                const targetUrl = ARRIVAL_REPORT_WEB_APP_URL || OLD_WEB_APP_URL;
                const verifyUrl = `${targetUrl}?action=verify_settings_password&settings_password=${encodeURIComponent(enteredPassword.trim())}`;
                const res = await fetch(verifyUrl);
                const result = await res.json();
                if (result && result.status === 'success') {
                    return enteredPassword.trim();
                } else {
                    Swal.showValidationMessage(result.message || 'Incorrect Settings password (verified from cell A3)');
                    return false;
                }
            } catch (err) {
                Swal.showValidationMessage('Verification error: ' + (err.message || 'Network error'));
                return false;
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    if (pass) {
        currentSettingsPassword = pass;
        openSettingsScreen();
    }
}

function openSettingsScreen() {
    hideAllScreens();
    const settingsScreen = document.getElementById('settingsScreen');
    if (settingsScreen) {
        settingsScreen.style.display = 'flex';
        initSettingsState();
        renderSettingsView();
    }
}

function initSettingsState() {
    settingsEditState.mainCategories = [...(cachedDropdownData.mainCategories || DEFAULT_DROPDOWN_DATA.mainCategories)];
    settingsEditState.subCategories = [...(cachedDropdownData.subCategories || DEFAULT_DROPDOWN_DATA.subCategories)];
    settingsEditState.defectCategories = [...(cachedDropdownData.defectCategories || DEFAULT_DROPDOWN_DATA.defectCategories)];
    settingsEditState.detentionCategories = [...(cachedDropdownData.detentionCategories || DEFAULT_DROPDOWN_DATA.detentionCategories)];
    settingsEditState.hasUnsavedChanges = false;
}

function switchSettingsTab(catKey) {
    if (!CATEGORY_CONFIG[catKey]) return;
    settingsEditState.activeCategory = catKey;
    renderSettingsView();
}

function renderSettingsView() {
    const activeCat = settingsEditState.activeCategory;
    const config = CATEGORY_CONFIG[activeCat];
    if (!config) return;

    // Update tab buttons
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        if (btn.id === `tab-${activeCat}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update header & count
    const titleEl = document.getElementById('currentCategoryTitle');
    const subEl = document.getElementById('currentCategorySubtitle');
    const inputEl = document.getElementById('newCategoryInput');
    const countEl = document.getElementById('categoryItemCount');
    const listEl = document.getElementById('categoryItemsList');
    const statusEl = document.getElementById('settingsSaveStatus');

    if (titleEl) titleEl.textContent = config.title;
    if (subEl) subEl.textContent = config.subtitle;
    if (inputEl) {
        inputEl.placeholder = config.placeholder;
        inputEl.value = '';
    }

    const items = settingsEditState[activeCat] || [];
    if (countEl) {
        countEl.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
    }

    // Render list
    if (listEl) {
        if (items.length === 0) {
            listEl.innerHTML = '<div class="settings-empty-notice">No items in this category. Type above and click "+ Add" to create one.</div>';
        } else {
            listEl.innerHTML = items.map((item, idx) => `
                <div class="settings-item-row" data-index="${idx}">
                    <span class="settings-item-index">${idx + 1}.</span>
                    <span class="settings-item-name">${escapeHtml(item)}</span>
                    <div class="settings-item-actions">
                        <button type="button" class="item-action-btn edit-btn" title="Edit name" onclick="editCategoryItem(${idx})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button type="button" class="item-action-btn delete-btn" title="Delete" onclick="deleteCategoryItem(${idx})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    if (statusEl) {
        if (settingsEditState.hasUnsavedChanges) {
            statusEl.innerHTML = '<span style="color: #fbbf24; font-weight: 600;">● Unsaved changes in categories</span>';
        } else {
            statusEl.innerHTML = '<span style="color: var(--text-muted);">Synced with Google Sheet "drop down data"</span>';
        }
    }
}

function addCurrentCategoryItem() {
    const inputEl = document.getElementById('newCategoryInput');
    if (!inputEl) return;
    const val = inputEl.value.trim();
    if (!val) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Field',
            text: 'Please enter a name for the category item.',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: '#f59e0b'
        });
        return;
    }

    const activeCat = settingsEditState.activeCategory;
    const list = settingsEditState[activeCat];

    if (list.some(item => item.trim().toLowerCase() === val.toLowerCase())) {
        Swal.fire({
            icon: 'info',
            title: 'Already Exists',
            text: `"${val}" is already present in this category.`,
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: '#f59e0b'
        });
        return;
    }

    list.push(val);
    settingsEditState.hasUnsavedChanges = true;
    inputEl.value = '';
    renderSettingsView();
}

async function editCategoryItem(index) {
    const activeCat = settingsEditState.activeCategory;
    const list = settingsEditState[activeCat];
    if (index < 0 || index >= list.length) return;

    const currentText = list[index];

    const { value: updatedText } = await Swal.fire({
        title: 'Edit Category Item',
        input: 'text',
        inputValue: currentText,
        inputPlaceholder: 'Enter updated item name',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f59e0b',
        background: 'var(--surface)',
        color: 'var(--text-main)',
        inputValidator: (value) => {
            if (!value || !value.trim()) {
                return 'Item name cannot be empty';
            }
        }
    });

    if (updatedText && updatedText.trim() && updatedText.trim() !== currentText) {
        const trimmed = updatedText.trim();
        if (list.some((item, i) => i !== index && item.trim().toLowerCase() === trimmed.toLowerCase())) {
            Swal.fire({
                icon: 'warning',
                title: 'Duplicate Item',
                text: `"${trimmed}" already exists in this category.`,
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        list[index] = trimmed;
        settingsEditState.hasUnsavedChanges = true;
        renderSettingsView();
    }
}

async function deleteCategoryItem(index) {
    const activeCat = settingsEditState.activeCategory;
    const list = settingsEditState[activeCat];
    if (index < 0 || index >= list.length) return;

    const currentText = list[index];

    const result = await Swal.fire({
        title: 'Remove Item?',
        html: `Are you sure you want to remove <strong>"${escapeHtml(currentText)}"</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
        background: 'var(--surface)',
        color: 'var(--text-main)'
    });

    if (result.isConfirmed) {
        list.splice(index, 1);
        settingsEditState.hasUnsavedChanges = true;
        renderSettingsView();
    }
}

async function saveCategoriesToSheet() {
    if (!currentSettingsPassword) {
        await openSettingsPrompt();
        if (!currentSettingsPassword) return;
    }

    const saveBtn = document.getElementById('saveCategoriesBtn');
    const btnText = saveBtn ? saveBtn.querySelector('span') : null;
    const spinner = saveBtn ? saveBtn.querySelector('.spinner') : null;

    if (saveBtn) saveBtn.disabled = true;
    if (btnText) btnText.textContent = 'Saving to Google Sheet...';
    if (spinner) spinner.classList.remove('hidden');

    try {
        const targetUrl = ARRIVAL_REPORT_WEB_APP_URL || OLD_WEB_APP_URL;
        const payload = {
            action: "save_dropdown_categories",
            password: currentPassword,
            settingsPassword: currentSettingsPassword,
            mainCategories: settingsEditState.mainCategories,
            subCategories: settingsEditState.subCategories,
            defectCategories: settingsEditState.defectCategories,
            detentionCategories: settingsEditState.detentionCategories
        };

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result && result.status === "success") {
            cachedDropdownData.mainCategories = [...settingsEditState.mainCategories];
            cachedDropdownData.subCategories = [...settingsEditState.subCategories];
            cachedDropdownData.defectCategories = [...settingsEditState.defectCategories];
            cachedDropdownData.detentionCategories = [...settingsEditState.detentionCategories];

            try {
                localStorage.setItem(DROPDOWN_CACHE_KEY, JSON.stringify(cachedDropdownData));
            } catch (e) {
                console.warn('LocalStorage save error:', e);
            }

            populateArrivalDropdowns();
            refreshRailMadadDropdowns();
            refreshDefectDropdowns();
            refreshDetentionDropdowns();

            settingsEditState.hasUnsavedChanges = false;
            renderSettingsView();

            Swal.fire({
                icon: 'success',
                title: 'Saved Successfully!',
                text: 'Categories updated in "drop down data" sheet and applied across the app.',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: '#f59e0b'
            });
        } else if (result && result.status === "unauthorized") {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: result.message || 'Incorrect Settings password (from cell A3 in "pass" sheet).',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: '#ef4444'
            });
            currentSettingsPassword = "";
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: result.message || 'Could not update categories in Google Sheet.',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                confirmButtonColor: '#ef4444'
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Network Error',
            text: 'Failed to communicate with Google Sheets: ' + (err.message || 'Network error'),
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: '#ef4444'
        });
    } finally {
        if (saveBtn) saveBtn.disabled = false;
        if (btnText) btnText.textContent = 'Save Categories to Google Sheet';
        if (spinner) spinner.classList.add('hidden');
    }
}

// Enter key binding for adding items in settings
document.addEventListener('DOMContentLoaded', () => {
    const newCatInput = document.getElementById('newCategoryInput');
    if (newCatInput) {
        newCatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCurrentCategoryItem();
            }
        });
    }
});


// ============================================================
// MANUALS SCREEN — Google Drive File Browser with Search
// ============================================================

// ---- CONFIGURATION: paste your root Google Drive folder ID here ----
// Get it from the folder URL: https://drive.google.com/drive/folders/FOLDER_ID_HERE
const MANUALS_ROOT_FOLDER_ID = '12Sm9fR3NZ1D61RtqSidMoFPhyn0HT7PH';

// Which Apps Script URL to call for Drive browsing (uses the same as arrival report)
const MANUALS_WEB_APP_URL = ARRIVAL_REPORT_WEB_APP_URL;

// State for the file browser
const manualsBrowserState = {
    stack: [],       // breadcrumb stack: [{id, name}]
    searchMode: false,
    searchQuery: ''
};

// --- Open / Close ---
function openManualsScreen() {
    hideAllScreens();
    const manualsScreen = document.getElementById('manualsScreen');
    if (manualsScreen) {
        manualsScreen.style.display = 'flex';
        // Reset to root on open
        manualsBrowserState.stack = [];
        manualsBrowserState.searchMode = false;
        manualsBrowserState.searchQuery = '';
        const searchInput = document.getElementById('manualsSearchInput');
        if (searchInput) searchInput.value = '';
        loadFolder(MANUALS_ROOT_FOLDER_ID, 'Manuals', true);
    }
}
window.openManualsScreen = openManualsScreen;

// --- Folder navigation ---
function loadFolder(folderId, folderName, isRoot) {
    if (!isRoot) {
        manualsBrowserState.stack.push({ id: folderId, name: folderName });
    } else {
        manualsBrowserState.stack = [{ id: folderId, name: folderName }];
    }
    manualsBrowserState.searchMode = false;
    fetchAndRenderFolder(folderId);
}
window.loadFolder = loadFolder;

function manualsGoBack() {
    if (manualsBrowserState.searchMode) {
        // Exit search, go back to current folder
        manualsBrowserState.searchMode = false;
        const searchInput = document.getElementById('manualsSearchInput');
        if (searchInput) searchInput.value = '';
        const currentFolder = manualsBrowserState.stack[manualsBrowserState.stack.length - 1];
        fetchAndRenderFolder(currentFolder.id);
        return;
    }
    if (manualsBrowserState.stack.length <= 1) {
        backToMenu();
        return;
    }
    manualsBrowserState.stack.pop();
    const prev = manualsBrowserState.stack[manualsBrowserState.stack.length - 1];
    fetchAndRenderFolder(prev.id);
}
window.manualsGoBack = manualsGoBack;

// --- Fetch folder contents from Apps Script ---
async function fetchAndRenderFolder(folderId) {
    if (!MANUALS_ROOT_FOLDER_ID || MANUALS_ROOT_FOLDER_ID === 'REPLACE_WITH_GOOGLE_DRIVE_FOLDER_ID') {
        renderManualsError('Root folder not configured. Please set MANUALS_ROOT_FOLDER_ID in app.js.');
        return;
    }
    renderManualsLoading();
    try {
        const url = `${MANUALS_WEB_APP_URL}?action=list_drive_folder&folderId=${encodeURIComponent(folderId)}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.status !== 'success') {
            renderManualsError(data.message || 'Failed to load folder.');
            return;
        }
        renderFolderContents(data);
    } catch (err) {
        renderManualsError('Network error: ' + err.message);
    }
}

// --- Search ---
let manualsSearchTimeout = null;
function onManualsSearchInput(val) {
    clearTimeout(manualsSearchTimeout);
    if (!val.trim()) {
        manualsBrowserState.searchMode = false;
        const currentFolder = manualsBrowserState.stack[manualsBrowserState.stack.length - 1];
        if (currentFolder) fetchAndRenderFolder(currentFolder.id);
        return;
    }
    manualsSearchTimeout = setTimeout(() => {
        doManualsSearch(val.trim());
    }, 400);
}
window.onManualsSearchInput = onManualsSearchInput;

async function doManualsSearch(query) {
    if (!MANUALS_ROOT_FOLDER_ID || MANUALS_ROOT_FOLDER_ID === 'REPLACE_WITH_GOOGLE_DRIVE_FOLDER_ID') return;
    manualsBrowserState.searchMode = true;
    manualsBrowserState.searchQuery = query;
    renderManualsLoading('Searching...');
    try {
        const url = `${MANUALS_WEB_APP_URL}?action=search_drive&folderId=${encodeURIComponent(MANUALS_ROOT_FOLDER_ID)}&query=${encodeURIComponent(query)}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.status !== 'success') {
            renderManualsError(data.message || 'Search failed.');
            return;
        }
        renderSearchResults(data.results, query);
    } catch (err) {
        renderManualsError('Search error: ' + err.message);
    }
}

// --- Render helpers ---
function renderManualsLoading(msg) {
    const container = document.getElementById('manualsListContainer');
    if (!container) return;
    updateManualsBreadcrumb();
    container.innerHTML = `
        <div class="manuals-loading">
            <div class="manuals-spinner"></div>
            <span>${msg || 'Loading...'}</span>
        </div>
    `;
}

function renderManualsError(msg) {
    const container = document.getElementById('manualsListContainer');
    if (!container) return;
    updateManualsBreadcrumb();
    container.innerHTML = `<div class="manuals-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${msg}</span>
    </div>`;
}

function createFolderCardElement(folder) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'manual-card manual-folder-card';
    btn.innerHTML = `
        <div class="manual-card-icon manual-folder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
        </div>
        <div class="manual-card-info">
            <span class="manual-card-title">${escapeHtml(folder.name)}</span>
        </div>
        <div class="manual-card-arrow">›</div>
    `;
    btn.addEventListener('click', () => loadFolder(folder.id, folder.name, false));
    return btn;
}

function createFileCardElement(file, showPath = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'manual-card';
    const icon = getFileIcon(file.mimeType);
    btn.innerHTML = `
        <div class="manual-card-icon">${icon}</div>
        <div class="manual-card-info">
            <span class="manual-card-title">${escapeHtml(file.name)}</span>
            ${showPath && file.path ? `<span class="manual-card-desc">${escapeHtml(file.path)}</span>` : ''}
        </div>
        <div class="manual-card-arrow">›</div>
    `;
    btn.addEventListener('click', () => openPdfViewer(file.id, file.name, file.mimeType));
    return btn;
}

function renderFolderContents(data) {
    const container = document.getElementById('manualsListContainer');
    if (!container) return;
    updateManualsBreadcrumb();
    container.innerHTML = '';

    if (data.folders.length === 0 && data.files.length === 0) {
        container.innerHTML = '<div class="manuals-empty">This folder is empty.</div>';
        return;
    }

    // Folders first
    if (data.folders.length > 0) {
        if (data.files.length > 0) {
            const label = document.createElement('div');
            label.className = 'manual-category-label';
            label.textContent = 'Folders';
            container.appendChild(label);
        }
        data.folders.forEach(folder => {
            container.appendChild(createFolderCardElement(folder));
        });
    }

    // Files
    if (data.files.length > 0) {
        if (data.folders.length > 0) {
            const label = document.createElement('div');
            label.className = 'manual-category-label';
            label.style.marginTop = '0.5rem';
            label.textContent = 'Files';
            container.appendChild(label);
        }
        data.files.forEach(file => {
            container.appendChild(createFileCardElement(file, false));
        });
    }
}

function renderSearchResults(results, query) {
    const container = document.getElementById('manualsListContainer');
    if (!container) return;
    updateManualsBreadcrumb();
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = `<div class="manuals-empty">No files found for "<strong>${escapeHtml(query)}</strong>".</div>`;
        return;
    }

    const label = document.createElement('div');
    label.className = 'manual-category-label';
    label.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
    container.appendChild(label);

    results.forEach(file => {
        container.appendChild(createFileCardElement(file, true));
    });
}

function updateManualsBreadcrumb() {
    const bc = document.getElementById('manualsBreadcrumb');
    if (!bc) return;
    if (manualsBrowserState.searchMode) {
        bc.textContent = `Search: "${manualsBrowserState.searchQuery}"`;
        return;
    }
    bc.textContent = manualsBrowserState.stack.map(s => s.name).join(' › ');
}

function getFileIcon(mimeType) {
    // PDF
    if (mimeType === 'application/pdf') {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>`;
    }
    // Generic doc icon
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
    </svg>`;
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// --- PDF / File Viewer (PDF.js with Text Finder + Drive Iframe Fallback) ---
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const pdfViewerState = {
    fileId: null,
    title: '',
    fileName: '',
    pdfBlob: null,
    file: null,
    pdfDoc: null,
    numPages: 0,
    zoomScale: 1.0,
    baseFitScale: 1.0,
    pageWrappers: [],
    renderedPages: new Set(),
    renderingPages: new Map(), // pageNum -> Promise
    pageSearchTexts: [],       // 1-indexed lowercase text per page
    matches: [],               // [{ pageNum, matchIdxOnPage }]
    activeMatchIdx: -1,
    searchQuery: '',
    observer: null,
    loadToken: 0,
    isPdfJsMode: false
};

function resetPdfViewerState() {
    pdfViewerState.loadToken++;
    if (pdfViewerState.observer) {
        pdfViewerState.observer.disconnect();
        pdfViewerState.observer = null;
    }
    if (pdfViewerState.pdfDoc) {
        try { pdfViewerState.pdfDoc.destroy(); } catch (e) {}
        pdfViewerState.pdfDoc = null;
    }
    pdfViewerState.fileId = null;
    pdfViewerState.title = '';
    pdfViewerState.fileName = '';
    pdfViewerState.pdfBlob = null;
    pdfViewerState.file = null;
    pdfViewerState.numPages = 0;
    pdfViewerState.zoomScale = 1.0;
    pdfViewerState.baseFitScale = 1.0;
    pdfViewerState.pageWrappers = [];
    pdfViewerState.renderedPages.clear();
    pdfViewerState.renderingPages.clear();
    pdfViewerState.pageSearchTexts = [];
    pdfViewerState.matches = [];
    pdfViewerState.activeMatchIdx = -1;
    pdfViewerState.searchQuery = '';
    pdfViewerState.isPdfJsMode = false;

    const pagesContainer = document.getElementById('pdfPagesContainer');
    if (pagesContainer) pagesContainer.innerHTML = '';

    const findInput = document.getElementById('pdfFindInput');
    if (findInput) findInput.value = '';
    updatePdfSearchUI();
}

async function openPdfViewer(fileId, title, mimeType) {
    resetPdfViewerState();
    const myToken = pdfViewerState.loadToken;
    pdfViewerState.fileId = fileId;
    pdfViewerState.title = title || 'Manual';
    const cleanFileName = title ? (title.toLowerCase().endsWith('.pdf') ? title : `${title}.pdf`) : 'Manual.pdf';
    pdfViewerState.fileName = cleanFileName;

    const overlay = document.getElementById('pdfViewerOverlay');
    const titleEl = document.getElementById('pdfViewerTitle');
    const extLink = document.getElementById('pdfExternalLinkBtn');
    const findToggleBtn = document.getElementById('pdfFindToggleBtn');
    const searchBar = document.getElementById('pdfSearchBar');
    const loadingEl = document.getElementById('pdfJsLoading');
    const loadingText = document.getElementById('pdfJsLoadingText');
    const jsContainer = document.getElementById('pdfJsContainer');
    const bottomControls = document.getElementById('pdfBottomControls');
    const iframe = document.getElementById('pdfIframe');

    if (titleEl) titleEl.textContent = title || 'File';
    if (extLink) extLink.href = `https://drive.google.com/file/d/${fileId}/view`;
    if (overlay) overlay.style.display = 'flex';

    // Reset visibility
    if (iframe) { iframe.style.display = 'none'; iframe.src = ''; }
    if (jsContainer) jsContainer.style.display = 'none';
    if (bottomControls) bottomControls.style.display = 'none';

    const canTryPdfJs = (mimeType === 'application/pdf' || (title && title.toLowerCase().endsWith('.pdf'))) && Boolean(window.pdfjsLib);

    if (!canTryPdfJs) {
        openFallbackDrivePreview(fileId);
        return;
    }

    // Show PDF.js loading + search bar immediately
    if (findToggleBtn) {
        findToggleBtn.style.display = 'flex';
        findToggleBtn.classList.add('active');
    }
    if (searchBar) searchBar.style.display = 'flex';
    if (loadingEl) loadingEl.style.display = 'flex';
    if (loadingText) loadingText.textContent = 'Loading PDF...';

    try {
        const url = `${MANUALS_WEB_APP_URL}?action=get_drive_file&fileId=${encodeURIComponent(fileId)}`;
        const resp = await fetch(url);
        const result = await resp.json();

        if (myToken !== pdfViewerState.loadToken) return;

        if (result.status !== 'success' || !result.data) {
            // Too large (>20 MB) or error -> seamless fallback to Drive preview
            openFallbackDrivePreview(fileId);
            return;
        }

        if (loadingText) loadingText.textContent = 'Preparing pages & text search...';

        // Decode Base64 to Uint8Array
        const binaryStr = atob(result.data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
        pdfViewerState.pdfBlob = pdfBlob;
        try {
            pdfViewerState.file = new File([pdfBlob], cleanFileName, { type: 'application/pdf' });
        } catch (e) {
            pdfViewerState.file = null;
        }

        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        if (myToken !== pdfViewerState.loadToken) {
            try { pdf.destroy(); } catch (e) {}
            return;
        }

        pdfViewerState.pdfDoc = pdf;
        pdfViewerState.numPages = pdf.numPages;
        pdfViewerState.isPdfJsMode = true;

        if (loadingEl) loadingEl.style.display = 'none';
        if (jsContainer) jsContainer.style.display = 'block';
        if (bottomControls) bottomControls.style.display = 'flex';

        await buildPdfPagePlaceholders(myToken);
        if (myToken !== pdfViewerState.loadToken) return;

        // Index text for all pages in the background so search works across the entire PDF
        indexAllPdfPages(myToken);
    } catch (err) {
        console.warn('PDF.js load failed, falling back to Drive preview:', err);
        if (myToken === pdfViewerState.loadToken) {
            openFallbackDrivePreview(fileId);
        }
    }
}
window.openPdfViewer = openPdfViewer;

function openFallbackDrivePreview(fileId) {
    pdfViewerState.isPdfJsMode = false;
    const findToggleBtn = document.getElementById('pdfFindToggleBtn');
    const searchBar = document.getElementById('pdfSearchBar');
    const loadingEl = document.getElementById('pdfJsLoading');
    const jsContainer = document.getElementById('pdfJsContainer');
    const bottomControls = document.getElementById('pdfBottomControls');
    const iframe = document.getElementById('pdfIframe');

    if (findToggleBtn) findToggleBtn.style.display = 'none';
    if (searchBar) searchBar.style.display = 'none';
    if (loadingEl) loadingEl.style.display = 'none';
    if (jsContainer) jsContainer.style.display = 'none';
    if (bottomControls) bottomControls.style.display = 'none';
    if (iframe) {
        iframe.style.display = 'block';
        iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
    }
}

async function buildPdfPagePlaceholders(myToken) {
    const jsContainer = document.getElementById('pdfJsContainer');
    const pagesContainer = document.getElementById('pdfPagesContainer');
    if (!jsContainer || !pagesContainer || !pdfViewerState.pdfDoc) return;

    const firstPage = await pdfViewerState.pdfDoc.getPage(1);
    if (myToken !== pdfViewerState.loadToken) return;

    const vp1 = firstPage.getViewport({ scale: 1.0 });
    const availWidth = Math.max(280, Math.min(jsContainer.clientWidth - 20, 920));
    pdfViewerState.baseFitScale = availWidth / vp1.width;
    const effectiveScale = pdfViewerState.baseFitScale * pdfViewerState.zoomScale;

    pagesContainer.innerHTML = '';
    pdfViewerState.pageWrappers = [];
    pdfViewerState.renderedPages.clear();
    pdfViewerState.renderingPages.clear();

    const defaultW = Math.floor(vp1.width * effectiveScale);
    const defaultH = Math.floor(vp1.height * effectiveScale);

    for (let pageNum = 1; pageNum <= pdfViewerState.numPages; pageNum++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'pdf-page-wrapper';
        wrapper.dataset.pageNum = String(pageNum);
        wrapper.style.width = `${defaultW}px`;
        wrapper.style.height = `${defaultH}px`;
        wrapper.style.setProperty('--scale-factor', String(effectiveScale));
        pagesContainer.appendChild(wrapper);
        pdfViewerState.pageWrappers[pageNum] = wrapper;
    }

    updatePdfBottomControls(1);
    setupPdfIntersectionObserver(myToken);
    renderPdfPage(1, myToken);
}

function setupPdfIntersectionObserver(myToken) {
    const jsContainer = document.getElementById('pdfJsContainer');
    if (!jsContainer) return;
    if (pdfViewerState.observer) pdfViewerState.observer.disconnect();

    pdfViewerState.observer = new IntersectionObserver((entries) => {
        if (myToken !== pdfViewerState.loadToken) return;
        let topVisiblePage = null;
        entries.forEach(entry => {
            const pNum = parseInt(entry.target.dataset.pageNum, 10);
            if (entry.isIntersecting) {
                renderPdfPage(pNum, myToken);
                if (topVisiblePage === null || pNum < topVisiblePage) {
                    topVisiblePage = pNum;
                }
            }
        });
        if (topVisiblePage !== null) {
            updatePdfBottomControls(topVisiblePage);
        }
    }, {
        root: jsContainer,
        rootMargin: '400px 0px',
        threshold: 0.05
    });

    for (let i = 1; i <= pdfViewerState.numPages; i++) {
        if (pdfViewerState.pageWrappers[i]) {
            pdfViewerState.observer.observe(pdfViewerState.pageWrappers[i]);
        }
    }
}

function renderPdfPage(pageNum, myToken) {
    if (myToken !== pdfViewerState.loadToken || !pdfViewerState.pdfDoc) return Promise.resolve();
    if (pdfViewerState.renderedPages.has(pageNum)) return Promise.resolve();
    if (pdfViewerState.renderingPages.has(pageNum)) return pdfViewerState.renderingPages.get(pageNum);

    const task = (async () => {
        try {
            const page = await pdfViewerState.pdfDoc.getPage(pageNum);
            if (myToken !== pdfViewerState.loadToken) return;

            const wrapper = pdfViewerState.pageWrappers[pageNum];
            if (!wrapper) return;

            const effectiveScale = pdfViewerState.baseFitScale * pdfViewerState.zoomScale;
            const viewport = page.getViewport({ scale: effectiveScale });
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            wrapper.style.width = `${Math.floor(viewport.width)}px`;
            wrapper.style.height = `${Math.floor(viewport.height)}px`;
            wrapper.style.setProperty('--scale-factor', String(effectiveScale));
            wrapper.innerHTML = '';

            const canvas = document.createElement('canvas');
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            wrapper.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            if (myToken !== pdfViewerState.loadToken) return;

            // Render selectable text layer for copying & search highlighting
            const textContent = await page.getTextContent();
            if (myToken !== pdfViewerState.loadToken) return;

            // Cache searchable text if not yet indexed
            if (!pdfViewerState.pageSearchTexts[pageNum]) {
                pdfViewerState.pageSearchTexts[pageNum] = extractPageSearchText(textContent);
            }

            const textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'textLayer';
            wrapper.appendChild(textLayerDiv);

            await pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                container: textLayerDiv,
                viewport: viewport,
                textDivs: []
            }).promise;
            if (myToken !== pdfViewerState.loadToken) return;

            // Snapshot original text of leaf spans for fast re-highlighting
            const leafSpans = Array.from(textLayerDiv.querySelectorAll('span')).filter(s => s.childElementCount === 0);
            leafSpans.forEach(s => {
                s.dataset.rawText = s.textContent;
            });

            pdfViewerState.renderedPages.add(pageNum);

            // Apply any active search highlights on this newly rendered page
            if (pdfViewerState.searchQuery) {
                highlightPageMatches(pageNum);
            }
        } catch (err) {
            console.warn(`Error rendering PDF page ${pageNum}:`, err);
        } finally {
            pdfViewerState.renderingPages.delete(pageNum);
        }
    })();

    pdfViewerState.renderingPages.set(pageNum, task);
    return task;
}

function extractPageSearchText(textContent) {
    if (!textContent || !textContent.items) return '';
    return textContent.items.map(it => it.str || '').join('').toLowerCase();
}

async function indexAllPdfPages(myToken) {
    if (!pdfViewerState.pdfDoc) return;
    for (let p = 1; p <= pdfViewerState.numPages; p++) {
        if (myToken !== pdfViewerState.loadToken) return;
        if (!pdfViewerState.pageSearchTexts[p]) {
            try {
                const page = await pdfViewerState.pdfDoc.getPage(p);
                if (myToken !== pdfViewerState.loadToken) return;
                const tc = await page.getTextContent();
                if (myToken !== pdfViewerState.loadToken) return;
                pdfViewerState.pageSearchTexts[p] = extractPageSearchText(tc);
            } catch (e) {
                pdfViewerState.pageSearchTexts[p] = '';
            }
        }
        // Yield periodically to keep UI responsive
        if (p % 5 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }
    // If user already typed a search query while indexing, refresh matches cleanly
    if (myToken === pdfViewerState.loadToken && pdfViewerState.searchQuery) {
        performPdfSearch(pdfViewerState.searchQuery, false);
    }
}

// --- PDF Text Finder Logic ---
function togglePdfSearchBar() {
    const bar = document.getElementById('pdfSearchBar');
    const btn = document.getElementById('pdfFindToggleBtn');
    const input = document.getElementById('pdfFindInput');
    if (!bar) return;

    const isHidden = bar.style.display === 'none' || !bar.style.display;
    if (isHidden) {
        bar.style.display = 'flex';
        if (btn) btn.classList.add('active');
        if (input) setTimeout(() => input.focus(), 50);
    } else {
        bar.style.display = 'none';
        if (btn) btn.classList.remove('active');
    }
}
window.togglePdfSearchBar = togglePdfSearchBar;

function clearPdfSearch() {
    const input = document.getElementById('pdfFindInput');
    if (input) {
        input.value = '';
        input.focus();
    }
    performPdfSearch('');
}
window.clearPdfSearch = clearPdfSearch;

function performPdfSearch(rawQuery, shouldJump = true) {
    const query = String(rawQuery || '').trim().toLowerCase();
    pdfViewerState.searchQuery = query;
    pdfViewerState.matches = [];
    pdfViewerState.activeMatchIdx = -1;

    // Clear existing highlights on all rendered pages
    pdfViewerState.renderedPages.forEach(pNum => highlightPageMatches(pNum));

    if (!query) {
        updatePdfSearchUI();
        return;
    }

    // Find all occurrences across all indexed pages
    for (let p = 1; p <= pdfViewerState.numPages; p++) {
        const pageStr = pdfViewerState.pageSearchTexts[p] || '';
        if (!pageStr) continue;
        let startIdx = 0;
        let matchIdxOnPage = 0;
        while ((startIdx = pageStr.indexOf(query, startIdx)) !== -1) {
            pdfViewerState.matches.push({ pageNum: p, matchIdxOnPage: matchIdxOnPage });
            matchIdxOnPage++;
            startIdx += query.length;
        }
    }

    // Highlight matches on currently rendered pages
    pdfViewerState.renderedPages.forEach(pNum => highlightPageMatches(pNum));

    if (pdfViewerState.matches.length > 0) {
        pdfViewerState.activeMatchIdx = 0;
        updatePdfSearchUI();
        if (shouldJump) {
            scrollToPdfMatch(0);
        } else {
            highlightActiveMark();
        }
    } else {
        updatePdfSearchUI();
    }
}

function highlightPageMatches(pageNum) {
    const wrapper = pdfViewerState.pageWrappers[pageNum];
    if (!wrapper) return;
    const textLayer = wrapper.querySelector('.textLayer');
    if (!textLayer) return;

    const leafSpans = Array.from(textLayer.querySelectorAll('span')).filter(s => s.childElementCount === 0);
    const query = pdfViewerState.searchQuery;

    // Reset all spans to original text first
    leafSpans.forEach(s => {
        if (s.dataset.rawText !== undefined) {
            s.textContent = s.dataset.rawText;
        }
    });

    if (!query) return;

    // Build concatenated text and character offset map back to spans
    let fullText = '';
    const spanMap = [];
    leafSpans.forEach(span => {
        const raw = span.dataset.rawText !== undefined ? span.dataset.rawText : span.textContent;
        const start = fullText.length;
        fullText += raw;
        const end = fullText.length;
        spanMap.push({ span, raw, start, end, ranges: [] });
    });

    const lowerFull = fullText.toLowerCase();
    let idx = 0;
    let matchIdxOnPage = 0;
    const qLen = query.length;

    while ((idx = lowerFull.indexOf(query, idx)) !== -1) {
        const mStart = idx;
        const mEnd = idx + qLen;

        for (let i = 0; i < spanMap.length; i++) {
            const item = spanMap[i];
            if (item.end <= mStart) continue;
            if (item.start >= mEnd) break;
            const localStart = Math.max(0, mStart - item.start);
            const localEnd = Math.min(item.raw.length, mEnd - item.start);
            if (localEnd > localStart) {
                item.ranges.push({ start: localStart, end: localEnd, matchIdx: matchIdxOnPage });
            }
        }

        matchIdxOnPage++;
        idx = mEnd;
    }

    // Apply <mark> highlights to spans that contain match ranges
    spanMap.forEach(item => {
        if (item.ranges.length === 0) return;
        const raw = item.raw;
        let html = '';
        let cursor = 0;
        item.ranges.forEach(r => {
            if (r.start > cursor) {
                html += escapeHtml(raw.slice(cursor, r.start));
            }
            html += `<mark class="pdf-match" data-page="${pageNum}" data-match-idx="${r.matchIdx}">${escapeHtml(raw.slice(r.start, r.end))}</mark>`;
            cursor = r.end;
        });
        if (cursor < raw.length) {
            html += escapeHtml(raw.slice(cursor));
        }
        item.span.innerHTML = html;
    });

    highlightActiveMark();
}

function highlightActiveMark() {
    const pagesContainer = document.getElementById('pdfPagesContainer');
    if (!pagesContainer) return;

    pagesContainer.querySelectorAll('mark.pdf-match.active').forEach(m => m.classList.remove('active'));

    if (pdfViewerState.activeMatchIdx < 0 || pdfViewerState.activeMatchIdx >= pdfViewerState.matches.length) return;
    const match = pdfViewerState.matches[pdfViewerState.activeMatchIdx];

    const marks = pagesContainer.querySelectorAll(
        `mark.pdf-match[data-page="${match.pageNum}"][data-match-idx="${match.matchIdxOnPage}"]`
    );
    marks.forEach(m => m.classList.add('active'));
    return marks[0] || null;
}

async function scrollToPdfMatch(matchIdx) {
    if (matchIdx < 0 || matchIdx >= pdfViewerState.matches.length) return;
    const match = pdfViewerState.matches[matchIdx];
    const wrapper = pdfViewerState.pageWrappers[match.pageNum];
    if (!wrapper) return;

    // Ensure the target page is rendered before scrolling to the exact mark
    await renderPdfPage(match.pageNum, pdfViewerState.loadToken);
    updatePdfBottomControls(match.pageNum);

    const activeMark = highlightActiveMark();
    if (activeMark) {
        activeMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function navigatePdfMatch(delta) {
    const total = pdfViewerState.matches.length;
    if (total === 0) return;

    pdfViewerState.activeMatchIdx = (pdfViewerState.activeMatchIdx + delta + total) % total;
    updatePdfSearchUI();
    scrollToPdfMatch(pdfViewerState.activeMatchIdx);
}
window.navigatePdfMatch = navigatePdfMatch;

function updatePdfSearchUI() {
    const countEl = document.getElementById('pdfFindCount');
    const clearBtn = document.getElementById('pdfFindClearBtn');
    const prevBtn = document.getElementById('pdfFindPrevBtn');
    const nextBtn = document.getElementById('pdfFindNextBtn');
    const input = document.getElementById('pdfFindInput');

    const hasQuery = Boolean(pdfViewerState.searchQuery || (input && input.value.trim()));
    const total = pdfViewerState.matches.length;

    if (clearBtn) clearBtn.style.display = hasQuery ? 'inline-flex' : 'none';
    if (prevBtn) prevBtn.disabled = total === 0;
    if (nextBtn) nextBtn.disabled = total === 0;

    if (countEl) {
        countEl.classList.remove('has-match', 'no-match');
        if (!pdfViewerState.searchQuery) {
            countEl.textContent = '';
        } else if (total === 0) {
            countEl.textContent = '0 / 0';
            countEl.classList.add('no-match');
        } else {
            countEl.textContent = `${pdfViewerState.activeMatchIdx + 1} / ${total}`;
            countEl.classList.add('has-match');
        }
    }
}

function updatePdfBottomControls(currentPage) {
    const pageEl = document.getElementById('pdfPageIndicator');
    const zoomEl = document.getElementById('pdfZoomLabel');
    if (pageEl && pdfViewerState.numPages > 0) {
        pageEl.textContent = `Page ${currentPage} / ${pdfViewerState.numPages}`;
    }
    if (zoomEl) {
        zoomEl.textContent = `${Math.round(pdfViewerState.zoomScale * 100)}%`;
    }
}

async function changePdfZoom(delta) {
    if (!pdfViewerState.isPdfJsMode || !pdfViewerState.pdfDoc) return;
    const nextZoom = Math.max(0.6, Math.min(2.6, +(pdfViewerState.zoomScale + delta).toFixed(2)));
    if (nextZoom === pdfViewerState.zoomScale) return;

    pdfViewerState.zoomScale = nextZoom;
    const myToken = pdfViewerState.loadToken;
    await buildPdfPagePlaceholders(myToken);
    if (pdfViewerState.activeMatchIdx >= 0) {
        scrollToPdfMatch(pdfViewerState.activeMatchIdx);
    }
}
window.changePdfZoom = changePdfZoom;

function closePdfViewer() {
    resetPdfViewerState();
    const overlay = document.getElementById('pdfViewerOverlay');
    const iframe = document.getElementById('pdfIframe');
    if (iframe) iframe.src = '';
    if (overlay) overlay.style.display = 'none';
}
window.closePdfViewer = closePdfViewer;

function downloadCurrentManualPdf() {
    if (!pdfViewerState.fileId && !pdfViewerState.pdfBlob) return;
    const fileName = pdfViewerState.fileName || (pdfViewerState.title ? `${pdfViewerState.title}.pdf` : 'Manual.pdf');
    if (pdfViewerState.pdfBlob) {
        const url = URL.createObjectURL(pdfViewerState.pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    } else if (pdfViewerState.fileId) {
        window.open(`https://drive.google.com/uc?export=download&id=${pdfViewerState.fileId}`, '_blank');
    }
}
window.downloadCurrentManualPdf = downloadCurrentManualPdf;

async function shareCurrentManualPdf() {
    if (!pdfViewerState.fileId && !pdfViewerState.file && !pdfViewerState.pdfBlob) return;

    const title = pdfViewerState.title || 'Manual';
    const fileName = pdfViewerState.fileName || `${title}.pdf`;
    const driveUrl = pdfViewerState.fileId ? `https://drive.google.com/file/d/${pdfViewerState.fileId}/view?usp=sharing` : '';
    const shareText = `VB Manual: ${title}${driveUrl ? '\n' + driveUrl : ''}`.trim();

    // 1. Native OS share sheet with actual PDF attachment (Mobile WhatsApp, Telegram, Gmail, etc.)
    if (pdfViewerState.file && navigator.canShare && navigator.canShare({ files: [pdfViewerState.file] })) {
        try {
            await navigator.share({
                files: [pdfViewerState.file],
                title: title,
                text: shareText
            });
            return;
        } catch (err) {
            if (err && err.name === 'AbortError') return; // User cancelled
            console.warn('File share failed, falling back:', err);
        }
    }

    // 2. Web Share API URL share
    if (navigator.share && driveUrl) {
        try {
            await navigator.share({
                title: title,
                text: `VB Manual: ${title}`,
                url: driveUrl
            });
            return;
        } catch (err) {
            if (err && err.name === 'AbortError') return;
            console.warn('URL share failed, falling back to modal:', err);
        }
    }

    // 3. Fallback modal for desktop or unsupported browsers (WhatsApp, Telegram, Email, Copy Link)
    if (pdfViewerState.pdfBlob) {
        downloadCurrentManualPdf();
    }

    const encodedText = encodeURIComponent(shareText);
    const encodedSubject = encodeURIComponent(`VB Manual: ${title}`);

    Swal.fire({
        icon: 'info',
        title: 'Share Manual',
        html: `
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
                ${pdfViewerState.pdfBlob ? `<strong>${escapeHtml(fileName)}</strong> has been downloaded to your device. You can attach or share it via:` : `Share link to <strong>${escapeHtml(title)}</strong> via:`}
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                <a href="https://wa.me/?text=${encodedText}" target="_blank" rel="noopener"
                   style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: #25D366; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.85rem;">
                    WhatsApp
                </a>
                <a href="https://t.me/share/url?url=${encodeURIComponent(driveUrl)}&text=${encodedText}" target="_blank" rel="noopener"
                   style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: #0088cc; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.85rem;">
                    Telegram
                </a>
                <a href="mailto:?subject=${encodedSubject}&body=${encodedText}"
                   style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: #64748b; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.85rem;">
                    Email
                </a>
            </div>
            ${driveUrl ? `
                <div style="margin-top: 1rem;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${driveUrl}'); Swal.showValidationMessage('Link copied to clipboard!');" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; cursor: pointer; border-radius: 0.4rem;">
                        📋 Copy Drive Link
                    </button>
                </div>
            ` : ''}
        `,
        background: 'var(--card-bg)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'Done'
    });
}
window.shareCurrentManualPdf = shareCurrentManualPdf;

// Bind PDF Find Input events
document.addEventListener('DOMContentLoaded', () => {
    const findInput = document.getElementById('pdfFindInput');
    if (findInput) {
        let findTimer = null;
        findInput.addEventListener('input', () => {
            clearTimeout(findTimer);
            const val = findInput.value;
            findTimer = setTimeout(() => {
                performPdfSearch(val);
            }, 220);
        });
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (pdfViewerState.searchQuery !== findInput.value.trim().toLowerCase()) {
                    performPdfSearch(findInput.value);
                } else {
                    navigatePdfMatch(e.shiftKey ? -1 : 1);
                }
            } else if (e.key === 'Escape') {
                clearPdfSearch();
            }
        });
    }
});


// ============================================================
// ARRIVAL REPORT PDF GENERATION, PREVIEW & SHARE
// ============================================================

const generatedPdfState = {
    blob: null,
    file: null,
    fileName: '',
    summaryText: ''
};

function generateArrivalReportPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        Swal.fire({
            icon: 'error',
            title: 'PDF Library Not Loaded',
            text: 'Please check your internet connection and refresh the app.',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--primary)'
        });
        return;
    }

    const report = collectArrivalReportData();
    const { basic, defects, railMadad, detentions } = report;

    if (!basic.Date || !basic.RakeNo || !basic.TrainNo) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Basic Details',
            text: 'Please select Date, Rake Number, and Train Number before generating the PDF.',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            confirmButtonColor: 'var(--primary)'
        });
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 12;

    // 1. Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    doc.text('VANDE BHARAT ESCORTING - ARRIVAL REPORT', marginX, 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`SBC Coaching Depot  |  Generated: ${basic.Timestamp}`, marginX, 18);

    // 2. Top Basic Details Table
    doc.autoTable({
        startY: 28,
        margin: { left: marginX, right: marginX },
        theme: 'grid',
        head: [['Date', 'Rake No', 'Train No', 'Data Entered By']],
        body: [[
            basic.Date || '-',
            basic.RakeNo || '-',
            basic.TrainNo || '-',
            basic.DataEnteredBy || '-'
        ]],
        headStyles: {
            fillColor: [30, 58, 138],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 3
        },
        bodyStyles: {
            fontSize: 9.5,
            fontStyle: 'bold',
            textColor: [15, 23, 42],
            cellPadding: 3.5
        }
    });

    function drawSectionTitle(title) {
        let y = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 50) + 8;
        if (y > 265) {
            doc.addPage();
            y = 16;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(title, marginX, y);
        return y + 2.5;
    }

    // 3. Section 1: Defects Table
    const sec1Y = drawSectionTitle(`Section 1: Defects (${defects.length})`);
    const defectBody = defects.length > 0
        ? defects.map((d, i) => [
            String(i + 1),
            d.CoachNo || '-',
            d.Category || '-',
            d.IssueDescription || '-'
        ])
        : [[{ content: 'NIL — No Defects Reported', colSpan: 4, styles: { halign: 'center', fontStyle: 'italic', textColor: [100, 116, 139] } }]];

    doc.autoTable({
        startY: sec1Y,
        margin: { left: marginX, right: marginX },
        theme: 'grid',
        head: [['S.No', 'Coach No', 'Defect Category', 'Issue Description']],
        body: defectBody,
        headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59], cellPadding: 2.5 },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 28 },
            2: { cellWidth: 38 },
            3: { cellWidth: 'auto' }
        }
    });

    // 4. Section 2: Rail Madad Complaints Table
    const sec2Y = drawSectionTitle(`Section 2: Rail Madad Complaints (${railMadad.length})`);
    const rmBody = railMadad.length > 0
        ? railMadad.map((rm, i) => [
            String(i + 1),
            rm.CoachNo || '-',
            rm.RMReferenceNo || '-',
            [rm.MainCategory, rm.SubCategory].filter(Boolean).join('\n') || '-',
            rm.ComplaintDescription || '-',
            rm.ActionTaken || '-'
        ])
        : [[{ content: 'NIL — No Rail Madad Complaints Reported', colSpan: 6, styles: { halign: 'center', fontStyle: 'italic', textColor: [100, 116, 139] } }]];

    doc.autoTable({
        startY: sec2Y,
        margin: { left: marginX, right: marginX },
        theme: 'grid',
        head: [['S.No', 'Coach', 'RM Ref', 'Category', 'Complaint Description', 'Action Taken']],
        body: rmBody,
        headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59], cellPadding: 2.5 },
        columnStyles: {
            0: { cellWidth: 11, halign: 'center' },
            1: { cellWidth: 22 },
            2: { cellWidth: 24 },
            3: { cellWidth: 32 },
            4: { cellWidth: 'auto' },
            5: { cellWidth: 42 }
        }
    });

    // 5. Section 3: Detentions Table
    const sec3Y = drawSectionTitle(`Section 3: Detentions (${detentions.length})`);
    const detBody = detentions.length > 0
        ? detentions.map((dt, i) => [
            String(i + 1),
            dt.CoachNo || '-',
            dt.Station || '-',
            `${dt.TimeFrom || '-'} - ${dt.TimeTo || '-'}\n(${dt.TotalDetention || '-'})`,
            dt.Category || '-',
            [
                dt.IssueDescription ? `Reason: ${dt.IssueDescription}` : '',
                dt.ActionTaken ? `Action: ${dt.ActionTaken}` : ''
            ].filter(Boolean).join('\n') || '-'
        ])
        : [[{ content: 'NIL — No Detentions Reported', colSpan: 6, styles: { halign: 'center', fontStyle: 'italic', textColor: [100, 116, 139] } }]];

    doc.autoTable({
        startY: sec3Y,
        margin: { left: marginX, right: marginX },
        theme: 'grid',
        head: [['S.No', 'Coach', 'Station', 'Time (Total)', 'Category', 'Reason & Action Taken']],
        body: detBody,
        headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8, textColor: [30, 41, 59], cellPadding: 2.5 },
        columnStyles: {
            0: { cellWidth: 11, halign: 'center' },
            1: { cellWidth: 22 },
            2: { cellWidth: 24 },
            3: { cellWidth: 28 },
            4: { cellWidth: 28 },
            5: { cellWidth: 'auto' }
        }
    });

    // 6. Footer on every page
    const totalPages = doc.internal.getNumberOfPages();
    const pageHeight = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('VB Escorting App  •  SBC Coaching Depot', marginX, pageHeight - 8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, pageHeight - 8, { align: 'right' });
    }

    const safeTrain = String(basic.TrainNo || '').replace(/[^a-zA-Z0-9_-]+/g, '-');
    const fileName = `Arrival_Report_${basic.RakeNo}_${safeTrain}_${basic.Date}.pdf`;
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    generatedPdfState.blob = pdfBlob;
    generatedPdfState.file = pdfFile;
    generatedPdfState.fileName = fileName;
    generatedPdfState.summaryText =
        `VB Arrival Report\nDate: ${basic.Date}\nRake: ${basic.RakeNo} | Train: ${basic.TrainNo}\n` +
        `Defects: ${defects.length} | Rail Madad: ${railMadad.length} | Detentions: ${detentions.length}`;

    openGeneratedPdfPreview(fileName, pdfBlob);
}
window.generateArrivalReportPdf = generateArrivalReportPdf;

async function openGeneratedPdfPreview(fileName, pdfBlob) {
    const overlay = document.getElementById('generatedPdfOverlay');
    const titleEl = document.getElementById('generatedPdfTitle');
    const pagesContainer = document.getElementById('generatedPdfPagesContainer');
    const bodyEl = document.getElementById('generatedPdfBody');
    if (!overlay || !pagesContainer) return;

    if (titleEl) titleEl.textContent = fileName;
    pagesContainer.innerHTML = '<div class="manuals-loading"><div class="manuals-spinner"></div><span>Rendering PDF preview...</span></div>';
    overlay.style.display = 'flex';

    try {
        if (!window.pdfjsLib) throw new Error('PDF.js unavailable');
        const arrayBuf = await pdfBlob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
        pagesContainer.innerHTML = '';

        const availWidth = Math.max(280, Math.min((bodyEl ? bodyEl.clientWidth : window.innerWidth) - 24, 860));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let p = 1; p <= pdf.numPages; p++) {
            const page = await pdf.getPage(p);
            const vp1 = page.getViewport({ scale: 1.0 });
            const scale = availWidth / vp1.width;
            const viewport = page.getViewport({ scale });

            const wrapper = document.createElement('div');
            wrapper.className = 'pdf-page-wrapper';
            wrapper.style.width = `${Math.floor(viewport.width)}px`;
            wrapper.style.height = `${Math.floor(viewport.height)}px`;

            const canvas = document.createElement('canvas');
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            wrapper.appendChild(canvas);
            pagesContainer.appendChild(wrapper);

            const ctx = canvas.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            await page.render({ canvasContext: ctx, viewport }).promise;
        }
        try { pdf.destroy(); } catch (e) {}
    } catch (err) {
        pagesContainer.innerHTML = `
            <div class="manuals-empty">
                <p>PDF generated successfully: <strong>${escapeHtml(fileName)}</strong></p>
                <p style="margin-top:0.5rem;">Tap <strong>Share</strong> or <strong>Save</strong> above.</p>
            </div>
        `;
    }
}

function downloadGeneratedArrivalPdf() {
    if (!generatedPdfState.blob) return;
    const url = URL.createObjectURL(generatedPdfState.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedPdfState.fileName || 'Arrival_Report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}
window.downloadGeneratedArrivalPdf = downloadGeneratedArrivalPdf;

async function shareGeneratedArrivalPdf() {
    if (!generatedPdfState.file) return;

    const shareData = {
        files: [generatedPdfState.file],
        title: generatedPdfState.fileName,
        text: generatedPdfState.summaryText
    };

    if (navigator.canShare && navigator.canShare({ files: [generatedPdfState.file] })) {
        try {
            await navigator.share(shareData);
            return;
        } catch (err) {
            if (err && err.name === 'AbortError') return; // User closed share sheet
            console.warn('Web Share API failed, falling back:', err);
        }
    }

    // Fallback for desktop browsers that do not support sharing PDF files directly
    downloadGeneratedArrivalPdf();
    const encodedText = encodeURIComponent(generatedPdfState.summaryText);
    Swal.fire({
        icon: 'info',
        title: 'PDF Downloaded',
        html: `
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
                Your browser doesn't support attaching PDF files directly to the OS share menu, so <strong>${escapeHtml(generatedPdfState.fileName)}</strong> has been downloaded. You can attach it in:
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                <a href="https://wa.me/?text=${encodedText}" target="_blank" rel="noopener"
                   style="padding: 0.6rem 1rem; background: #25D366; color: #fff; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                   WhatsApp
                </a>
                <a href="https://t.me/share/url?url=&text=${encodedText}" target="_blank" rel="noopener"
                   style="padding: 0.6rem 1rem; background: #0088cc; color: #fff; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">
                   Telegram
                </a>
            </div>
        `,
        background: 'var(--surface)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'OK'
    });
}
window.shareGeneratedArrivalPdf = shareGeneratedArrivalPdf;

function closeGeneratedPdfPreview() {
    const overlay = document.getElementById('generatedPdfOverlay');
    const pagesContainer = document.getElementById('generatedPdfPagesContainer');
    if (pagesContainer) pagesContainer.innerHTML = '';
    if (overlay) overlay.style.display = 'none';
}
window.closeGeneratedPdfPreview = closeGeneratedPdfPreview;
