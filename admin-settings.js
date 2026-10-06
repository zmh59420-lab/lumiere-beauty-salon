document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // AUTH
    // =====================================================

    if (
        sessionStorage.getItem("lumiereAdminLoggedIn") !== "true"
    ) {
        window.location.href = "admin-login.html";
        return;
    }


    // =====================================================
    // ELEMENTS
    // =====================================================

    const form =
        document.getElementById("adminSettingsForm");

    const salonName =
        document.getElementById("settingSalonName");

    const phone =
        document.getElementById("settingPhone");

    const whatsapp =
        document.getElementById("settingWhatsapp");

    const email =
        document.getElementById("settingEmail");

    const address =
        document.getElementById("settingAddress");

    const openTime =
        document.getElementById("settingOpenTime");

    const closeTime =
        document.getElementById("settingCloseTime");

    const workingDays =
        document.getElementById("settingWorkingDays");

    const slotDuration =
        document.getElementById("settingSlotDuration");

    const advanceDays =
        document.getElementById("settingAdvanceDays");

    const cancelHours =
        document.getElementById("settingCancelHours");

    const cancellationPolicy =
        document.getElementById("settingCancellationPolicy");


    const currentDate =
        document.getElementById("adminCurrentDate");

    const sidebarBookingsCount =
        document.getElementById("sidebarBookingsCount");

    const sidebar =
        document.getElementById("adminSidebar");

    const sidebarOverlay =
        document.getElementById("adminSidebarOverlay");

    const mobileMenu =
        document.getElementById("adminMobileMenu");

    const logoutButton =
        document.getElementById("adminLogoutBtn");

    const toast =
        document.getElementById("adminSettingsToast");

    const toastText =
        document.getElementById("adminSettingsToastText");


    // =====================================================
    // DEFAULT SETTINGS
    // =====================================================

    const defaultSettings = {

        salonName:
            "LUMIÈRE Beauty Salon",

        phone:
            "",

        whatsapp:
            "",

        email:
            "",

        address:
            "",

        openTime:
            "10:00",

        closeTime:
            "22:00",

        workingDays:
            "sat-thu",

        slotDuration:
            "30",

        advanceDays:
            "30",

        cancelHours:
            "6",

        cancellationPolicy:
            "يمكن تعديل أو إلغاء الموعد قبل الموعد بوقت كافٍ."

    };


    // =====================================================
    // LOAD
    // =====================================================

    function loadSettings() {

        const raw =
            localStorage.getItem(
                "lumiereSettings"
            );


        let settings =
            defaultSettings;


        if (raw !== null) {

            try {

                const parsed =
                    JSON.parse(raw);


                settings = {
                    ...defaultSettings,
                    ...parsed
                };

            } catch (error) {

                settings =
                    defaultSettings;
            }
        }


        salonName.value =
            settings.salonName;

        phone.value =
            settings.phone;

        whatsapp.value =
            settings.whatsapp;

        email.value =
            settings.email;

        address.value =
            settings.address;

        openTime.value =
            settings.openTime;

        closeTime.value =
            settings.closeTime;

        workingDays.value =
            settings.workingDays;

        slotDuration.value =
            settings.slotDuration;

        advanceDays.value =
            settings.advanceDays;

        cancelHours.value =
            settings.cancelHours;

        cancellationPolicy.value =
            settings.cancellationPolicy;
    }


    // =====================================================
    // SAVE
    // =====================================================

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const settings = {

                salonName:
                    salonName.value.trim(),

                phone:
                    phone.value.trim(),

                whatsapp:
                    whatsapp.value.trim(),

                email:
                    email.value.trim(),

                address:
                    address.value.trim(),

                openTime:
                    openTime.value,

                closeTime:
                    closeTime.value,

                workingDays:
                    workingDays.value,

                slotDuration:
                    slotDuration.value,

                advanceDays:
                    advanceDays.value,

                cancelHours:
                    cancelHours.value,

                cancellationPolicy:
                    cancellationPolicy.value.trim(),

                updatedAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "lumiereSettings",
                JSON.stringify(settings)
            );


            showToast(
                "تم حفظ إعدادات الصالون"
            );
        }
    );


    // =====================================================
    // TOAST
    // =====================================================

    let toastTimer;


    function showToast(message) {

        if (!toast) {
            return;
        }


        if (toastText) {
            toastText.textContent =
                message;
        }


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2500
            );
    }


    // =====================================================
    // DATE
    // =====================================================

    if (currentDate) {

        currentDate.textContent =
            new Date().toLocaleDateString(
                "ar-SA",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );
    }


    // =====================================================
    // BOOKINGS COUNT
    // =====================================================

    try {

        const bookings =
            JSON.parse(
                localStorage.getItem("bookings")
            );


        if (sidebarBookingsCount) {

            sidebarBookingsCount.textContent =
                Array.isArray(bookings)
                    ? bookings.length
                    : 0;
        }

    } catch (error) {

        if (sidebarBookingsCount) {
            sidebarBookingsCount.textContent = "0";
        }
    }


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("show");
        }
    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }
    }


    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            openSidebar
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                sessionStorage.removeItem(
                    "lumiereAdminLoggedIn"
                );


                window.location.href =
                    "admin-login.html";
            }
        );
    }


    // =====================================================
    // START
    // =====================================================

    loadSettings();

});