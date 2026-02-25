// ============================================
// HARITHAKARMASENA - Bilingual Translations
// English (en) + Malayalam (ml)
// ============================================

const translations = {
    en: {
        // App
        appName: 'Harithakarmasena',
        appSubtitle: 'Smart Waste Management',

        // Nav
        dashboard: 'Dashboard',
        addSchedule: 'Add Schedule',
        viewCalendar: 'View Schedules',
        logout: 'Logout',

        // Dashboard
        welcome: 'Welcome Back!',
        collectorPortal: 'Garbage Collector Portal',
        totalSchedules: 'Total Schedules',
        todayCollections: "Today's Collections",
        weekSchedules: "This Week's Schedules",
        completedToday: 'Completed Today',
        upcomingSchedules: 'Upcoming Schedules',
        recentActivity: 'Recent Activity',
        addNewSchedule: 'Add New Schedule',
        viewAllSchedules: 'View All Schedules',
        noSchedules: 'No schedules found',
        noSchedulesDesc: 'Add your first collection schedule to get started.',
        quickActions: 'Quick Actions',

        // Form - Add/Edit Schedule
        addScheduleTitle: 'Add Collection Schedule',
        editScheduleTitle: 'Edit Collection Schedule',
        scheduleInfo: 'Schedule Information',
        area: 'Collection Area',
        selectArea: 'Select area...',
        date: 'Collection Date',
        time: 'Collection Time',
        wasteType: 'Waste Type',
        biological: 'Biological Waste',
        biologicalDesc: 'Food scraps, garden waste, organic matter',
        plastic: 'Plastic Waste',
        plasticDesc: 'Bottles, bags, containers, packaging',
        notes: 'Notes (Optional)',
        notesPlaceholder: 'Any additional info for this collection...',
        saveSchedule: 'Save Schedule',
        updateSchedule: 'Update Schedule',
        cancel: 'Cancel',
        saving: 'Saving...',

        // Weekly Plan
        weeklyPlan: 'Weekly Plan Mode',
        weeklyPlanDesc: 'Plan collections for multiple days at once',
        selectDays: 'Select Days',
        repeatArea: 'Same area/waste type for all days',

        // Calendar/List View
        scheduleList: 'Collection Schedules',
        filterByArea: 'Filter by Area',
        filterByStatus: 'Filter by Status',
        allAreas: 'All Areas',
        allStatus: 'All Status',
        today: 'Today',
        tomorrow: 'Tomorrow',
        markComplete: 'Mark as Completed',
        markPending: 'Mark as Pending',
        edit: 'Edit',
        delete: 'Delete',
        completed: 'Completed',
        pending: 'Pending',
        confirmDelete: 'Confirm Delete',
        confirmDeleteMsg: 'Are you sure you want to delete this schedule? This action cannot be undone.',
        deleteConfirm: 'Yes, Delete',
        deleteCancel: 'Cancel',

        // Areas
        area_colombo_01: 'Colombo 01 - Fort',
        area_colombo_02: 'Colombo 02 - Slave Island',
        area_colombo_03: 'Colombo 03 - Kollupitiya',
        area_colombo_04: 'Colombo 04 - Bambalapitiya',
        area_colombo_05: 'Colombo 05 - Havelock Town',
        area_colombo_06: 'Colombo 06 - Wellawatte',
        area_colombo_07: 'Colombo 07 - Cinnamon Gardens',
        area_colombo_08: 'Colombo 08 - Borella',
        area_colombo_09: 'Colombo 09 - Dematagoda',
        area_colombo_10: 'Colombo 10 - Maradana',

        // Validation
        errorArea: 'Please select a collection area',
        errorDate: 'Please select a valid date',
        errorDatePast: 'Cannot select a past date',
        errorDateFuture: 'Date cannot be more than 7 days from today',
        errorTime: 'Please select a collection time',
        errorWasteType: 'Please select a waste type',
        successAdd: 'Schedule added successfully!',
        successUpdate: 'Schedule updated successfully!',
        successDelete: 'Schedule deleted successfully!',
        successComplete: 'Marked as completed!',
        successPending: 'Marked as pending!',

        // Empty states
        noSchedulesToday: 'No collections scheduled today',
        noUpcoming: 'No upcoming schedules',
        loading: 'Loading...',

        // Days
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
    },

    ml: {
        // App
        appName: 'ഹരിതകർമ്മസേന',
        appSubtitle: 'സ്മാർട്ട് മാലിന്യ നിർവഹണം',

        // Nav
        dashboard: 'ഡാഷ്ബോർഡ്',
        addSchedule: 'ഷെഡ്യൂൾ ചേർക്കുക',
        viewCalendar: 'ഷെഡ്യൂളുകൾ കാണുക',
        logout: 'ലോഗ് ഔട്ട്',

        // Dashboard
        welcome: 'സ്വാഗതം!',
        collectorPortal: 'മാലിന്യ ശേഖരകരുടെ പോർട്ടൽ',
        totalSchedules: 'മൊത്തം ഷെഡ്യൂളുകൾ',
        todayCollections: 'ഇന്നത്തെ ശേഖരണം',
        weekSchedules: 'ഈ ആഴ്ചത്തെ ഷെഡ്യൂൾ',
        completedToday: 'ഇന്ന് പൂർത്തിയായത്',
        upcomingSchedules: 'വരാനിരിക്കുന്ന ഷെഡ്യൂളുകൾ',
        recentActivity: 'സമീപ പ്രവർത്തനം',
        addNewSchedule: 'പുതിയ ഷെഡ്യൂൾ ചേർക്കുക',
        viewAllSchedules: 'എല്ലാ ഷെഡ്യൂളുകളും കാണുക',
        noSchedules: 'ഷെഡ്യൂളുകൾ ഒന്നും ഇല്ല',
        noSchedulesDesc: 'ആദ്യത്തെ ശേഖരണ ഷെഡ്യൂൾ ചേർക്കുക.',
        quickActions: 'ദ്രുത ക്രിയകൾ',

        // Form
        addScheduleTitle: 'ശേഖരണ ഷെഡ്യൂൾ ചേർക്കുക',
        editScheduleTitle: 'ഷെഡ്യൂൾ തിരുത്തുക',
        scheduleInfo: 'ഷെഡ്യൂൾ വിവരങ്ങൾ',
        area: 'ശേഖരണ പ്രദേശം',
        selectArea: 'പ്രദേശം തിരഞ്ഞെടുക്കുക...',
        date: 'ശേഖരണ തീയതി',
        time: 'ശേഖരണ സമയം',
        wasteType: 'മാലിന്യ തരം',
        biological: 'ജൈവ മാലിന്യം',
        biologicalDesc: 'ഭക്ഷണ അവശിഷ്ടം, തോട്ട മാലിന്യം, ജൈവ പദാർഥം',
        plastic: 'പ്ലാസ്റ്റിക് മാലിന്യം',
        plasticDesc: 'കുപ്പികൾ, ബാഗുകൾ, പാത്രങ്ങൾ, പാക്കേജിങ്',
        notes: 'കുറിപ്പുകൾ (ഓപ്ഷണൽ)',
        notesPlaceholder: 'ഈ ശേഖരണത്തിനുള്ള അധിക വിവരങ്ങൾ...',
        saveSchedule: 'ഷെഡ്യൂൾ സേവ് ചെയ്യുക',
        updateSchedule: 'ഷെഡ്യൂൾ അപ്ഡേറ്റ് ചെയ്യുക',
        cancel: 'റദ്ദാക്കുക',
        saving: 'സേവ് ചെയ്യുന്നു...',

        // Weekly Plan
        weeklyPlan: 'പ്രതിവാര പദ്ധതി',
        weeklyPlanDesc: 'ഒന്നിലധികം ദിവസങ്ങൾക്ക് ഒരുമിച്ച് ഷെഡ്യൂൾ ചെയ്യുക',
        selectDays: 'ദിവസങ്ങൾ തിരഞ്ഞെടുക്കുക',
        repeatArea: 'എല്ലാ ദിവസവും ഒരേ പ്രദേശം/മാലിന്യ തരം',

        // Calendar/List
        scheduleList: 'ശേഖരണ ഷെഡ്യൂളുകൾ',
        filterByArea: 'പ്രദേശം അനുസരിച്ച് ഫിൽട്ടർ',
        filterByStatus: 'സ്ഥിതി അനുസരിച്ച് ഫിൽട്ടർ',
        allAreas: 'എല്ലാ പ്രദേശങ്ങളും',
        allStatus: 'എല്ലാ സ്ഥിതികളും',
        today: 'ഇന്ന്',
        tomorrow: 'നാളെ',
        markComplete: 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തുക',
        markPending: 'തീർക്കാനുള്ളതായി അടയാളപ്പെടുത്തുക',
        edit: 'തിരുത്തുക',
        delete: 'ഇല്ലാതാക്കുക',
        completed: 'പൂർത്തിയായി',
        pending: 'കാത്തിരിക്കുന്നു',
        confirmDelete: 'ഇല്ലാതാക്കൽ സ്ഥിരീകരിക്കുക',
        confirmDeleteMsg: 'ഈ ഷെഡ്യൂൾ ഇല്ലാതാക്കണമോ? ഈ പ്രവൃത്തി പഴയപടിയാക്കാൻ കഴിയില്ല.',
        deleteConfirm: 'അതെ, ഇല്ലാതാക്കുക',
        deleteCancel: 'റദ്ദാക്കുക',

        // Areas
        area_colombo_01: 'കൊളംബോ 01 - ഫോർട്ട്',
        area_colombo_02: 'കൊളംബോ 02 - സ്ലേവ് ഐലൻഡ്',
        area_colombo_03: 'കൊളംബോ 03 - കൊല്ലുപ്പിടിയ',
        area_colombo_04: 'കൊളംബോ 04 - ബംബലപ്പിടിയ',
        area_colombo_05: 'കൊളംബോ 05 - ഹേവ്ലക് ടൗൺ',
        area_colombo_06: 'കൊളംബോ 06 - വെല്ലവത്ത',
        area_colombo_07: 'കൊളംബോ 07 - സിന്നമൺ ഗാർഡൻസ്',
        area_colombo_08: 'കൊളംബോ 08 - ബൊറെല്ല',
        area_colombo_09: 'കൊളംബോ 09 - ദേമടഗൊട',
        area_colombo_10: 'കൊളംബോ 10 - മാരദാന',

        // Validation
        errorArea: 'ദയവായി ഒരു ശേഖരണ പ്രദേശം തിരഞ്ഞെടുക്കുക',
        errorDate: 'ദയവായി ഒരു സാധുതയുള്ള തീയതി തിരഞ്ഞെടുക്കുക',
        errorDatePast: 'കഴിഞ്ഞ തീയതി തിരഞ്ഞെടുക്കാൻ കഴിയില്ല',
        errorDateFuture: 'തീയതി 7 ദിവസത്തിൽ കൂടരുത്',
        errorTime: 'ദയവായി ശേഖരണ സമയം തിരഞ്ഞെടുക്കുക',
        errorWasteType: 'ദയവായി മാലിന്യ തരം തിരഞ്ഞെടുക്കുക',
        successAdd: 'ഷെഡ്യൂൾ വിജയകരമായി ചേർത്തു!',
        successUpdate: 'ഷെഡ്യൂൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!',
        successDelete: 'ഷെഡ്യൂൾ വിജയകരമായി ഇല്ലാതാക്കി!',
        successComplete: 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തി!',
        successPending: 'കാത്തിരിക്കുന്നതായി അടയാളപ്പെടുത്തി!',

        // Empty states
        noSchedulesToday: 'ഇന്ന് ഒരു ശേഖരണവും ഷെഡ്യൂൾ ചെയ്തിട്ടില്ല',
        noUpcoming: 'വരാനിരിക്കുന്ന ഷെഡ്യൂളുകൾ ഒന്നും ഇല്ല',
        loading: 'ലോഡ് ചെയ്യുന്നു...',

        // Days
        monday: 'തിങ്കൾ',
        tuesday: 'ചൊവ്വ',
        wednesday: 'ബുധൻ',
        thursday: 'വ്യാഴം',
        friday: 'വെള്ളി',
        saturday: 'ശനി',
        sunday: 'ഞായർ',
    },
};

export default translations;
