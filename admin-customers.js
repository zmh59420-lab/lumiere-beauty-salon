document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // حماية صفحة الإدارة
    // =====================================================

    const isAdminLoggedIn =
        sessionStorage.getItem("lumiereAdminLoggedIn");

    if (isAdminLoggedIn !== "true") {
        window.location.href = "admin-login.html";
        return;
    }


    // =====================================================
    // عناصر الصفحة
    // =====================================================

    const customersTotal =
        document.getElementById("adminCustomersTotal");

    const activeCustomers =
        document.getElementById("adminActiveCustomers");

    const customersBookings =
        document.getElementById("adminCustomersBookings");

    const customersRevenue =
        document.getElementById("adminCustomersRevenue");

    const customerSearch =
        document.getElementById("adminCustomerSearch");

    const customerResultsCount =
        document.getElementById("adminCustomerResultsCount");

    const customersTableBody =
        document.getElementById("adminCustomersTableBody");

    const customersEmpty =
        document.getElementById("adminCustomersEmpty");

    const sidebarBookingsCount =
        document.getElementById("sidebarBookingsCount");

    const adminCurrentDate =
        document.getElementById("adminCurrentDate");


    // =====================================================
    // إضافة / تعديل العميلة
    // =====================================================

    const addCustomerBtn =
        document.getElementById("adminAddCustomerBtn");

    const customerFormModal =
        document.getElementById("adminCustomerFormModal");

    const customerFormOverlay =
        document.getElementById("adminCustomerFormOverlay");

    const customerFormClose =
        document.getElementById("adminCustomerFormClose");

    const customerFormTitle =
        document.getElementById("adminCustomerFormTitle");

    const customerForm =
        document.getElementById("adminCustomerForm");

    const customerNameInput =
        document.getElementById("adminCustomerName");

    const customerPhoneInput =
        document.getElementById("adminCustomerPhone");

    const customerNotesInput =
        document.getElementById("adminCustomerNotes");

    const customerFormError =
        document.getElementById("adminCustomerFormError");


    // =====================================================
    // تفاصيل العميلة
    // =====================================================

    const customerModal =
        document.getElementById("adminCustomerModal");

    const customerModalOverlay =
        document.getElementById("adminCustomerModalOverlay");

    const customerModalClose =
        document.getElementById("adminCustomerModalClose");

    const customerDetailsDone =
        document.getElementById("adminCustomerDetailsDone");

    const modalCustomerName =
        document.getElementById("adminModalCustomerName");

    const modalCustomerPhone =
        document.getElementById("adminModalCustomerPhone");

    const modalCustomerBookings =
        document.getElementById("adminModalCustomerBookings");

    const modalCustomerSpent =
        document.getElementById("adminModalCustomerSpent");

    const modalCustomerLastBooking =
        document.getElementById("adminModalCustomerLastBooking");

    const modalCustomerNotes =
        document.getElementById("adminModalCustomerNotes");

    const customerNotesBox =
        document.getElementById("adminCustomerNotesBox");

    const customerBookingHistory =
        document.getElementById("adminCustomerBookingHistory");

    const customerHistoryEmpty =
        document.getElementById("adminCustomerHistoryEmpty");


    // =====================================================
    // حذف العميلة
    // =====================================================

    const deleteCustomerModal =
        document.getElementById("adminDeleteCustomerModal");

    const deleteCustomerOverlay =
        document.getElementById("adminDeleteCustomerOverlay");

    const deleteCustomerCancel =
        document.getElementById("adminDeleteCustomerCancel");

    const deleteCustomerConfirm =
        document.getElementById("adminDeleteCustomerConfirm");


    // =====================================================
    // Toast
    // =====================================================

    const customerToast =
        document.getElementById("adminCustomerToast");

    const customerToastText =
        document.getElementById("adminCustomerToastText");


    // =====================================================
    // Sidebar
    // =====================================================

    const adminLogoutBtn =
        document.getElementById("adminLogoutBtn");

    const adminMobileMenu =
        document.getElementById("adminMobileMenu");

    const adminSidebar =
        document.getElementById("adminSidebar");

    const adminSidebarOverlay =
        document.getElementById("adminSidebarOverlay");


    // =====================================================
    // المتغيرات
    // =====================================================

    let bookings = [];
    let customers = [];

    let editingCustomerId = null;
    let deletingCustomerId = null;

    let toastTimer = null;


    // =====================================================
    // التاريخ
    // =====================================================

    const now = new Date();

    function formatDateKey(date) {

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(date.getDate())
                .padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const todayKey =
        formatDateKey(now);


    if (adminCurrentDate) {

        adminCurrentDate.textContent =
            new Intl.DateTimeFormat(
                "ar-SA",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(now);
    }


    // =====================================================
    // قراءة الحجوزات
    // =====================================================

    function loadBookings() {

        try {

            bookings =
                JSON.parse(
                    localStorage.getItem("bookings")
                ) || [];

        } catch (error) {

            bookings = [];
        }


        bookings =
            bookings.map(function (booking) {

                if (
                    booking.date &&
                    booking.date < todayKey &&
                    booking.status !== "ملغي"
                ) {

                    booking.status = "مكتمل";
                }

                return booking;
            });


        localStorage.setItem(
            "bookings",
            JSON.stringify(bookings)
        );
    }

    loadBookings();


    // =====================================================
    // إنشاء ID
    // =====================================================

    function generateCustomerId() {

        return (
            "CUS-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 10000)
        );
    }


    // =====================================================
    // السعر
    // =====================================================

    function getNumericPrice(price) {

        const number =
            Number(
                String(price || 0)
                    .replace(/[^\d.]/g, "")
            );

        return Number.isNaN(number)
            ? 0
            : number;
    }


    // =====================================================
    // تنظيف رقم الجوال
    // =====================================================

    function normalizePhone(phone) {

        return String(phone || "")
            .replace(/\s/g, "")
            .replace(/-/g, "")
            .trim();
    }


    // =====================================================
    // قراءة العملاء
    // =====================================================

    function loadCustomers() {

        let savedCustomers = [];


        try {

            savedCustomers =
                JSON.parse(
                    localStorage.getItem("lumiereCustomers")
                ) || [];

        } catch (error) {

            savedCustomers = [];
        }


        // -------------------------------------------------
        // استخراج العملاء الموجودين أصلًا من الحجوزات
        // -------------------------------------------------

        const customerMap =
            new Map();


        bookings.forEach(function (booking) {

            let name =
                String(
                    booking.customerName ||
                    booking.name ||
                    ""
                ).trim();


            let phone =
                normalizePhone(
                    booking.customerPhone ||
                    booking.phone ||
                    ""
                );


            // الحجوزات القديمة قد لا تحتوي بيانات العميلة
            // نستخدم بيانات الحساب المحفوظة عند الحاجة

            if (!name) {

                name =
                    String(
                        localStorage.getItem("customerName") ||
                        ""
                    ).trim();
            }


            if (!phone) {

                phone =
                    normalizePhone(
                        localStorage.getItem("customerPhone") ||
                        ""
                    );
            }


            if (!name && !phone) {
                return;
            }


            const key =
                phone ||
                name.toLowerCase();


            if (!customerMap.has(key)) {

                customerMap.set(
                    key,
                    {
                        id:
                            generateCustomerId(),

                        name:
                            name || "عميلة",

                        phone:
                            phone,

                        notes:
                            ""
                    }
                );
            }
        });


        // -------------------------------------------------
        // إضافة بيانات الحساب حتى لو ما عندها حجز
        // -------------------------------------------------

        const profileName =
            String(
                localStorage.getItem("customerName") ||
                ""
            ).trim();


        const profilePhone =
            normalizePhone(
                localStorage.getItem("customerPhone") ||
                ""
            );


        if (profileName || profilePhone) {

            const profileKey =
                profilePhone ||
                profileName.toLowerCase();


            if (!customerMap.has(profileKey)) {

                customerMap.set(
                    profileKey,
                    {
                        id:
                            generateCustomerId(),

                        name:
                            profileName || "عميلة",

                        phone:
                            profilePhone,

                        notes:
                            ""
                    }
                );
            }
        }


        // -------------------------------------------------
        // إذا عندنا عملاء محفوظين من الإدارة
        // هم الأساس
        // -------------------------------------------------

        if (savedCustomers.length > 0) {

            customers =
                savedCustomers.map(
                    function (customer) {

                        return {

                            id:
                                customer.id ||
                                generateCustomerId(),

                            name:
                                customer.name ||
                                "عميلة",

                            phone:
                                normalizePhone(
                                    customer.phone
                                ),

                            notes:
                                customer.notes || ""
                        };
                    }
                );


            // نضيف أي عميلة ظهرت بالحجوزات
            // وليست موجودة بالقائمة

            customerMap.forEach(
                function (customer) {

                    const exists =
                        customers.some(
                            function (savedCustomer) {

                                if (
                                    customer.phone &&
                                    savedCustomer.phone
                                ) {

                                    return (
                                        customer.phone ===
                                        savedCustomer.phone
                                    );
                                }


                                return (
                                    customer.name
                                        .toLowerCase() ===
                                    savedCustomer.name
                                        .toLowerCase()
                                );
                            }
                        );


                    if (!exists) {

                        customers.push(
                            customer
                        );
                    }
                }
            );

        } else {

            customers =
                Array.from(
                    customerMap.values()
                );
        }


        saveCustomers();
    }


    // =====================================================
    // حفظ العملاء
    // =====================================================

    function saveCustomers() {

        localStorage.setItem(
            "lumiereCustomers",
            JSON.stringify(customers)
        );
    }


    loadCustomers();


    // =====================================================
    // حجوزات العميلة
    // =====================================================

    function getCustomerBookings(customer) {

        return bookings.filter(
            function (booking) {

                let bookingName =
                    String(
                        booking.customerName ||
                        booking.name ||
                        ""
                    ).trim();


                let bookingPhone =
                    normalizePhone(
                        booking.customerPhone ||
                        booking.phone ||
                        ""
                    );


                // دعم الحجوزات القديمة

                if (!bookingName) {

                    bookingName =
                        String(
                            localStorage.getItem(
                                "customerName"
                            ) || ""
                        ).trim();
                }


                if (!bookingPhone) {

                    bookingPhone =
                        normalizePhone(
                            localStorage.getItem(
                                "customerPhone"
                            ) || ""
                        );
                }


                if (
                    customer.phone &&
                    bookingPhone
                ) {

                    return (
                        customer.phone ===
                        bookingPhone
                    );
                }


                return (
                    customer.name
                        .trim()
                        .toLowerCase() ===
                    bookingName
                        .trim()
                        .toLowerCase()
                );
            }
        );
    }


    // =====================================================
    // إحصائيات العميلة
    // =====================================================

    function getCustomerStats(customer) {

        const customerBookingsList =
            getCustomerBookings(customer);


        const active =
            customerBookingsList.some(
                function (booking) {

                    return (
                        booking.status === "مؤكد" &&
                        booking.date &&
                        booking.date >= todayKey
                    );
                }
            );


        const spent =
            customerBookingsList.reduce(
                function (total, booking) {

                    if (
                        booking.status === "ملغي"
                    ) {

                        return total;
                    }


                    return (
                        total +
                        getNumericPrice(
                            booking.price
                        )
                    );
                },
                0
            );


        const dates =
            customerBookingsList
                .map(function (booking) {
                    return booking.date || "";
                })
                .filter(Boolean)
                .sort();


        const lastBooking =
            dates.length
                ? dates[dates.length - 1]
                : "-";


        return {

            bookings:
                customerBookingsList.length,

            active:
                active,

            spent:
                spent,

            lastBooking:
                lastBooking
        };
    }


    // =====================================================
    // حماية النصوص
    // =====================================================

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


    // =====================================================
    // الإحصائيات العامة
    // =====================================================

    function updateStatistics() {

        let activeCount = 0;

        let totalRevenue = 0;


        customers.forEach(
            function (customer) {

                const stats =
                    getCustomerStats(customer);


                if (stats.active) {
                    activeCount++;
                }


                totalRevenue +=
                    stats.spent;
            }
        );


        const confirmedBookings =
            bookings.filter(
                function (booking) {

                    return (
                        booking.status ===
                        "مؤكد"
                    );
                }
            ).length;


        if (customersTotal) {

            customersTotal.textContent =
                customers.length;
        }


        if (activeCustomers) {

            activeCustomers.textContent =
                activeCount;
        }


        if (customersBookings) {

            customersBookings.textContent =
                bookings.length;
        }


        if (customersRevenue) {

            customersRevenue.textContent =
                totalRevenue.toLocaleString(
                    "en-US"
                );
        }


        if (sidebarBookingsCount) {

            sidebarBookingsCount.textContent =
                confirmedBookings;
        }
    }


    // =====================================================
    // البحث
    // =====================================================

    function getFilteredCustomers() {

        const searchValue =
            customerSearch
                ? customerSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        if (!searchValue) {

            return customers;
        }


        return customers.filter(
            function (customer) {

                const text =
                    (
                        customer.name +
                        " " +
                        customer.phone
                    ).toLowerCase();


                return text.includes(
                    searchValue
                );
            }
        );
    }


    if (customerSearch) {

        customerSearch.addEventListener(
            "input",
            displayCustomers
        );
    }


    // =====================================================
    // عرض العملاء
    // =====================================================

    function displayCustomers() {

        if (!customersTableBody) {
            return;
        }


        customersTableBody.innerHTML = "";


        const filteredCustomers =
            getFilteredCustomers();


        if (customerResultsCount) {

            customerResultsCount.textContent =
                filteredCustomers.length;
        }


        if (
            filteredCustomers.length === 0
        ) {

            if (customersEmpty) {

                customersEmpty.style.display =
                    "flex";
            }

            return;
        }


        if (customersEmpty) {

            customersEmpty.style.display =
                "none";
        }


        filteredCustomers.forEach(
            function (customer) {

                const stats =
                    getCustomerStats(customer);


                const firstLetter =
                    customer.name
                        ? customer.name.charAt(0)
                        : "ع";


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <button
                            type="button"
                            class="admin-customer-name-button"
                            data-action="details"
                            data-id="${escapeHTML(customer.id)}"
                        >

                            <div class="admin-customer-table-profile">

                                <div class="admin-customer-table-avatar">

                                    ${escapeHTML(firstLetter)}

                                </div>


                                <div>

                                    <strong>
                                        ${escapeHTML(customer.name)}
                                    </strong>

                                    <span>
                                        عميلة LUMIÈRE
                                    </span>

                                </div>

                            </div>

                        </button>

                    </td>


                    <td>

                        <span>
                            ${
                                customer.phone
                                    ? escapeHTML(customer.phone)
                                    : "-"
                            }
                        </span>

                    </td>


                    <td>

                        <strong class="admin-customer-booking-count">

                            ${stats.bookings}

                        </strong>

                    </td>


                    <td>

                        <span>
                            ${escapeHTML(stats.lastBooking)}
                        </span>

                    </td>


                    <td>

                        <strong>
                            ${stats.spent.toLocaleString("en-US")}
                        </strong>

                        <span class="admin-currency">
                            ر.س
                        </span>

                    </td>


                    <td>

                        <span
                            class="admin-customer-status ${
                                stats.active
                                    ? "active"
                                    : "previous"
                            }"
                        >

                            ${
                                stats.active
                                    ? "لديها موعد"
                                    : "بدون موعد"
                            }

                        </span>

                    </td>


                    <td>

                        <div class="admin-service-actions">


                            <button
                                type="button"
                                class="admin-service-action-btn edit"
                                data-action="edit"
                                data-id="${escapeHTML(customer.id)}"
                                title="تعديل"
                            >

                                <i class="fa-regular fa-pen-to-square"></i>

                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn delete"
                                data-action="delete"
                                data-id="${escapeHTML(customer.id)}"
                                title="حذف"
                            >

                                <i class="fa-regular fa-trash-can"></i>

                            </button>


                        </div>

                    </td>
                `;


                customersTableBody.appendChild(
                    row
                );
            }
        );


        setupCustomerButtons();
    }


    // =====================================================
    // أزرار الجدول
    // =====================================================

    function setupCustomerButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-action][data-id]"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const action =
                            button.getAttribute(
                                "data-action"
                            );


                        const customerId =
                            button.getAttribute(
                                "data-id"
                            );


                        if (action === "details") {

                            openCustomerDetails(
                                customerId
                            );

                            return;
                        }


                        if (action === "edit") {

                            openEditCustomerModal(
                                customerId
                            );

                            return;
                        }


                        if (action === "delete") {

                            openDeleteCustomerModal(
                                customerId
                            );
                        }
                    }
                );
            }
        );
    }


    // =====================================================
    // إضافة عميلة
    // =====================================================

    function openAddCustomerModal() {

        editingCustomerId = null;


        if (customerFormTitle) {

            customerFormTitle.textContent =
                "إضافة عميلة جديدة";
        }


        if (customerForm) {

            customerForm.reset();
        }


        if (customerFormError) {

            customerFormError.textContent = "";
        }


        openCustomerFormModal();
    }


    if (addCustomerBtn) {

        addCustomerBtn.addEventListener(
            "click",
            openAddCustomerModal
        );
    }


    // =====================================================
    // تعديل عميلة
    // =====================================================

    function openEditCustomerModal(customerId) {

        const customer =
            customers.find(
                function (item) {

                    return item.id === customerId;
                }
            );


        if (!customer) {
            return;
        }


        editingCustomerId =
            customer.id;


        if (customerFormTitle) {

            customerFormTitle.textContent =
                "تعديل بيانات العميلة";
        }


        if (customerNameInput) {

            customerNameInput.value =
                customer.name;
        }


        if (customerPhoneInput) {

            customerPhoneInput.value =
                customer.phone;
        }


        if (customerNotesInput) {

            customerNotesInput.value =
                customer.notes || "";
        }


        if (customerFormError) {

            customerFormError.textContent = "";
        }


        openCustomerFormModal();
    }


    // =====================================================
    // فتح النموذج
    // =====================================================

    function openCustomerFormModal() {

        if (!customerFormModal) {
            return;
        }


        customerFormModal.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";


        setTimeout(
            function () {

                if (customerNameInput) {

                    customerNameInput.focus();
                }

            },
            100
        );
    }


    // =====================================================
    // إغلاق النموذج
    // =====================================================

    function closeCustomerFormModal() {

        if (customerFormModal) {

            customerFormModal.classList.remove(
                "show"
            );
        }


        editingCustomerId = null;

        document.body.style.overflow = "";
    }


    if (customerFormClose) {

        customerFormClose.addEventListener(
            "click",
            closeCustomerFormModal
        );
    }


    if (customerFormOverlay) {

        customerFormOverlay.addEventListener(
            "click",
            closeCustomerFormModal
        );
    }


    // =====================================================
    // التحقق من رقم الجوال
    // =====================================================

    function isValidPhone(phone) {

        return /^05\d{8}$/.test(phone);
    }


    // =====================================================
    // حفظ العميلة
    // =====================================================

    if (customerForm) {

        customerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    customerNameInput
                        ? customerNameInput.value.trim()
                        : "";


                const phone =
                    customerPhoneInput
                        ? normalizePhone(
                            customerPhoneInput.value
                        )
                        : "";


                const notes =
                    customerNotesInput
                        ? customerNotesInput.value.trim()
                        : "";


                if (!name) {

                    showFormError(
                        "اكتبي اسم العميلة."
                    );

                    return;
                }


                if (!isValidPhone(phone)) {

                    showFormError(
                        "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."
                    );

                    return;
                }


                // -------------------------------------------------
                // تعديل
                // -------------------------------------------------

                if (editingCustomerId) {

                    const customerIndex =
                        customers.findIndex(
                            function (customer) {

                                return (
                                    customer.id ===
                                    editingCustomerId
                                );
                            }
                        );


                    if (customerIndex === -1) {
                        return;
                    }


                    const oldCustomer =
                        customers[customerIndex];


                    const duplicatePhone =
                        customers.some(
                            function (customer) {

                                return (
                                    customer.id !==
                                    editingCustomerId &&
                                    customer.phone === phone
                                );
                            }
                        );


                    if (duplicatePhone) {

                        showFormError(
                            "رقم الجوال مسجل لعميلة أخرى."
                        );

                        return;
                    }


                    customers[customerIndex] = {

                        ...oldCustomer,

                        name:
                            name,

                        phone:
                            phone,

                        notes:
                            notes
                    };


                    // تحديث الحجوزات المرتبطة بالعميلة

                    bookings =
                        bookings.map(
                            function (booking) {

                                const bookingPhone =
                                    normalizePhone(
                                        booking.customerPhone ||
                                        booking.phone ||
                                        ""
                                    );


                                const bookingName =
                                    String(
                                        booking.customerName ||
                                        booking.name ||
                                        ""
                                    ).trim();


                                const samePhone =
                                    oldCustomer.phone &&
                                    bookingPhone ===
                                    oldCustomer.phone;


                                const sameName =
                                    !bookingPhone &&
                                    bookingName &&
                                    bookingName.toLowerCase() ===
                                    oldCustomer.name
                                        .toLowerCase();


                                if (
                                    samePhone ||
                                    sameName
                                ) {

                                    booking.customerName =
                                        name;

                                    booking.customerPhone =
                                        phone;
                                }


                                return booking;
                            }
                        );


                    localStorage.setItem(
                        "bookings",
                        JSON.stringify(bookings)
                    );


                    // إذا كانت نفس عميلة الحساب الحالي
                    // نحدّث بيانات الحساب كذلك

                    const currentPhone =
                        normalizePhone(
                            localStorage.getItem(
                                "customerPhone"
                            ) || ""
                        );


                    const currentName =
                        String(
                            localStorage.getItem(
                                "customerName"
                            ) || ""
                        ).trim();


                    if (
                        currentPhone ===
                        oldCustomer.phone ||
                        (
                            !currentPhone &&
                            currentName ===
                            oldCustomer.name
                        )
                    ) {

                        localStorage.setItem(
                            "customerName",
                            name
                        );

                        localStorage.setItem(
                            "customerPhone",
                            phone
                        );
                    }


                    saveCustomers();

                    updateStatistics();

                    displayCustomers();

                    closeCustomerFormModal();

                    showToast(
                        "تم تعديل بيانات العميلة بنجاح"
                    );

                    return;
                }


                // -------------------------------------------------
                // إضافة
                // -------------------------------------------------

                const duplicatePhone =
                    customers.some(
                        function (customer) {

                            return (
                                customer.phone ===
                                phone
                            );
                        }
                    );


                if (duplicatePhone) {

                    showFormError(
                        "رقم الجوال مسجل بالفعل."
                    );

                    return;
                }


                const newCustomer = {

                    id:
                        generateCustomerId(),

                    name:
                        name,

                    phone:
                        phone,

                    notes:
                        notes
                };


                customers.unshift(
                    newCustomer
                );


                saveCustomers();

                updateStatistics();

                displayCustomers();

                closeCustomerFormModal();

                showToast(
                    "تمت إضافة العميلة بنجاح"
                );
            }
        );
    }


    // =====================================================
    // خطأ النموذج
    // =====================================================

    function showFormError(message) {

        if (!customerFormError) {
            return;
        }


        customerFormError.textContent =
            message;
    }


    // =====================================================
    // تفاصيل العميلة
    // =====================================================

    function openCustomerDetails(customerId) {

        const customer =
            customers.find(
                function (item) {

                    return item.id === customerId;
                }
            );


        if (!customer) {
            return;
        }


        const stats =
            getCustomerStats(customer);


        if (modalCustomerName) {

            modalCustomerName.textContent =
                customer.name;
        }


        if (modalCustomerPhone) {

            modalCustomerPhone.textContent =
                customer.phone || "-";
        }


        if (modalCustomerBookings) {

            modalCustomerBookings.textContent =
                stats.bookings;
        }


        if (modalCustomerSpent) {

            modalCustomerSpent.textContent =
                stats.spent.toLocaleString("en-US") +
                " ر.س";
        }


        if (modalCustomerLastBooking) {

            modalCustomerLastBooking.textContent =
                stats.lastBooking;
        }


        if (
            customer.notes &&
            customer.notes.trim()
        ) {

            if (customerNotesBox) {

                customerNotesBox.style.display =
                    "block";
            }


            if (modalCustomerNotes) {

                modalCustomerNotes.textContent =
                    customer.notes;
            }

        } else {

            if (customerNotesBox) {

                customerNotesBox.style.display =
                    "none";
            }
        }


        displayCustomerHistory(
            customer
        );


        if (customerModal) {

            customerModal.classList.add(
                "show"
            );


            document.body.style.overflow =
                "hidden";
        }
    }


    // =====================================================
    // سجل حجوزات العميلة
    // =====================================================

    function displayCustomerHistory(customer) {

        if (!customerBookingHistory) {
            return;
        }


        customerBookingHistory.innerHTML =
            "";


        const history =
            getCustomerBookings(customer)
                .slice()
                .sort(
                    function (a, b) {

                        return String(
                            b.date || ""
                        ).localeCompare(
                            String(a.date || "")
                        );
                    }
                );


        if (history.length === 0) {

            if (customerHistoryEmpty) {

                customerHistoryEmpty.style.display =
                    "block";
            }

            return;
        }


        if (customerHistoryEmpty) {

            customerHistoryEmpty.style.display =
                "none";
        }


        history.forEach(
            function (booking) {

                const item =
                    document.createElement("div");


                item.className =
                    "admin-customer-history-item";


                item.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                booking.service ||
                                "خدمة"
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.date || "-"
                            )}
                            •
                            ${escapeHTML(
                                booking.time || "-"
                            )}
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${getNumericPrice(
                                booking.price
                            ).toLocaleString("en-US")}
                            ر.س
                        </strong>

                        <span>
                            ${escapeHTML(
                                booking.status ||
                                "مؤكد"
                            )}
                        </span>

                    </div>
                `;


                customerBookingHistory.appendChild(
                    item
                );
            }
        );
    }


    // =====================================================
    // إغلاق التفاصيل
    // =====================================================

    function closeCustomerDetails() {

        if (customerModal) {

            customerModal.classList.remove(
                "show"
            );
        }


        document.body.style.overflow = "";
    }


    if (customerModalClose) {

        customerModalClose.addEventListener(
            "click",
            closeCustomerDetails
        );
    }


    if (customerDetailsDone) {

        customerDetailsDone.addEventListener(
            "click",
            closeCustomerDetails
        );
    }


    if (customerModalOverlay) {

        customerModalOverlay.addEventListener(
            "click",
            closeCustomerDetails
        );
    }


    // =====================================================
    // حذف العميلة
    // =====================================================

    function openDeleteCustomerModal(customerId) {

        deletingCustomerId =
            customerId;


        if (deleteCustomerModal) {

            deleteCustomerModal.classList.add(
                "show"
            );


            document.body.style.overflow =
                "hidden";
        }
    }


    function closeDeleteCustomerModal() {

        if (deleteCustomerModal) {

            deleteCustomerModal.classList.remove(
                "show"
            );
        }


        deletingCustomerId = null;

        document.body.style.overflow = "";
    }


    if (deleteCustomerCancel) {

        deleteCustomerCancel.addEventListener(
            "click",
            closeDeleteCustomerModal
        );
    }


    if (deleteCustomerOverlay) {

        deleteCustomerOverlay.addEventListener(
            "click",
            closeDeleteCustomerModal
        );
    }


    if (deleteCustomerConfirm) {

        deleteCustomerConfirm.addEventListener(
            "click",
            function () {

                if (!deletingCustomerId) {
                    return;
                }


                customers =
                    customers.filter(
                        function (customer) {

                            return (
                                customer.id !==
                                deletingCustomerId
                            );
                        }
                    );


                saveCustomers();

                updateStatistics();

                displayCustomers();

                closeDeleteCustomerModal();

                showToast(
                    "تم حذف العميلة"
                );
            }
        );
    }


    // =====================================================
    // Toast
    // =====================================================

    function showToast(message) {

        if (
            !customerToast ||
            !customerToastText
        ) {
            return;
        }


        customerToastText.textContent =
            message;


        customerToast.classList.add(
            "show"
        );


        if (toastTimer) {

            clearTimeout(toastTimer);
        }


        toastTimer =
            setTimeout(
                function () {

                    customerToast.classList.remove(
                        "show"
                    );

                },
                2500
            );
    }


    // =====================================================
    // تسجيل الخروج
    // =====================================================

    if (adminLogoutBtn) {

        adminLogoutBtn.addEventListener(
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
    // Sidebar للجوال
    // =====================================================

    function openSidebar() {

        if (adminSidebar) {

            adminSidebar.classList.add(
                "show"
            );
        }


        if (adminSidebarOverlay) {

            adminSidebarOverlay.classList.add(
                "show"
            );
        }


        document.body.style.overflow =
            "hidden";
    }


    function closeSidebar() {

        if (adminSidebar) {

            adminSidebar.classList.remove(
                "show"
            );
        }


        if (adminSidebarOverlay) {

            adminSidebarOverlay.classList.remove(
                "show"
            );
        }


        document.body.style.overflow = "";
    }


    if (adminMobileMenu) {

        adminMobileMenu.addEventListener(
            "click",
            openSidebar
        );
    }


    if (adminSidebarOverlay) {

        adminSidebarOverlay.addEventListener(
            "click",
            closeSidebar
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
                deleteCustomerModal &&
                deleteCustomerModal.classList.contains(
                    "show"
                )
            ) {

                closeDeleteCustomerModal();

                return;
            }


            if (
                customerFormModal &&
                customerFormModal.classList.contains(
                    "show"
                )
            ) {

                closeCustomerFormModal();

                return;
            }


            if (
                customerModal &&
                customerModal.classList.contains(
                    "show"
                )
            ) {

                closeCustomerDetails();

                return;
            }


            closeSidebar();
        }
    );


    // =====================================================
    // تشغيل الصفحة
    // =====================================================

    updateStatistics();

    displayCustomers();

});