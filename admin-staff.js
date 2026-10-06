document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // LOGIN CHECK
    // ==========================================

    const isLoggedIn =
        sessionStorage.getItem("lumiereAdminLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href =
            "admin-login.html";

        return;
    }


    // ==========================================
    // ELEMENTS
    // ==========================================

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


    const filterButtons =
        document.querySelectorAll(".admin-staff-filter");


    const addStaffBtn =
        document.getElementById("adminAddStaffBtn");

    const staffFormModal =
        document.getElementById("adminStaffFormModal");

    const staffFormOverlay =
        document.getElementById("adminStaffFormOverlay");

    const staffFormClose =
        document.getElementById("adminStaffFormClose");

    const staffFormCancel =
        document.getElementById("adminStaffFormCancel");

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


    const detailsModal =
        document.getElementById("adminStaffDetailsModal");

    const detailsOverlay =
        document.getElementById("adminStaffDetailsOverlay");

    const detailsClose =
        document.getElementById("adminStaffDetailsClose");

    const detailsDone =
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


    const deleteModal =
        document.getElementById("adminDeleteStaffModal");

    const deleteOverlay =
        document.getElementById("adminDeleteStaffOverlay");

    const deleteCancel =
        document.getElementById("adminDeleteStaffCancel");

    const deleteConfirm =
        document.getElementById("adminDeleteStaffConfirm");


    const toast =
        document.getElementById("adminStaffToast");

    const toastText =
        document.getElementById("adminStaffToastText");


    const logoutBtn =
        document.getElementById("adminLogoutBtn");

    const mobileMenu =
        document.getElementById("adminMobileMenu");

    const sidebar =
        document.getElementById("adminSidebar");

    const sidebarOverlay =
        document.getElementById("adminSidebarOverlay");


    // ==========================================
    // VARIABLES
    // ==========================================

    let staffMembers = [];

    let bookings = [];

    let currentFilter = "all";

    let editingStaffId = null;

    let deletingStaffId = null;

    let toastTimer = null;


    // ==========================================
    // DEFAULT STAFF
    // ==========================================

    const defaultStaff = [

        {
            id: "staff-1",
            name: "سارة",
            specialty: "الشعر",
            phone: "",
            status: "active"
        },

        {
            id: "staff-2",
            name: "نورة",
            specialty: "متعددة التخصصات",
            phone: "",
            status: "active"
        },

        {
            id: "staff-3",
            name: "ريم",
            specialty: "الأظافر",
            phone: "",
            status: "active"
        },

        {
            id: "staff-4",
            name: "ليان",
            specialty: "البشرة",
            phone: "",
            status: "active"
        }

    ];


    // ==========================================
    // DATE
    // ==========================================

    const now =
        new Date();


    function getDateKey(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return (
            year +
            "-" +
            month +
            "-" +
            day
        );
    }


    const todayKey =
        getDateKey(now);


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


    // ==========================================
    // ESCAPE
    // ==========================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            value === undefined ||
            value === null
                ? ""
                : String(value);

        return element.innerHTML;
    }


    // ==========================================
    // PRICE
    // ==========================================

    function getPrice(value) {

        const number =
            Number(
                String(value || 0)
                    .replace(/[^\d.]/g, "")
            );

        return Number.isFinite(number)
            ? number
            : 0;
    }


    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    function loadBookings() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem("bookings")
                );

            bookings =
                Array.isArray(saved)
                    ? saved
                    : [];

        } catch (error) {

            bookings = [];
        }


        if (sidebarBookingsCount) {

            sidebarBookingsCount.textContent =
                bookings.length;
        }
    }


    // ==========================================
    // LOAD STAFF
    // ==========================================

    function loadStaff() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem("lumiereStaff")
                );


            if (
                Array.isArray(saved) &&
                saved.length > 0
            ) {

                staffMembers =
                    saved.map(
                        function (staff) {

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
                        }
                    );

            } else {

                staffMembers =
                    defaultStaff.map(
                        function (staff) {

                            return {
                                ...staff
                            };
                        }
                    );

                saveStaff();
            }

        } catch (error) {

            staffMembers =
                defaultStaff.map(
                    function (staff) {

                        return {
                            ...staff
                        };
                    }
                );

            saveStaff();
        }
    }


    // ==========================================
    // SAVE STAFF
    // ==========================================

    function saveStaff() {

        localStorage.setItem(
            "lumiereStaff",
            JSON.stringify(staffMembers)
        );
    }


    // ==========================================
    // ID
    // ==========================================

    function generateStaffId() {

        return (
            "staff-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 10000
            )
        );
    }


    // ==========================================
    // STAFF BOOKINGS
    // ==========================================

    function getStaffBookings(staff) {

        return bookings.filter(
            function (booking) {

                const bookingStaffId =
                    String(
                        booking.staffId || ""
                    );

                const bookingStaffName =
                    String(
                        booking.staff || ""
                    ).trim();


                if (
                    bookingStaffId &&
                    String(staff.id) ===
                    bookingStaffId
                ) {

                    return true;
                }


                return (
                    bookingStaffName ===
                    String(
                        staff.name || ""
                    ).trim()
                );
            }
        );
    }


    // ==========================================
    // STAFF STATS
    // ==========================================

    function getStaffStats(staff) {

        const staffBookings =
            getStaffBookings(staff);


        const upcoming =
            staffBookings.filter(
                function (booking) {

                    return (
                        booking.status !== "ملغي" &&
                        booking.date &&
                        booking.date >= todayKey
                    );
                }
            ).length;


        const completed =
            staffBookings.filter(
                function (booking) {

                    return (
                        booking.status === "مكتمل"
                    );
                }
            ).length;


        const revenue =
            staffBookings.reduce(
                function (total, booking) {

                    if (
                        booking.status === "ملغي"
                    ) {

                        return total;
                    }

                    return (
                        total +
                        getPrice(
                            booking.price
                        )
                    );
                },
                0
            );


        return {

            total:
                staffBookings.length,

            upcoming:
                upcoming,

            completed:
                completed,

            revenue:
                revenue
        };
    }


    // ==========================================
    // GLOBAL STATS
    // ==========================================

    function updateStatistics() {

        const activeCount =
            staffMembers.filter(
                function (staff) {

                    return (
                        staff.status === "active"
                    );
                }
            ).length;


        let upcomingCount = 0;

        let revenueTotal = 0;


        staffMembers.forEach(
            function (staff) {

                const stats =
                    getStaffStats(staff);

                upcomingCount +=
                    stats.upcoming;

                revenueTotal +=
                    stats.revenue;
            }
        );


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
                revenueTotal.toLocaleString(
                    "en-US"
                );
        }
    }


    // ==========================================
    // FILTER STAFF
    // ==========================================

    function getFilteredStaff() {

        const searchText =
            staffSearch
                ? staffSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        return staffMembers.filter(
            function (staff) {

                const matchesFilter =
                    currentFilter === "all" ||
                    staff.status === currentFilter;


                const text =
                    (
                        staff.name +
                        " " +
                        staff.specialty +
                        " " +
                        staff.phone
                    ).toLowerCase();


                const matchesSearch =
                    !searchText ||
                    text.includes(
                        searchText
                    );


                return (
                    matchesFilter &&
                    matchesSearch
                );
            }
        );
    }


    // ==========================================
    // DISPLAY STAFF
    // ==========================================

    function displayStaff() {

        if (!staffTableBody) {

            return;
        }


        staffTableBody.innerHTML =
            "";


        const filteredStaff =
            getFilteredStaff();


        if (staffResultsCount) {

            staffResultsCount.textContent =
                filteredStaff.length;
        }


        if (
            filteredStaff.length === 0
        ) {

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
                    getStaffStats(staff);


                const row =
                    document.createElement(
                        "tr"
                    );


                const statusText =
                    staff.status === "active"
                        ? "نشطة"
                        : "متوقفة";


                const statusClass =
                    staff.status === "active"
                        ? "active"
                        : "inactive";


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
                            ${stats.total}
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

                        <span class="admin-customer-status ${statusClass}">
                            ${statusText}
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
                                title="تفعيل / إيقاف"
                            >

                                <i class="fa-solid ${
                                    staff.status === "active"
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


                staffTableBody.appendChild(
                    row
                );
            }
        );
    }


    // ==========================================
    // TABLE ACTIONS
    // ==========================================

    if (staffTableBody) {

        staffTableBody.addEventListener(
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
                    button.getAttribute(
                        "data-action"
                    );

                const staffId =
                    button.getAttribute(
                        "data-id"
                    );


                if (
                    action === "details"
                ) {

                    openStaffDetails(
                        staffId
                    );
                }


                if (
                    action === "edit"
                ) {

                    openEditStaff(
                        staffId
                    );
                }


                if (
                    action === "toggle"
                ) {

                    toggleStaff(
                        staffId
                    );
                }


                if (
                    action === "delete"
                ) {

                    openDeleteStaff(
                        staffId
                    );
                }
            }
        );
    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (staffSearch) {

        staffSearch.addEventListener(
            "input",
            displayStaff
        );
    }


    // ==========================================
    // FILTER BUTTONS
    // ==========================================

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
                        button.getAttribute(
                            "data-filter"
                        ) || "all";


                    displayStaff();
                }
            );
        }
    );


    // ==========================================
    // SHOW FORM
    // ==========================================

    function showStaffForm() {

        if (staffFormModal) {

            staffFormModal.classList.add(
                "show"
            );
        }


        if (staffFormOverlay) {

            staffFormOverlay.classList.add(
                "show"
            );
        }


        document.body.style.overflow =
            "hidden";
    }


    // ==========================================
    // CLOSE FORM
    // ==========================================

    function closeStaffForm() {

        if (staffFormModal) {

            staffFormModal.classList.remove(
                "show"
            );
        }


        if (staffFormOverlay) {

            staffFormOverlay.classList.remove(
                "show"
            );
        }


        editingStaffId = null;


        if (staffFormError) {

            staffFormError.textContent =
                "";
        }


        document.body.style.overflow =
            "";
    }


    // ==========================================
    // ADD STAFF
    // ==========================================

    function openAddStaff() {

        editingStaffId =
            null;


        if (staffFormTitle) {

            staffFormTitle.textContent =
                "إضافة موظفة";
        }


        if (staffForm) {

            staffForm.reset();
        }


        if (staffStatusInput) {

            staffStatusInput.value =
                "active";
        }


        if (staffFormError) {

            staffFormError.textContent =
                "";
        }


        showStaffForm();


        setTimeout(
            function () {

                if (staffNameInput) {

                    staffNameInput.focus();
                }

            },
            100
        );
    }


    if (addStaffBtn) {

        addStaffBtn.addEventListener(
            "click",
            openAddStaff
        );
    }


    // ==========================================
    // EDIT STAFF
    // ==========================================

    function openEditStaff(staffId) {

        const staff =
            staffMembers.find(
                function (item) {

                    return (
                        String(item.id) ===
                        String(staffId)
                    );
                }
            );


        if (!staff) {

            return;
        }


        editingStaffId =
            staff.id;


        if (staffFormTitle) {

            staffFormTitle.textContent =
                "تعديل الموظفة";
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
                staff.phone || "";
        }


        if (staffStatusInput) {

            staffStatusInput.value =
                staff.status;
        }


        if (staffFormError) {

            staffFormError.textContent =
                "";
        }


        showStaffForm();
    }


    // ==========================================
    // VALID PHONE
    // ==========================================

    function validPhone(phone) {

        if (!phone) {

            return true;
        }


        return /^05\d{8}$/.test(
            phone
        );
    }


    // ==========================================
    // SAVE FORM
    // ==========================================

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


                if (
                    !validPhone(phone)
                ) {

                    showFormError(
                        "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."
                    );

                    return;
                }


                if (editingStaffId) {

                    const index =
                        staffMembers.findIndex(
                            function (staff) {

                                return (
                                    String(staff.id) ===
                                    String(editingStaffId)
                                );
                            }
                        );


                    if (index === -1) {

                        return;
                    }


                    const oldName =
                        staffMembers[index].name;


                    staffMembers[index] = {

                        ...staffMembers[index],

                        name:
                            name,

                        specialty:
                            specialty,

                        phone:
                            phone,

                        status:
                            status
                    };


                    // تحديث اسم الموظفة في الحجوزات القديمة

                    bookings.forEach(
                        function (booking) {

                            if (
                                String(
                                    booking.staffId || ""
                                ) ===
                                String(editingStaffId) ||
                                String(
                                    booking.staff || ""
                                ).trim() === oldName
                            ) {

                                booking.staff =
                                    name;

                                booking.staffId =
                                    editingStaffId;
                            }
                        }
                    );


                    localStorage.setItem(
                        "bookings",
                        JSON.stringify(bookings)
                    );


                    showToast(
                        "تم تعديل بيانات الموظفة"
                    );

                } else {

                    staffMembers.push({

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
                    });


                    showToast(
                        "تمت إضافة الموظفة"
                    );
                }


                saveStaff();

                updateStatistics();

                displayStaff();

                closeStaffForm();
            }
        );
    }


    function showFormError(message) {

        if (staffFormError) {

            staffFormError.textContent =
                message;
        }
    }


    // ==========================================
    // CLOSE FORM EVENTS
    // ==========================================

    if (staffFormClose) {

        staffFormClose.addEventListener(
            "click",
            closeStaffForm
        );
    }


    if (staffFormCancel) {

        staffFormCancel.addEventListener(
            "click",
            closeStaffForm
        );
    }


    if (staffFormOverlay) {

        staffFormOverlay.addEventListener(
            "click",
            closeStaffForm
        );
    }


    // ==========================================
    // TOGGLE STAFF
    // ==========================================

    function toggleStaff(staffId) {

        const staff =
            staffMembers.find(
                function (item) {

                    return (
                        String(item.id) ===
                        String(staffId)
                    );
                }
            );


        if (!staff) {

            return;
        }


        if (
            staff.status === "active"
        ) {

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


    // ==========================================
    // DETAILS
    // ==========================================

    function openStaffDetails(staffId) {

        const staff =
            staffMembers.find(
                function (item) {

                    return (
                        String(item.id) ===
                        String(staffId)
                    );
                }
            );


        if (!staff) {

            return;
        }


        const stats =
            getStaffStats(staff);


        if (modalStaffName) {

            modalStaffName.textContent =
                staff.name;
        }


        if (modalStaffSpecialty) {

            modalStaffSpecialty.textContent =
                staff.phone
                    ? (
                        staff.specialty +
                        " • " +
                        staff.phone
                    )
                    : staff.specialty;
        }


        if (modalStaffBookings) {

            modalStaffBookings.textContent =
                stats.total;
        }


        if (modalStaffUpcoming) {

            modalStaffUpcoming.textContent =
                stats.upcoming;
        }


        if (modalStaffRevenue) {

            modalStaffRevenue.textContent =
                stats.revenue.toLocaleString(
                    "en-US"
                ) +
                " ر.س";
        }


        displayStaffHistory(
            staff
        );


        if (detailsModal) {

            detailsModal.classList.add(
                "show"
            );
        }


        if (detailsOverlay) {

            detailsOverlay.classList.add(
                "show"
            );
        }


        document.body.style.overflow =
            "hidden";
    }


    // ==========================================
    // HISTORY
    // ==========================================

    function displayStaffHistory(staff) {

        if (!staffBookingHistory) {

            return;
        }


        staffBookingHistory.innerHTML =
            "";


        const history =
            getStaffBookings(staff)
                .slice()
                .sort(
                    function (a, b) {

                        return String(
                            b.date || ""
                        ).localeCompare(
                            String(
                                a.date || ""
                            )
                        );
                    }
                );


        if (
            history.length === 0
        ) {

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


        history.forEach(
            function (booking) {

                const item =
                    document.createElement(
                        "div"
                    );


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
                                booking.date ||
                                "-"
                            )}
                            •
                            ${escapeHTML(
                                booking.time ||
                                "-"
                            )}
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${getPrice(
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


                staffBookingHistory.appendChild(
                    item
                );
            }
        );
    }


    // ==========================================
    // CLOSE DETAILS
    // ==========================================

    function closeDetails() {

        if (detailsModal) {

            detailsModal.classList.remove(
                "show"
            );
        }


        if (detailsOverlay) {

            detailsOverlay.classList.remove(
                "show"
            );
        }


        document.body.style.overflow =
            "";
    }


    if (detailsClose) {

        detailsClose.addEventListener(
            "click",
            closeDetails
        );
    }


    if (detailsDone) {

        detailsDone.addEventListener(
            "click",
            closeDetails
        );
    }


    if (detailsOverlay) {

        detailsOverlay.addEventListener(
            "click",
            closeDetails
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    function openDeleteStaff(staffId) {

        deletingStaffId =
            staffId;


        if (deleteModal) {

            deleteModal.classList.add(
                "show"
            );
        }


        if (deleteOverlay) {

            deleteOverlay.classList.add(
                "show"
            );
        }


        document.body.style.overflow =
            "hidden";
    }


    function closeDeleteStaff() {

        deletingStaffId =
            null;


        if (deleteModal) {

            deleteModal.classList.remove(
                "show"
            );
        }


        if (deleteOverlay) {

            deleteOverlay.classList.remove(
                "show"
            );
        }


        document.body.style.overflow =
            "";
    }


    if (deleteCancel) {

        deleteCancel.addEventListener(
            "click",
            closeDeleteStaff
        );
    }


    if (deleteOverlay) {

        deleteOverlay.addEventListener(
            "click",
            closeDeleteStaff
        );
    }


    if (deleteConfirm) {

        deleteConfirm.addEventListener(
            "click",
            function () {

                if (!deletingStaffId) {

                    return;
                }


                staffMembers =
                    staffMembers.filter(
                        function (staff) {

                            return (
                                String(staff.id) !==
                                String(deletingStaffId)
                            );
                        }
                    );


                saveStaff();

                updateStatistics();

                displayStaff();

                closeDeleteStaff();

                showToast(
                    "تم حذف الموظفة"
                );
            }
        );
    }


    // ==========================================
    // TOAST
    // ==========================================

    function showToast(message) {

        if (
            !toast ||
            !toastText
        ) {

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


    // ==========================================
    // LOGOUT
    // ==========================================

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


    // ==========================================
    // MOBILE SIDEBAR
    // ==========================================

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


        document.body.style.overflow =
            "";
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


    // ==========================================
    // ESC
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;
            }


            closeStaffForm();

            closeDetails();

            closeDeleteStaff();

            closeSidebar();
        }
    );


    // ==========================================
    // START
    // ==========================================

    loadBookings();

    loadStaff();

    updateStatistics();

    displayStaff();

});