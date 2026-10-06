document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // LOGIN
    // =====================================================

    if (sessionStorage.getItem("lumiereAdminLoggedIn") !== "true") {
        window.location.href = "admin-login.html";
        return;
    }


    // =====================================================
    // ELEMENTS
    // =====================================================

    const totalEl = document.getElementById("adminOffersTotal");
    const activeEl = document.getElementById("adminOffersActive");
    const inactiveEl = document.getElementById("adminOffersInactive");
    const averageEl = document.getElementById("adminOffersAverage");

    const searchInput = document.getElementById("adminOfferSearch");
    const filterButtons = document.querySelectorAll(".admin-offer-filter");

    const resultsCount = document.getElementById("adminOfferResultsCount");
    const tableBody = document.getElementById("adminOffersTableBody");
    const emptyState = document.getElementById("adminOffersEmpty");

    const sidebarBookingsCount =
        document.getElementById("sidebarBookingsCount");

    const currentDateEl =
        document.getElementById("adminCurrentDate");


    // =====================================================
    // FORM
    // =====================================================

    const addOfferBtn =
        document.getElementById("adminAddOfferBtn");

    const formModal =
        document.getElementById("adminOfferFormModal");

    const formOverlay =
        document.getElementById("adminOfferFormOverlay");

    const formClose =
        document.getElementById("adminOfferFormClose");

    const formTitle =
        document.getElementById("adminOfferFormTitle");

    const offerForm =
        document.getElementById("adminOfferForm");

    const nameInput =
        document.getElementById("adminOfferName");

    const serviceInput =
        document.getElementById("adminOfferService");

    const originalPriceInput =
        document.getElementById("adminOfferOriginalPrice");

    const offerPriceInput =
        document.getElementById("adminOfferPrice");

    const startDateInput =
        document.getElementById("adminOfferStartDate");

    const endDateInput =
        document.getElementById("adminOfferEndDate");

    const statusInput =
        document.getElementById("adminOfferStatus");

    const descriptionInput =
        document.getElementById("adminOfferDescription");

    const formError =
        document.getElementById("adminOfferFormError");


    // =====================================================
    // DELETE
    // =====================================================

    const deleteModal =
        document.getElementById("adminDeleteOfferModal");

    const deleteOverlay =
        document.getElementById("adminDeleteOfferOverlay");

    const deleteCancel =
        document.getElementById("adminDeleteOfferCancel");

    const deleteConfirm =
        document.getElementById("adminDeleteOfferConfirm");


    // =====================================================
    // TOAST
    // =====================================================

    const toast =
        document.getElementById("adminOfferToast");

    const toastText =
        document.getElementById("adminOfferToastText");


    // =====================================================
    // SIDEBAR
    // =====================================================

    const logoutBtn =
        document.getElementById("adminLogoutBtn");

    const mobileMenuBtn =
        document.getElementById("adminMobileMenu");

    const sidebar =
        document.getElementById("adminSidebar");

    const sidebarOverlay =
        document.getElementById("adminSidebarOverlay");


    // =====================================================
    // DATA
    // =====================================================

    let offers = [];
    let services = [];
    let bookings = [];

    let currentFilter = "all";
    let editingOfferId = null;
    let deletingOfferId = null;

    let toastTimer = null;


    // =====================================================
    // HELPERS
    // =====================================================

    function safeArray(key) {

        try {

            const value =
                JSON.parse(
                    localStorage.getItem(key)
                );

            return Array.isArray(value)
                ? value
                : [];

        } catch (error) {

            return [];
        }
    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value === undefined ||
            value === null ||
            value === ""
                ? "-"
                : String(value);

        return div.innerHTML;
    }


    function getPrice(value) {

        const number =
            Number(
                String(value || 0)
                    .replace(/[^\d.]/g, "")
            );

        return Number.isNaN(number)
            ? 0
            : number;
    }


    function generateOfferId() {

        return (
            "OFF-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 10000)
        );
    }


    function getTodayKey() {

        const date = new Date();

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    const todayKey = getTodayKey();


    // =====================================================
    // CURRENT DATE
    // =====================================================

    if (currentDateEl) {

        currentDateEl.textContent =
            new Intl.DateTimeFormat(
                "ar-SA",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(new Date());
    }


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    function loadBookings() {

        bookings = safeArray("bookings");


        if (sidebarBookingsCount) {

            const confirmed =
                bookings.filter(function (booking) {

                    return (
                        booking.status === "مؤكد"
                    );
                }).length;


            sidebarBookingsCount.textContent =
                confirmed;
        }
    }


    // =====================================================
    // LOAD SERVICES
    // =====================================================

    function loadServices() {

        services =
            safeArray("lumiereServices");
    }


    // =====================================================
    // LOAD OFFERS
    // =====================================================

    function loadOffers() {

        /*
            مهم:
            نتحقق هل المفتاح موجود أصلًا،
            وليس فقط هل المصفوفة فارغة.

            بهذه الطريقة لو حذفتي كل العروض
            ما ترجع تظهر من جديد.
        */

        const saved =
            localStorage.getItem(
                "lumiereOffers"
            );


        if (saved === null) {

            offers = [];

            saveOffers();

            return;
        }


        offers =
            safeArray("lumiereOffers")
                .map(function (offer) {

                    return {

                        id:
                            offer.id ||
                            generateOfferId(),

                        name:
                            offer.name ||
                            "عرض LUMIÈRE",

                        service:
                            offer.service || "",

                        originalPrice:
                            getPrice(
                                offer.originalPrice
                            ),

                        offerPrice:
                            getPrice(
                                offer.offerPrice
                            ),

                        startDate:
                            offer.startDate || "",

                        endDate:
                            offer.endDate || "",

                        status:
                            offer.status === "inactive"
                                ? "inactive"
                                : "active",

                        description:
                            offer.description || ""
                    };
                });


        saveOffers();
    }


    function saveOffers() {

        localStorage.setItem(
            "lumiereOffers",
            JSON.stringify(offers)
        );
    }


    // =====================================================
    // SERVICE SELECT
    // =====================================================

    function fillServiceSelect() {

        if (!serviceInput) return;


        const previousValue =
            serviceInput.value;


        serviceInput.innerHTML = `
            <option value="">
                اختاري الخدمة
            </option>
        `;


        services
            .filter(function (service) {

                return (
                    service.status !==
                    "inactive"
                );
            })
            .forEach(function (service) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    service.name;


                option.textContent =
                    `${service.name} - ${getPrice(service.price)} ر.س`;


                option.dataset.price =
                    getPrice(service.price);


                serviceInput.appendChild(
                    option
                );
            });


        serviceInput.value =
            previousValue;
    }


    // =====================================================
    // AUTO ORIGINAL PRICE
    // =====================================================

    if (serviceInput) {

        serviceInput.addEventListener(
            "change",
            function () {

                const selected =
                    serviceInput.options[
                        serviceInput.selectedIndex
                    ];


                if (
                    selected &&
                    selected.dataset.price !==
                    undefined
                ) {

                    originalPriceInput.value =
                        selected.dataset.price;
                }
            }
        );
    }


    // =====================================================
    // DISCOUNT
    // =====================================================

    function calculateDiscount(
        originalPrice,
        offerPrice
    ) {

        originalPrice =
            getPrice(originalPrice);

        offerPrice =
            getPrice(offerPrice);


        if (
            originalPrice <= 0 ||
            offerPrice < 0 ||
            offerPrice >= originalPrice
        ) {

            return 0;
        }


        return Math.round(
            (
                (
                    originalPrice -
                    offerPrice
                ) /
                originalPrice
            ) * 100
        );
    }


    // =====================================================
    // OFFER ACTIVE STATUS
    // =====================================================

    function isOfferCurrentlyActive(offer) {

        if (offer.status !== "active") {
            return false;
        }


        if (
            offer.startDate &&
            todayKey < offer.startDate
        ) {

            return false;
        }


        if (
            offer.endDate &&
            todayKey > offer.endDate
        ) {

            return false;
        }


        return true;
    }


    // =====================================================
    // STATS
    // =====================================================

    function updateStats() {

        const active =
            offers.filter(function (offer) {

                return isOfferCurrentlyActive(
                    offer
                );
            }).length;


        const inactive =
            offers.length - active;


        let totalDiscount = 0;


        offers.forEach(function (offer) {

            totalDiscount +=
                calculateDiscount(
                    offer.originalPrice,
                    offer.offerPrice
                );
        });


        const average =
            offers.length
                ? Math.round(
                    totalDiscount /
                    offers.length
                )
                : 0;


        if (totalEl) {
            totalEl.textContent =
                offers.length;
        }


        if (activeEl) {
            activeEl.textContent =
                active;
        }


        if (inactiveEl) {
            inactiveEl.textContent =
                inactive;
        }


        if (averageEl) {
            averageEl.textContent =
                average;
        }
    }


    // =====================================================
    // FILTER
    // =====================================================

    function getFilteredOffers() {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        return offers.filter(
            function (offer) {

                const currentlyActive =
                    isOfferCurrentlyActive(
                        offer
                    );


                if (
                    currentFilter === "active" &&
                    !currentlyActive
                ) {

                    return false;
                }


                if (
                    currentFilter === "inactive" &&
                    currentlyActive
                ) {

                    return false;
                }


                if (searchValue) {

                    const text =
                        (
                            offer.name +
                            " " +
                            offer.service +
                            " " +
                            offer.description
                        ).toLowerCase();


                    if (
                        !text.includes(
                            searchValue
                        )
                    ) {

                        return false;
                    }
                }


                return true;
            }
        );
    }


    // =====================================================
    // STATUS TEXT
    // =====================================================

    function getOfferStatus(offer) {

        if (offer.status === "inactive") {

            return {
                text: "متوقف",
                className: "inactive"
            };
        }


        if (
            offer.startDate &&
            todayKey < offer.startDate
        ) {

            return {
                text: "قريبًا",
                className: "upcoming"
            };
        }


        if (
            offer.endDate &&
            todayKey > offer.endDate
        ) {

            return {
                text: "منتهي",
                className: "expired"
            };
        }


        return {
            text: "نشط",
            className: "active"
        };
    }


    // =====================================================
    // DISPLAY
    // =====================================================

    function displayOffers() {

        if (!tableBody) return;


        tableBody.innerHTML = "";


        const filtered =
            getFilteredOffers();


        if (resultsCount) {

            resultsCount.textContent =
                filtered.length;
        }


        if (filtered.length === 0) {

            if (emptyState) {

                emptyState.style.display =
                    "flex";
            }

            return;
        }


        if (emptyState) {

            emptyState.style.display =
                "none";
        }


        filtered.forEach(
            function (offer) {

                const discount =
                    calculateDiscount(
                        offer.originalPrice,
                        offer.offerPrice
                    );


                const status =
                    getOfferStatus(offer);


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="admin-offer-name">

                            <div class="admin-offer-icon">
                                <i class="fa-solid fa-tag"></i>
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(offer.name)}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        offer.description ||
                                        "عرض خاص من LUMIÈRE"
                                    )}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${escapeHTML(offer.service)}
                    </td>


                    <td>

                        <span class="admin-old-price">
                            ${offer.originalPrice.toLocaleString("en-US")}
                            ر.س
                        </span>

                    </td>


                    <td>

                        <strong class="admin-offer-price">
                            ${offer.offerPrice.toLocaleString("en-US")}
                            ر.س
                        </strong>

                    </td>


                    <td>

                        <span class="admin-discount-badge">

                            ${
                                discount > 0
                                    ? `-${discount}%`
                                    : "-"
                            }

                        </span>

                    </td>


                    <td>
                        ${escapeHTML(
                            offer.endDate ||
                            "بدون تاريخ"
                        )}
                    </td>


                    <td>

                        <span
                            class="admin-offer-status ${status.className}"
                        >
                            ${status.text}
                        </span>

                    </td>


                    <td>

                        <div class="admin-service-actions">

                            <button
                                type="button"
                                class="admin-service-action-btn edit"
                                data-action="edit"
                                data-id="${escapeHTML(offer.id)}"
                                title="تعديل"
                            >
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn toggle"
                                data-action="toggle"
                                data-id="${escapeHTML(offer.id)}"
                                title="${
                                    offer.status === "active"
                                        ? "إيقاف"
                                        : "تفعيل"
                                }"
                            >

                                <i class="fa-solid ${
                                    offer.status === "active"
                                        ? "fa-toggle-on"
                                        : "fa-toggle-off"
                                }"></i>

                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn delete"
                                data-action="delete"
                                data-id="${escapeHTML(offer.id)}"
                                title="حذف"
                            >
                                <i class="fa-regular fa-trash-can"></i>
                            </button>

                        </div>

                    </td>
                `;


                tableBody.appendChild(
                    row
                );
            }
        );


        setupActionButtons();
    }


    // =====================================================
    // ACTION BUTTONS
    // =====================================================

    function setupActionButtons() {

        const buttons =
            tableBody.querySelectorAll(
                "[data-action][data-id]"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            button.getAttribute(
                                "data-id"
                            );


                        const action =
                            button.getAttribute(
                                "data-action"
                            );


                        if (action === "edit") {

                            openEditOffer(id);

                            return;
                        }


                        if (action === "toggle") {

                            toggleOffer(id);

                            return;
                        }


                        if (action === "delete") {

                            openDeleteOffer(id);
                        }
                    }
                );
            }
        );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            displayOffers
        );
    }


    // =====================================================
    // FILTER BUTTONS
    // =====================================================

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        button.getAttribute(
                            "data-filter"
                        ) || "all";


                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    displayOffers();
                }
            );
        }
    );


    // =====================================================
    // ADD
    // =====================================================

    function openAddOffer() {

        editingOfferId = null;


        if (offerForm) {
            offerForm.reset();
        }


        fillServiceSelect();


        if (formTitle) {

            formTitle.textContent =
                "إضافة عرض جديد";
        }


        if (statusInput) {

            statusInput.value =
                "active";
        }


        if (startDateInput) {

            startDateInput.value =
                todayKey;
        }


        clearError();

        openFormModal();
    }


    if (addOfferBtn) {

        addOfferBtn.addEventListener(
            "click",
            openAddOffer
        );
    }


    // =====================================================
    // EDIT
    // =====================================================

    function openEditOffer(id) {

        const offer =
            offers.find(
                function (item) {

                    return item.id === id;
                }
            );


        if (!offer) return;


        editingOfferId =
            offer.id;


        fillServiceSelect();

        ensureServiceOption(
            offer.service
        );


        if (formTitle) {

            formTitle.textContent =
                "تعديل العرض";
        }


        nameInput.value =
            offer.name;

        serviceInput.value =
            offer.service;

        originalPriceInput.value =
            offer.originalPrice;

        offerPriceInput.value =
            offer.offerPrice;

        startDateInput.value =
            offer.startDate;

        endDateInput.value =
            offer.endDate;

        statusInput.value =
            offer.status;

        descriptionInput.value =
            offer.description;


        clearError();

        openFormModal();
    }


    function ensureServiceOption(value) {

        if (!value) return;


        const exists =
            Array.from(
                serviceInput.options
            ).some(
                function (option) {

                    return (
                        option.value ===
                        value
                    );
                }
            );


        if (!exists) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = value;
            option.textContent = value;

            serviceInput.appendChild(
                option
            );
        }
    }


    // =====================================================
    // OPEN/CLOSE FORM
    // =====================================================

    function openFormModal() {

        if (!formModal) return;


        formModal.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";


        setTimeout(
            function () {

                if (nameInput) {
                    nameInput.focus();
                }

            },
            100
        );
    }


    function closeFormModal() {

        if (formModal) {

            formModal.classList.remove(
                "show"
            );
        }


        editingOfferId = null;

        document.body.style.overflow = "";
    }


    if (formClose) {

        formClose.addEventListener(
            "click",
            closeFormModal
        );
    }


    if (formOverlay) {

        formOverlay.addEventListener(
            "click",
            closeFormModal
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    function showError(message) {

        if (formError) {

            formError.textContent =
                message;
        }
    }


    function clearError() {

        if (formError) {

            formError.textContent = "";
        }
    }


    // =====================================================
    // SAVE OFFER
    // =====================================================

    if (offerForm) {

        offerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                clearError();


                const name =
                    nameInput.value.trim();


                const service =
                    serviceInput.value;


                const originalPrice =
                    Number(
                        originalPriceInput.value
                    );


                const offerPrice =
                    Number(
                        offerPriceInput.value
                    );


                const startDate =
                    startDateInput.value;


                const endDate =
                    endDateInput.value;


                const status =
                    statusInput.value;


                const description =
                    descriptionInput.value.trim();


                // ==============================
                // VALIDATION
                // ==============================

                if (!name) {

                    showError(
                        "اكتبي اسم العرض."
                    );

                    return;
                }


                if (!service) {

                    showError(
                        "اختاري الخدمة."
                    );

                    return;
                }


                if (
                    Number.isNaN(originalPrice) ||
                    originalPrice <= 0
                ) {

                    showError(
                        "اكتبي السعر الأصلي بشكل صحيح."
                    );

                    return;
                }


                if (
                    Number.isNaN(offerPrice) ||
                    offerPrice <= 0
                ) {

                    showError(
                        "اكتبي سعر العرض بشكل صحيح."
                    );

                    return;
                }


                if (
                    offerPrice >= originalPrice
                ) {

                    showError(
                        "سعر العرض يجب أن يكون أقل من السعر الأصلي."
                    );

                    return;
                }


                if (
                    startDate &&
                    endDate &&
                    endDate < startDate
                ) {

                    showError(
                        "تاريخ نهاية العرض يجب أن يكون بعد تاريخ البداية."
                    );

                    return;
                }


                // ==============================
                // EDIT
                // ==============================

                if (editingOfferId) {

                    const index =
                        offers.findIndex(
                            function (offer) {

                                return (
                                    offer.id ===
                                    editingOfferId
                                );
                            }
                        );


                    if (index === -1) {
                        return;
                    }


                    offers[index] = {

                        ...offers[index],

                        name: name,

                        service: service,

                        originalPrice:
                            originalPrice,

                        offerPrice:
                            offerPrice,

                        startDate:
                            startDate,

                        endDate:
                            endDate,

                        status:
                            status,

                        description:
                            description
                    };


                    saveOffers();

                    refreshPage();

                    closeFormModal();

                    showToast(
                        "تم تعديل العرض بنجاح"
                    );

                    return;
                }


                // ==============================
                // ADD
                // ==============================

                const newOffer = {

                    id:
                        generateOfferId(),

                    name:
                        name,

                    service:
                        service,

                    originalPrice:
                        originalPrice,

                    offerPrice:
                        offerPrice,

                    startDate:
                        startDate,

                    endDate:
                        endDate,

                    status:
                        status,

                    description:
                        description,

                    createdAt:
                        new Date().toISOString()
                };


                offers.unshift(
                    newOffer
                );


                saveOffers();

                refreshPage();

                closeFormModal();

                showToast(
                    "تمت إضافة العرض بنجاح"
                );
            }
        );
    }


    // =====================================================
    // TOGGLE
    // =====================================================

    function toggleOffer(id) {

        const index =
            offers.findIndex(
                function (offer) {

                    return offer.id === id;
                }
            );


        if (index === -1) return;


        if (
            offers[index].status ===
            "active"
        ) {

            offers[index].status =
                "inactive";

            showToast(
                "تم إيقاف العرض"
            );

        } else {

            offers[index].status =
                "active";

            showToast(
                "تم تفعيل العرض"
            );
        }


        saveOffers();

        refreshPage();
    }


    // =====================================================
    // DELETE
    // =====================================================

    function openDeleteOffer(id) {

        deletingOfferId = id;


        if (deleteModal) {

            deleteModal.classList.add(
                "show"
            );


            document.body.style.overflow =
                "hidden";
        }
    }


    function closeDeleteOffer() {

        if (deleteModal) {

            deleteModal.classList.remove(
                "show"
            );
        }


        deletingOfferId = null;

        document.body.style.overflow = "";
    }


    if (deleteCancel) {

        deleteCancel.addEventListener(
            "click",
            closeDeleteOffer
        );
    }


    if (deleteOverlay) {

        deleteOverlay.addEventListener(
            "click",
            closeDeleteOffer
        );
    }


    if (deleteConfirm) {

        deleteConfirm.addEventListener(
            "click",
            function () {

                if (!deletingOfferId) {
                    return;
                }


                offers =
                    offers.filter(
                        function (offer) {

                            return (
                                offer.id !==
                                deletingOfferId
                            );
                        }
                    );


                saveOffers();

                refreshPage();

                closeDeleteOffer();

                showToast(
                    "تم حذف العرض"
                );
            }
        );
    }


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        if (!toast || !toastText) {
            return;
        }


        toastText.textContent =
            message;


        toast.classList.add(
            "show"
        );


        if (toastTimer) {

            clearTimeout(
                toastTimer
            );
        }


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
    // SIDEBAR
    // =====================================================

    function openSidebar() {

        if (sidebar) {

            sidebar.classList.add(
                "show"
            );
        }


        if (sidebarOverlay) {

            sidebarOverlay.classList.add(
                "show"
            );
        }


        document.body.style.overflow =
            "hidden";
    }


    function closeSidebar() {

        if (sidebar) {

            sidebar.classList.remove(
                "show"
            );
        }


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "show"
            );
        }


        document.body.style.overflow = "";
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
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

    if (logoutBtn) {

        logoutBtn.addEventListener(
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
    // ESC
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            if (
                deleteModal &&
                deleteModal.classList.contains(
                    "show"
                )
            ) {

                closeDeleteOffer();

                return;
            }


            if (
                formModal &&
                formModal.classList.contains(
                    "show"
                )
            ) {

                closeFormModal();

                return;
            }


            closeSidebar();
        }
    );


    // =====================================================
    // REFRESH
    // =====================================================

    function refreshPage() {

        loadBookings();
        loadServices();
        loadOffers();

        fillServiceSelect();

        updateStats();

        displayOffers();
    }


    // =====================================================
    // START
    // =====================================================

    refreshPage();

});