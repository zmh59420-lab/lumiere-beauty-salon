document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // AUTH
    // =====================================================

    if (
        sessionStorage.getItem("lumiereAdminLoggedIn") !== "true"
    ) {

        window.location.href =
            "admin-login.html";

        return;
    }


    // =====================================================
    // ELEMENTS
    // =====================================================

    const tableBody =
        document.getElementById("adminServicesTableBody");

    const emptyState =
        document.getElementById("adminServicesEmpty");

    const searchInput =
        document.getElementById("adminServiceSearch");

    const filterButtons =
        document.querySelectorAll(
            ".admin-service-filter-btn"
        );

    const resultsCount =
        document.getElementById("adminServiceResultsCount");


    const totalElement =
        document.getElementById("adminServicesTotal");

    const activeElement =
        document.getElementById("adminServicesActive");

    const inactiveElement =
        document.getElementById("adminServicesInactive");

    const averageElement =
        document.getElementById("adminServicesAverage");


    // ADD BUTTON

    const addButton =
        document.getElementById("adminAddServiceBtn");


    // FORM MODAL

    const formModal =
        document.getElementById("adminServiceFormModal");

    const formOverlay =
        document.getElementById("adminServiceFormOverlay");

    const formClose =
        document.getElementById("adminServiceFormClose");

    const formCancel =
        document.getElementById("adminServiceFormCancel");

    const formTitle =
        document.getElementById("adminServiceFormTitle");

    const form =
        document.getElementById("adminServiceForm");

    const formError =
        document.getElementById("adminServiceFormError");


    // INPUTS

    const nameInput =
        document.getElementById("adminServiceName");

    const categoryInput =
        document.getElementById("adminServiceCategory");

    const priceInput =
        document.getElementById("adminServicePrice");

    const durationInput =
        document.getElementById("adminServiceDuration");

    const statusInput =
        document.getElementById("adminServiceStatus");

    const descriptionInput =
        document.getElementById("adminServiceDescription");


    // DELETE MODAL

    const deleteModal =
        document.getElementById("adminDeleteServiceModal");

    const deleteOverlay =
        document.getElementById("adminDeleteServiceOverlay");

    const deleteCancel =
        document.getElementById("adminDeleteServiceCancel");

    const deleteConfirm =
        document.getElementById("adminDeleteServiceConfirm");


    // TOAST

    const toast =
        document.getElementById("adminServiceToast");

    const toastText =
        document.getElementById("adminServiceToastText");


    // SIDEBAR

    const sidebar =
        document.getElementById("adminSidebar");

    const sidebarOverlay =
        document.getElementById("adminSidebarOverlay");

    const mobileMenu =
        document.getElementById("adminMobileMenu");

    const logoutButton =
        document.getElementById("adminLogoutBtn");

    const sidebarBookingsCount =
        document.getElementById("sidebarBookingsCount");

    const currentDate =
        document.getElementById("adminCurrentDate");


    // =====================================================
    // STATE
    // =====================================================

    let services = [];

    let currentFilter =
        "all";

    let editingServiceId =
        null;

    let deletingServiceId =
        null;


    // =====================================================
    // DEFAULT SERVICES
    // تظهر فقط أول مرة
    // =====================================================

    const defaultServices = [

        {
            id: "service-hair-cut",
            name: "قص الشعر",
            category: "الشعر",
            price: 80,
            duration: 45,
            status: "active",
            description: "قص احترافي يناسب شكل الوجه وإطلالتك"
        },

        {
            id: "service-blowdry",
            name: "استشوار",
            category: "الشعر",
            price: 70,
            duration: 45,
            status: "active",
            description: "تصفيف ناعم وأنيق للشعر"
        },

        {
            id: "service-hair-color",
            name: "صبغة شعر",
            category: "الشعر",
            price: 250,
            duration: 120,
            status: "active",
            description: "صبغة احترافية بلون يناسب إطلالتك"
        },

        {
            id: "service-manicure",
            name: "مانيكير",
            category: "الأظافر",
            price: 80,
            duration: 45,
            status: "active",
            description: "عناية وتنظيف وتجميل الأظافر"
        },

        {
            id: "service-pedicure",
            name: "بديكير",
            category: "الأظافر",
            price: 100,
            duration: 60,
            status: "active",
            description: "عناية متكاملة بالقدمين والأظافر"
        },

        {
            id: "service-facial",
            name: "تنظيف البشرة",
            category: "البشرة",
            price: 150,
            duration: 60,
            status: "active",
            description: "تنظيف لطيف وعميق يمنح البشرة انتعاشاً"
        },

        {
            id: "service-glow",
            name: "جلسة نضارة",
            category: "البشرة",
            price: 180,
            duration: 60,
            status: "active",
            description: "جلسة عناية تمنح البشرة إشراقة ونضارة"
        },

        {
            id: "service-soft-makeup",
            name: "مكياج ناعم",
            category: "المكياج",
            price: 180,
            duration: 60,
            status: "active",
            description: "إطلالة ناعمة وأنيقة تناسب يومك"
        },

        {
            id: "service-evening-makeup",
            name: "مكياج سهرة",
            category: "المكياج",
            price: 250,
            duration: 75,
            status: "active",
            description: "مكياج متكامل لإطلالة أكثر فخامة"
        }

    ];


    // =====================================================
    // STORAGE
    // =====================================================

    function loadServices() {

        const raw =
            localStorage.getItem(
                "lumiereServices"
            );


        // أول مرة فقط
        if (raw === null) {

            services =
                [...defaultServices];


            saveServices();

            return;
        }


        try {

            const parsed =
                JSON.parse(raw);


            services =
                Array.isArray(parsed)
                    ? parsed
                    : [];

        } catch (error) {

            services = [];
        }
    }


    function saveServices() {

        localStorage.setItem(
            "lumiereServices",
            JSON.stringify(services)
        );
    }


    // =====================================================
    // HELPERS
    // =====================================================

    function createId() {

        return (
            "service-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 10000
            )
        );
    }


    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);


        return div.innerHTML;
    }


    function isActive(service) {

        return (
            String(service.status || "active")
                .toLowerCase()
            !== "inactive"
        );
    }


    function formatPrice(price) {

        const number =
            Number(price || 0);


        if (Number.isNaN(number)) {
            return "0";
        }


        return number.toLocaleString(
            "en-US"
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
    // STATS
    // =====================================================

    function updateStats() {

        const activeServices =
            services.filter(isActive);


        const inactiveServices =
            services.filter(
                function (service) {

                    return !isActive(service);
                }
            );


        let totalPrice = 0;


        services.forEach(
            function (service) {

                const price =
                    Number(service.price || 0);


                if (!Number.isNaN(price)) {

                    totalPrice += price;
                }
            }
        );


        const average =
            services.length > 0
                ? Math.round(
                    totalPrice /
                    services.length
                )
                : 0;


        if (totalElement) {

            totalElement.textContent =
                services.length;
        }


        if (activeElement) {

            activeElement.textContent =
                activeServices.length;
        }


        if (inactiveElement) {

            inactiveElement.textContent =
                inactiveServices.length;
        }


        if (averageElement) {

            averageElement.textContent =
                average.toLocaleString(
                    "en-US"
                );
        }
    }


    // =====================================================
    // FILTERED SERVICES
    // =====================================================

    function getFilteredServices() {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        return services.filter(
            function (service) {

                const searchable =
                    [
                        service.name,
                        service.category,
                        service.description
                    ]
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    searchable.includes(
                        searchValue
                    );


                let matchesFilter =
                    true;


                if (
                    currentFilter === "active"
                ) {

                    matchesFilter =
                        isActive(service);
                }


                if (
                    currentFilter === "inactive"
                ) {

                    matchesFilter =
                        !isActive(service);
                }


                return (
                    matchesSearch &&
                    matchesFilter
                );
            }
        );
    }


    // =====================================================
    // RENDER
    // =====================================================

    function renderServices() {

        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        const filtered =
            getFilteredServices();


        if (resultsCount) {

            resultsCount.textContent =
                filtered.length +
                " خدمة";
        }


        if (filtered.length === 0) {

            if (emptyState) {
                emptyState.style.display =
                    "block";
            }

            updateStats();

            return;
        }


        if (emptyState) {

            emptyState.style.display =
                "none";
        }


        filtered.forEach(
            function (service) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const active =
                    isActive(service);


                row.innerHTML = `

                    <td>

                        <div class="admin-service-name-cell">

                            <div class="admin-service-table-icon">

                                <i class="fa-solid fa-scissors"></i>

                            </div>


                            <div>

                                <strong>
                                    ${escapeHTML(service.name)}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        service.description || ""
                                    )}
                                </span>

                            </div>

                        </div>

                    </td>


                    <td>
                        ${escapeHTML(service.category)}
                    </td>


                    <td>

                        <strong class="admin-service-price">

                            ${formatPrice(service.price)}
                            ر.س

                        </strong>

                    </td>


                    <td>

                        ${
                            service.duration
                                ? escapeHTML(service.duration) +
                                  " دقيقة"
                                : "-"
                        }

                    </td>


                    <td>

                        <span class="admin-service-status ${
                            active
                                ? "active"
                                : "inactive"
                        }">

                            ${
                                active
                                    ? "نشطة"
                                    : "غير نشطة"
                            }

                        </span>

                    </td>


                    <td>

                        <div class="admin-service-actions">


                            <button
                                type="button"
                                class="admin-service-action-btn edit"
                                data-action="edit"
                                data-id="${escapeHTML(service.id)}"
                                title="تعديل"
                            >

                                <i class="fa-regular fa-pen-to-square"></i>

                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn toggle"
                                data-action="toggle"
                                data-id="${escapeHTML(service.id)}"
                                title="تغيير الحالة"
                            >

                                <i class="fa-solid ${
                                    active
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                }"></i>

                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn delete"
                                data-action="delete"
                                data-id="${escapeHTML(service.id)}"
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


        updateStats();
    }


    // =====================================================
    // FORM MODAL
    // =====================================================

    function openFormModal(service) {

        if (!formModal || !formOverlay) {
            return;
        }


        if (formError) {
            formError.textContent = "";
        }


        if (service) {

            editingServiceId =
                service.id;


            if (formTitle) {

                formTitle.textContent =
                    "تعديل الخدمة";
            }


            nameInput.value =
                service.name || "";

            categoryInput.value =
                service.category || "";

            priceInput.value =
                service.price || "";

            durationInput.value =
                service.duration || "";

            statusInput.value =
                isActive(service)
                    ? "active"
                    : "inactive";

            descriptionInput.value =
                service.description || "";

        } else {

            editingServiceId =
                null;


            if (formTitle) {

                formTitle.textContent =
                    "إضافة خدمة";
            }


            form.reset();

            statusInput.value =
                "active";
        }


        formOverlay.classList.add(
            "show"
        );

        formModal.classList.add(
            "show"
        );


        document.body.classList.add(
            "admin-modal-open"
        );


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

        if (formOverlay) {
            formOverlay.classList.remove("show");
        }

        if (formModal) {
            formModal.classList.remove("show");
        }


        document.body.classList.remove(
            "admin-modal-open"
        );


        editingServiceId =
            null;


        if (formError) {
            formError.textContent = "";
        }
    }


    // =====================================================
    // ADD BUTTON
    // =====================================================

    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                openFormModal(null);
            }
        );
    }


    if (formClose) {

        formClose.addEventListener(
            "click",
            closeFormModal
        );
    }


    if (formCancel) {

        formCancel.addEventListener(
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
    // SAVE FORM
    // =====================================================

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    nameInput.value.trim();

                const category =
                    categoryInput.value.trim();

                const price =
                    Number(
                        priceInput.value
                    );

                const duration =
                    Number(
                        durationInput.value || 0
                    );

                const status =
                    statusInput.value;

                const description =
                    descriptionInput.value.trim();


                // VALIDATION

                if (!name) {

                    formError.textContent =
                        "اكتبي اسم الخدمة.";

                    nameInput.focus();

                    return;
                }


                if (!category) {

                    formError.textContent =
                        "اختاري قسم الخدمة.";

                    categoryInput.focus();

                    return;
                }


                if (
                    priceInput.value === "" ||
                    Number.isNaN(price) ||
                    price < 0
                ) {

                    formError.textContent =
                        "اكتبي سعر الخدمة بشكل صحيح.";

                    priceInput.focus();

                    return;
                }


                // EDIT

                if (editingServiceId) {

                    const index =
                        services.findIndex(
                            function (service) {

                                return (
                                    service.id ===
                                    editingServiceId
                                );
                            }
                        );


                    if (index !== -1) {

                        services[index] = {

                            ...services[index],

                            name:
                                name,

                            category:
                                category,

                            price:
                                price,

                            duration:
                                duration,

                            status:
                                status,

                            description:
                                description,

                            updatedAt:
                                new Date()
                                    .toISOString()

                        };
                    }


                    saveServices();

                    closeFormModal();

                    renderServices();

                    showToast(
                        "تم تعديل الخدمة بنجاح"
                    );

                    return;
                }


                // ADD

                const newService = {

                    id:
                        createId(),

                    name:
                        name,

                    category:
                        category,

                    price:
                        price,

                    duration:
                        duration,

                    status:
                        status,

                    description:
                        description,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                services.push(
                    newService
                );


                saveServices();

                closeFormModal();

                renderServices();

                showToast(
                    "تمت إضافة الخدمة بنجاح"
                );
            }
        );
    }


    // =====================================================
    // TABLE ACTIONS
    // =====================================================

    if (tableBody) {

        tableBody.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;

                const id =
                    button.dataset.id;


                const service =
                    services.find(
                        function (item) {

                            return (
                                String(item.id) ===
                                String(id)
                            );
                        }
                    );


                if (!service) {
                    return;
                }


                // EDIT

                if (action === "edit") {

                    openFormModal(
                        service
                    );

                    return;
                }


                // TOGGLE

                if (action === "toggle") {

                    service.status =
                        isActive(service)
                            ? "inactive"
                            : "active";


                    saveServices();

                    renderServices();


                    showToast(
                        service.status === "active"
                            ? "تم تفعيل الخدمة"
                            : "تم إيقاف الخدمة"
                    );

                    return;
                }


                // DELETE

                if (action === "delete") {

                    openDeleteModal(
                        service.id
                    );
                }
            }
        );
    }


    // =====================================================
    // DELETE MODAL
    // =====================================================

    function openDeleteModal(id) {

        deletingServiceId =
            id;


        if (deleteOverlay) {

            deleteOverlay.classList.add(
                "show"
            );
        }


        if (deleteModal) {

            deleteModal.classList.add(
                "show"
            );
        }


        document.body.classList.add(
            "admin-modal-open"
        );
    }


    function closeDeleteModal() {

        deletingServiceId =
            null;


        if (deleteOverlay) {

            deleteOverlay.classList.remove(
                "show"
            );
        }


        if (deleteModal) {

            deleteModal.classList.remove(
                "show"
            );
        }


        document.body.classList.remove(
            "admin-modal-open"
        );
    }


    if (deleteCancel) {

        deleteCancel.addEventListener(
            "click",
            closeDeleteModal
        );
    }


    if (deleteOverlay) {

        deleteOverlay.addEventListener(
            "click",
            closeDeleteModal
        );
    }


    if (deleteConfirm) {

        deleteConfirm.addEventListener(
            "click",
            function () {

                if (!deletingServiceId) {
                    return;
                }


                services =
                    services.filter(
                        function (service) {

                            return (
                                String(service.id) !==
                                String(deletingServiceId)
                            );
                        }
                    );


                saveServices();

                closeDeleteModal();

                renderServices();

                showToast(
                    "تم حذف الخدمة"
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
            renderServices
        );
    }


    // =====================================================
    // FILTERS
    // =====================================================

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

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


                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    renderServices();
                }
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


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


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

    loadServices();

    renderServices();

});