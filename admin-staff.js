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

    const staffTotal =
        document.getElementById("adminStaffTotal");

    const staffActive =
        document.getElementById("adminStaffActive");

    const staffUpcoming =
        document.getElementById("adminStaffUpcoming");

    const staffRevenue =
        document.getElementById("adminStaffRevenue");

    const staffSearch =
        document.getElementById("adminStaffSearch");

    const staffResultsCount =
        document.getElementById("adminStaffResultsCount");

    const staffTableBody =
        document.getElementById("adminStaffTableBody");

    const staffEmpty =
        document.getElementById("adminStaffEmpty");

    const sidebarBookingsCount =
        document.getElementById("sidebarBookingsCount");

    const adminCurrentDate =
        document.getElementById("adminCurrentDate");


    // =====================================================
    // الفلاتر
    // =====================================================

    const staffFilterButtons =
        document.querySelectorAll(".admin-staff-filter");


    // =====================================================
    // إضافة / تعديل
    // =====================================================

    const addStaffBtn =
        document.getElementById("adminAddStaffBtn");

    const staffFormModal =
        document.getElementById("adminStaffFormModal");

    const staffFormOverlay =
        document.getElementById("adminStaffFormOverlay");

    const staffFormClose =
        document.getElementById("adminStaffFormClose");

    const staffFormTitle =
        document.getElementById("adminStaffFormTitle");

    const staffForm =
        document.getElementById("adminStaffForm");

    const staffNameInput =
        document.getElementById("adminStaffName");

    const staffSpecialtyInput =
        document.getElementById("adminStaffSpecialty");

    const staffPhoneInput =
        document.getElementById("adminStaffPhone");

    const staffStatusInput =
        document.getElementById("adminStaffStatus");

    const staffFormError =
        document.getElementById("adminStaffFormError");


    // =====================================================
    // تفاصيل الموظفة
    // =====================================================

    const staffDetailsModal =
        document.getElementById("adminStaffDetailsModal");

    const staffDetailsOverlay =
        document.getElementById("adminStaffDetailsOverlay");

    const staffDetailsClose =
        document.getElementById("adminStaffDetailsClose");

    const staffDetailsDone =
        document.getElementById("adminStaffDetailsDone");

    const modalStaffName =
        document.getElementById("adminModalStaffName");

    const modalStaffSpecialty =
        document.getElementById("adminModalStaffSpecialty");

    const modalStaffBookings =
        document.getElementById("adminModalStaffBookings");

    const modalStaffUpcoming =
        document.getElementById("adminModalStaffUpcoming");

    const modalStaffRevenue =
        document.getElementById("adminModalStaffRevenue");

    const staffBookingHistory =
        document.getElementById("adminStaffBookingHistory");

    const staffHistoryEmpty =
        document.getElementById("adminStaffHistoryEmpty");


    // =====================================================
    // حذف
    // =====================================================

    const deleteStaffModal =
        document.getElementById("adminDeleteStaffModal");

    const deleteStaffOverlay =
        document.getElementById("adminDeleteStaffOverlay");

    const deleteStaffCancel =
        document.getElementById("adminDeleteStaffCancel");

    const deleteStaffConfirm =
        document.getElementById("adminDeleteStaffConfirm");


    // =====================================================
    // Toast
    // =====================================================

    const staffToast =
        document.getElementById("adminStaffToast");

    const staffToastText =
        document.getElementById("adminStaffToastText");


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

    let staffMembers = [];

    let currentFilter = "all";

    let editingStaffId = null;

    let deletingStaffId = null;

    let toastTimer = null;


    // =====================================================
    // التاريخ
    // =====================================================

    const now = new Date();


    function formatDateKey(date) {

        const year =
            date.getFullYear();

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


        // تحديث المواعيد القديمة إلى مكتمل

        bookings =
            bookings.map(function (booking) {

                if (
                    booking.date &&
                    booking.date < todayKey &&
                    booking.status !== "ملغي"
                ) {

                    booking.status =
                        "مكتمل";
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
    // السعر إلى رقم
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
    // إنشاء ID
    // =====================================================

    function generateStaffId() {

        return (
            "STF-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 10000)
        );
    }


    // =====================================================
    // تخمين تخصص الموظفة من حجوزاتها
    // =====================================================

    function guessStaffSpecialty(staffName) {

        const staffBookings =
            bookings.filter(function (booking) {

                return (
                    String(booking.staff || "").trim() ===
                    String(staffName || "").trim()
                );
            });


        const text =
            staffBookings
                .map(function (booking) {
                    return booking.service || "";
                })
                .join(" ")
                .toLowerCase();


        if (
            text.includes("مانيكير") ||
            text.includes("بديكير") ||
            text.includes("أظافر") ||
            text.includes("اظافر") ||
            text.includes("جل")
        ) {
            return "الأظافر";
        }


        if (
            text.includes("شعر") ||
            text.includes("استشوار") ||
            text.includes("قص") ||
            text.includes("تصفيف") ||
            text.includes("تسريحة") ||
            text.includes("صبغة")
        ) {
            return "الشعر";
        }


        if (
            text.includes("مكياج") ||
            text.includes("ميكب")
        ) {
            return "المكياج";
        }


        if (
            text.includes("بشرة") ||
            text.includes("فيشل") ||
            text.includes("تنظيف")
        ) {
            return "البشرة";
        }


        return "متعددة التخصصات";
    }


    // =====================================================
    // قراءة الموظفات
    // =====================================================

    function loadStaff() {

        let savedStaff = [];


        try {

            savedStaff =
                JSON.parse(
                    localStorage.getItem("lumiereStaff")
                ) || [];

        } catch (error) {

            savedStaff = [];
        }


        // إذا ما عندنا موظفات محفوظات
        // نستخرجهن من الحجوزات القديمة

        if (savedStaff.length === 0) {

            const staffMap =
                new Map();


            bookings.forEach(function (booking) {

                const name =
                    String(booking.staff || "").trim();


                if (!name) {
                    return;
                }


                if (!staffMap.has(name)) {

                    staffMap.set(
                        name,
                        {
                            id:
                                generateStaffId(),

                            name:
                                name,

                            specialty:
                                guessStaffSpecialty(name),

                            phone:
                                "",

                            status:
                                "active"
                        }
                    );
                }
            });


            savedStaff =
                Array.from(staffMap.values());


            if (savedStaff.length > 0) {

                localStorage.setItem(
                    "lumiereStaff",
                    JSON.stringify(savedStaff)
                );
            }
        }


        staffMembers =
            savedStaff.map(function (staff) {

                return {

                    id:
                        staff.id ||
                        generateStaffId(),

                    name:
                        staff.name ||
                        "موظفة",

                    specialty:
                        staff.specialty ||
                        "متعددة التخصصات",

                    phone:
                        staff.phone || "",

                    status:
                        staff.status === "inactive"
                            ? "inactive"
                            : "active"
                };
            });


        saveStaff();
    }


    // =====================================================
    // حفظ الموظفات
    // =====================================================

    function saveStaff() {

        localStorage.setItem(
            "lumiereStaff",
            JSON.stringify(staffMembers)
        );
    }


    loadStaff();


    // =====================================================
    // حجوزات موظفة
    // =====================================================

    function getStaffBookings(staffName) {

        return bookings.filter(function (booking) {

            return (
                String(booking.staff || "").trim() ===
                String(staffName || "").trim()
            );
        });
    }


    // =====================================================
    // إحصائيات موظفة
    // =====================================================

    function getStaffStats(staffName) {

        const employeeBookings =
            getStaffBookings(staffName);


        const upcoming =
            employeeBookings.filter(function (booking) {

                return (
                    booking.status === "مؤكد" &&
                    booking.date &&
                    booking.date >= todayKey
                );
            }).length;


        const completed =
            employeeBookings.filter(function (booking) {

                return booking.status === "مكتمل";
            }).length;


        const cancelled =
            employeeBookings.filter(function (booking) {

                return booking.status === "ملغي";
            }).length;


        const revenue =
            employeeBookings.reduce(
                function (total, booking) {

                    if (booking.status === "ملغي") {
                        return total;
                    }

                    return (
                        total +
                        getNumericPrice(booking.price)
                    );
                },
                0
            );


        return {

            bookings:
                employeeBookings.length,

            upcoming:
                upcoming,

            completed:
                completed,

            cancelled:
                cancelled,

            revenue:
                revenue
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

        const activeCount =
            staffMembers.filter(function (staff) {

                return staff.status === "active";
            }).length;


        const upcomingCount =
            bookings.filter(function (booking) {

                return (
                    booking.status === "مؤكد" &&
                    booking.date &&
                    booking.date >= todayKey
                );
            }).length;


        const revenue =
            bookings.reduce(
                function (total, booking) {

                    if (booking.status === "ملغي") {
                        return total;
                    }

                    return (
                        total +
                        getNumericPrice(booking.price)
                    );
                },
                0
            );


        const confirmedCount =
            bookings.filter(function (booking) {

                return booking.status === "مؤكد";
            }).length;


        if (staffTotal) {
            staffTotal.textContent =
                staffMembers.length;
        }


        if (staffActive) {
            staffActive.textContent =
                activeCount;
        }


        if (staffUpcoming) {
            staffUpcoming.textContent =
                upcomingCount;
        }


        if (staffRevenue) {

            staffRevenue.textContent =
                revenue.toLocaleString("en-US");
        }


        if (sidebarBookingsCount) {

            sidebarBookingsCount.textContent =
                confirmedCount;
        }
    }


    // =====================================================
    // فلترة الموظفات
    // =====================================================

    function getFilteredStaff() {

        const searchValue =
            staffSearch
                ? staffSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        return staffMembers.filter(
            function (staff) {

                if (
                    currentFilter !== "all" &&
                    staff.status !== currentFilter
                ) {
                    return false;
                }


                if (searchValue) {

                    const searchableText =
                        (
                            staff.name +
                            " " +
                            staff.specialty +
                            " " +
                            staff.phone
                        ).toLowerCase();


                    if (
                        !searchableText.includes(
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
    // عرض الموظفات
    // =====================================================

    function displayStaff() {

        if (!staffTableBody) {
            return;
        }


        staffTableBody.innerHTML = "";


        const filteredStaff =
            getFilteredStaff();


        if (staffResultsCount) {

            staffResultsCount.textContent =
                filteredStaff.length;
        }


        if (filteredStaff.length === 0) {

            if (staffEmpty) {

                staffEmpty.style.display =
                    "flex";
            }

            return;
        }


        if (staffEmpty) {

            staffEmpty.style.display =
                "none";
        }


        filteredStaff.forEach(
            function (staff) {

                const stats =
                    getStaffStats(staff.name);


                const isActive =
                    staff.status === "active";


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <button
                            type="button"
                            class="admin-staff-name-button"
                            data-action="details"
                            data-id="${escapeHTML(staff.id)}"
                        >

                            <div class="admin-customer-table-profile">

                                <div class="admin-customer-table-avatar">

                                    ${escapeHTML(
                                        staff.name.charAt(0)
                                    )}

                                </div>


                                <div>

                                    <strong>
                                        ${escapeHTML(staff.name)}
                                    </strong>

                                    <span>
                                        ${
                                            staff.phone
                                                ? escapeHTML(staff.phone)
                                                : "موظفة LUMIÈRE"
                                        }
                                    </span>

                                </div>

                            </div>

                        </button>

                    </td>


                    <td>

                        <span class="admin-service-category">

                            ${escapeHTML(staff.specialty)}

                        </span>

                    </td>


                    <td>

                        <strong>
                            ${stats.bookings}
                        </strong>

                    </td>


                    <td>

                        <strong>
                            ${stats.upcoming}
                        </strong>

                    </td>


                    <td>

                        <strong>
                            ${stats.completed}
                        </strong>

                    </td>


                    <td>

                        <strong>
                            ${stats.revenue.toLocaleString("en-US")}
                        </strong>

                        <span class="admin-currency">
                            ر.س
                        </span>

                    </td>


                    <td>

                        <span
                            class="admin-customer-status ${
                                isActive
                                    ? "active"
                                    : "previous"
                            }"
                        >

                            ${
                                isActive
                                    ? "مفعلة"
                                    : "متوقفة"
                            }

                        </span>

                    </td>


                    <td>

                        <div class="admin-service-actions">


                            <button
                                type="button"
                                class="admin-service-action-btn edit"
                                data-action="edit"
                                data-id="${escapeHTML(staff.id)}"
                                title="تعديل"
                            >

                                <i class="fa-regular fa-pen-to-square"></i>

                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn toggle"
                                data-action="toggle"
                                data-id="${escapeHTML(staff.id)}"
                                title="${
                                    isActive
                                        ? "إيقاف"
                                        : "تفعيل"
                                }"
                            >

                                <i class="fa-solid ${
                                    isActive
                                        ? "fa-toggle-on"
                                        : "fa-toggle-off"
                                }"></i>

                            </button>


                            <button
                                type="button"
                                class="admin-service-action-btn delete"
                                data-action="delete"
                                data-id="${escapeHTML(staff.id)}"
                                title="حذف"
                            >

                                <i class="fa-regular fa-trash-can"></i>

                            </button>


                        </div>

                    </td>
                `;


                staffTableBody.appendChild(row);
            }
        );


        setupStaffButtons();
    }


    // =====================================================
    // البحث
    // =====================================================

    if (staffSearch) {

        staffSearch.addEventListener(
            "input",
            displayStaff
        );
    }


    // =====================================================
    // الفلاتر
    // =====================================================

    staffFilterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        button.getAttribute("data-filter") ||
                        "all";


                    staffFilterButtons.forEach(
                        function (item) {

                            item.classList.remove("active");
                        }
                    );


                    button.classList.add("active");

                    displayStaff();
                }
            );
        }
    );


    // =====================================================
    // فتح إضافة موظفة
    // =====================================================

    function openAddStaffModal() {

        editingStaffId = null;


        if (staffFormTitle) {

            staffFormTitle.textContent =
                "إضافة موظفة جديدة";
        }


        if (staffForm) {

            staffForm.reset();
        }


        if (staffStatusInput) {

            staffStatusInput.value =
                "active";
        }


        if (staffFormError) {

            staffFormError.textContent = "";
        }


        openStaffFormModal();
    }


    if (addStaffBtn) {

        addStaffBtn.addEventListener(
            "click",
            openAddStaffModal
        );
    }


    // =====================================================
    // فتح تعديل موظفة
    // =====================================================

    function openEditStaffModal(staffId) {

        const staff =
            staffMembers.find(function (item) {

                return item.id === staffId;
            });


        if (!staff) {
            return;
        }


        editingStaffId =
            staff.id;


        if (staffFormTitle) {

            staffFormTitle.textContent =
                "تعديل بيانات الموظفة";
        }


        if (staffNameInput) {

            staffNameInput.value =
                staff.name;
        }


        if (staffSpecialtyInput) {

            staffSpecialtyInput.value =
                staff.specialty;
        }


        if (staffPhoneInput) {

            staffPhoneInput.value =
                staff.phone;
        }


        if (staffStatusInput) {

            staffStatusInput.value =
                staff.status;
        }


        if (staffFormError) {

            staffFormError.textContent = "";
        }


        openStaffFormModal();
    }


    // =====================================================
    // فتح نافذة النموذج
    // =====================================================

    function openStaffFormModal() {

        if (!staffFormModal) {
            return;
        }


        staffFormModal.classList.add("show");

        document.body.style.overflow =
            "hidden";


        setTimeout(
            function () {

                if (staffNameInput) {
                    staffNameInput.focus();
                }

            },
            100
        );
    }


    // =====================================================
    // إغلاق النموذج
    // =====================================================

    function closeStaffFormModal() {

        if (staffFormModal) {

            staffFormModal.classList.remove(
                "show"
            );
        }


        editingStaffId = null;

        document.body.style.overflow = "";
    }


    if (staffFormClose) {

        staffFormClose.addEventListener(
            "click",
            closeStaffFormModal
        );
    }


    if (staffFormOverlay) {

        staffFormOverlay.addEventListener(
            "click",
            closeStaffFormModal
        );
    }


    // =====================================================
    // التحقق من الجوال
    // =====================================================

    function isValidPhone(phone) {

        if (!phone) {
            return true;
        }


        return /^05\d{8}$/.test(phone);
    }


    // =====================================================
    // حفظ الموظفة
    // =====================================================

    if (staffForm) {

        staffForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    staffNameInput
                        ? staffNameInput.value.trim()
                        : "";


                const specialty =
                    staffSpecialtyInput
                        ? staffSpecialtyInput.value
                        : "";


                const phone =
                    staffPhoneInput
                        ? staffPhoneInput.value
                            .replace(/\s/g, "")
                            .trim()
                        : "";


                const status =
                    staffStatusInput
                        ? staffStatusInput.value
                        : "active";


                if (!name) {

                    showFormError(
                        "اكتبي اسم الموظفة."
                    );

                    return;
                }


                if (!specialty) {

                    showFormError(
                        "اختاري تخصص الموظفة."
                    );

                    return;
                }


                if (!isValidPhone(phone)) {

                    showFormError(
                        "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."
                    );

                    return;
                }


                // =========================================
                // تعديل موظفة
                // =========================================

                if (editingStaffId) {

                    const staffIndex =
                        staffMembers.findIndex(
                            function (staff) {

                                return (
                                    staff.id ===
                                    editingStaffId
                                );
                            }
                        );


                    if (staffIndex === -1) {
                        return;
                    }


                    const oldName =
                        staffMembers[staffIndex].name;


                    const duplicate =
                        staffMembers.some(
                            function (staff) {

                                return (
                                    staff.id !== editingStaffId &&
                                    staff.name
                                        .trim()
                                        .toLowerCase() ===
                                    name
                                        .trim()
                                        .toLowerCase()
                                );
                            }
                        );


                    if (duplicate) {

                        showFormError(
                            "يوجد موظفة بهذا الاسم بالفعل."
                        );

                        return;
                    }


                    staffMembers[staffIndex] = {

                        ...staffMembers[staffIndex],

                        name:
                            name,

                        specialty:
                            specialty,

                        phone:
                            phone,

                        status:
                            status
                    };


                    // إذا تغير الاسم
                    // نحدث اسم الموظفة في حجوزاتها أيضًا

                    if (oldName !== name) {

                        bookings =
                            bookings.map(
                                function (booking) {

                                    if (
                                        String(
                                            booking.staff || ""
                                        ).trim() === oldName
                                    ) {

                                        booking.staff =
                                            name;
                                    }

                                    return booking;
                                }
                            );


                        localStorage.setItem(
                            "bookings",
                            JSON.stringify(bookings)
                        );
                    }


                    saveStaff();

                    updateStatistics();

                    displayStaff();

                    closeStaffFormModal();

                    showToast(
                        "تم تعديل بيانات الموظفة بنجاح"
                    );

                    return;
                }


                // =========================================
                // إضافة موظفة
                // =========================================

                const duplicate =
                    staffMembers.some(
                        function (staff) {

                            return (
                                staff.name
                                    .trim()
                                    .toLowerCase() ===
                                name
                                    .trim()
                                    .toLowerCase()
                            );
                        }
                    );


                if (duplicate) {

                    showFormError(
                        "هذه الموظفة موجودة بالفعل."
                    );

                    return;
                }


                const newStaff = {

                    id:
                        generateStaffId(),

                    name:
                        name,

                    specialty:
                        specialty,

                    phone:
                        phone,

                    status:
                        status
                };


                staffMembers.unshift(
                    newStaff
                );


                saveStaff();

                updateStatistics();

                displayStaff();

                closeStaffFormModal();

                showToast(
                    "تمت إضافة الموظفة بنجاح"
                );
            }
        );
    }


    // =====================================================
    // رسالة الخطأ
    // =====================================================

    function showFormError(message) {

        if (!staffFormError) {
            return;
        }


        staffFormError.textContent =
            message;
    }


    // =====================================================
    // أزرار الجدول
    // =====================================================

    function setupStaffButtons() {

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


                        const staffId =
                            button.getAttribute(
                                "data-id"
                            );


                        if (action === "details") {

                            openStaffDetails(
                                staffId
                            );

                            return;
                        }


                        if (action === "edit") {

                            openEditStaffModal(
                                staffId
                            );

                            return;
                        }


                        if (action === "toggle") {

                            toggleStaff(
                                staffId
                            );

                            return;
                        }


                        if (action === "delete") {

                            openDeleteStaffModal(
                                staffId
                            );
                        }

                    }
                );
            }
        );
    }


    // =====================================================
    // تفعيل / إيقاف
    // =====================================================

    function toggleStaff(staffId) {

        const staff =
            staffMembers.find(
                function (item) {

                    return item.id === staffId;
                }
            );


        if (!staff) {
            return;
        }


        if (staff.status === "active") {

            staff.status =
                "inactive";

            showToast(
                "تم إيقاف الموظفة"
            );

        } else {

            staff.status =
                "active";

            showToast(
                "تم تفعيل الموظفة"
            );
        }


        saveStaff();

        updateStatistics();

        displayStaff();
    }


    // =====================================================
    // تفاصيل الموظفة
    // =====================================================

    function openStaffDetails(staffId) {

        const staff =
            staffMembers.find(
                function (item) {

                    return item.id === staffId;
                }
            );


        if (!staff) {
            return;
        }


        const stats =
            getStaffStats(staff.name);


        if (modalStaffName) {

            modalStaffName.textContent =
                staff.name;
        }


        if (modalStaffSpecialty) {

            modalStaffSpecialty.textContent =
                staff.phone
                    ? staff.specialty +
                      " • " +
                      staff.phone
                    : staff.specialty;
        }


        if (modalStaffBookings) {

            modalStaffBookings.textContent =
                stats.bookings;
        }


        if (modalStaffUpcoming) {

            modalStaffUpcoming.textContent =
                stats.upcoming;
        }


        if (modalStaffRevenue) {

            modalStaffRevenue.textContent =
                stats.revenue.toLocaleString("en-US") +
                " ر.س";
        }


        displayStaffHistory(
            staff.name
        );


        if (staffDetailsModal) {

            staffDetailsModal.classList.add(
                "show"
            );

            document.body.style.overflow =
                "hidden";
        }
    }


    // =====================================================
    // تاريخ حجوزات الموظفة
    // =====================================================

    function displayStaffHistory(staffName) {

        if (!staffBookingHistory) {
            return;
        }


        staffBookingHistory.innerHTML = "";


        const employeeBookings =
            getStaffBookings(staffName)
                .slice()
                .sort(function (a, b) {

                    return String(
                        b.date || ""
                    ).localeCompare(
                        String(a.date || "")
                    );
                });


        if (employeeBookings.length === 0) {

            if (staffHistoryEmpty) {

                staffHistoryEmpty.style.display =
                    "block";
            }

            return;
        }


        if (staffHistoryEmpty) {

            staffHistoryEmpty.style.display =
                "none";
        }


        employeeBookings.forEach(
            function (booking) {

                const item =
                    document.createElement("div");


                item.className =
                    "admin-customer-history-item";


                item.innerHTML = `

                    <div>

                        <strong>
                            ${escapeHTML(
                                booking.service || "خدمة"
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
                                booking.status || "مؤكد"
                            )}
                        </span>

                    </div>
                `;


                staffBookingHistory.appendChild(
                    item
                );
            }
        );
    }


    // =====================================================
    // إغلاق التفاصيل
    // =====================================================

    function closeStaffDetails() {

        if (staffDetailsModal) {

            staffDetailsModal.classList.remove(
                "show"
            );
        }


        document.body.style.overflow = "";
    }


    if (staffDetailsClose) {

        staffDetailsClose.addEventListener(
            "click",
            closeStaffDetails
        );
    }


    if (staffDetailsDone) {

        staffDetailsDone.addEventListener(
            "click",
            closeStaffDetails
        );
    }


    if (staffDetailsOverlay) {

        staffDetailsOverlay.addEventListener(
            "click",
            closeStaffDetails
        );
    }


    // =====================================================
    // حذف موظفة
    // =====================================================

    function openDeleteStaffModal(staffId) {

        deletingStaffId =
            staffId;


        if (deleteStaffModal) {

            deleteStaffModal.classList.add(
                "show"
            );

            document.body.style.overflow =
                "hidden";
        }
    }


    function closeDeleteStaffModal() {

        if (deleteStaffModal) {

            deleteStaffModal.classList.remove(
                "show"
            );
        }


        deletingStaffId = null;

        document.body.style.overflow = "";
    }


    if (deleteStaffCancel) {

        deleteStaffCancel.addEventListener(
            "click",
            closeDeleteStaffModal
        );
    }


    if (deleteStaffOverlay) {

        deleteStaffOverlay.addEventListener(
            "click",
            closeDeleteStaffModal
        );
    }


    if (deleteStaffConfirm) {

        deleteStaffConfirm.addEventListener(
            "click",
            function () {

                if (!deletingStaffId) {
                    return;
                }


                staffMembers =
                    staffMembers.filter(
                        function (staff) {

                            return (
                                staff.id !==
                                deletingStaffId
                            );
                        }
                    );


                saveStaff();

                updateStatistics();

                displayStaff();

                closeDeleteStaffModal();

                showToast(
                    "تم حذف الموظفة"
                );
            }
        );
    }


    // =====================================================
    // Toast
    // =====================================================

    function showToast(message) {

        if (
            !staffToast ||
            !staffToastText
        ) {
            return;
        }


        staffToastText.textContent =
            message;


        staffToast.classList.add(
            "show"
        );


        if (toastTimer) {

            clearTimeout(toastTimer);
        }


        toastTimer =
            setTimeout(
                function () {

                    staffToast.classList.remove(
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
    // القائمة الجانبية للجوال
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
                deleteStaffModal &&
                deleteStaffModal.classList.contains("show")
            ) {

                closeDeleteStaffModal();

                return;
            }


            if (
                staffFormModal &&
                staffFormModal.classList.contains("show")
            ) {

                closeStaffFormModal();

                return;
            }


            if (
                staffDetailsModal &&
                staffDetailsModal.classList.contains("show")
            ) {

                closeStaffDetails();

                return;
            }


            closeSidebar();
        }
    );


    // =====================================================
    // تشغيل الصفحة
    // =====================================================

    updateStatistics();

    displayStaff();

});