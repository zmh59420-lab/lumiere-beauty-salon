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

    const allBookingsEl = document.getElementById("adminAllBookings");
    const confirmedBookingsEl = document.getElementById("adminConfirmedBookings");
    const completedBookingsEl = document.getElementById("adminCompletedBookings");
    const cancelledBookingsEl = document.getElementById("adminCancelledBookings");

    const searchInput = document.getElementById("adminBookingSearch");
    const filterButtons = document.querySelectorAll(".admin-filter-btn");

    const resultsCount = document.getElementById("adminBookingResultsCount");
    const tableBody = document.getElementById("adminBookingsTableBody");
    const emptyState = document.getElementById("adminBookingsEmpty");

    const sidebarBookingsCount = document.getElementById("sidebarBookingsCount");
    const currentDateEl = document.getElementById("adminCurrentDate");


    // =====================================================
    // ADD / EDIT MODAL
    // =====================================================

    const addBookingBtn = document.getElementById("adminAddBookingBtn");

    const formModal = document.getElementById("adminBookingFormModal");
    const formOverlay = document.getElementById("adminBookingFormOverlay");
    const formClose = document.getElementById("adminBookingFormClose");

    const formTitle = document.getElementById("adminBookingFormTitle");
    const bookingForm = document.getElementById("adminBookingForm");

    const customerNameInput = document.getElementById("adminBookingCustomerName");
    const customerPhoneInput = document.getElementById("adminBookingCustomerPhone");

    const serviceInput = document.getElementById("adminBookingService");
    const staffInput = document.getElementById("adminBookingStaff");

    const dateInput = document.getElementById("adminBookingDate");
    const timeInput = document.getElementById("adminBookingTime");

    const priceInput = document.getElementById("adminBookingPrice");
    const statusInput = document.getElementById("adminBookingStatus");

    const notesInput = document.getElementById("adminBookingNotes");
    const formError = document.getElementById("adminBookingFormError");


    // =====================================================
    // DETAILS MODAL
    // =====================================================

    const detailsModal = document.getElementById("adminBookingModal");
    const detailsOverlay = document.getElementById("adminBookingModalOverlay");
    const detailsClose = document.getElementById("adminBookingModalClose");

    const modalService = document.getElementById("adminModalService");
    const modalBookingNumber = document.getElementById("adminModalBookingNumber");

    const modalCustomerName = document.getElementById("adminModalCustomerName");
    const modalCustomerPhone = document.getElementById("adminModalCustomerPhone");

    const modalStaff = document.getElementById("adminModalStaff");
    const modalDate = document.getElementById("adminModalDate");
    const modalTime = document.getElementById("adminModalTime");
    const modalPrice = document.getElementById("adminModalPrice");
    const modalNotes = document.getElementById("adminModalNotes");

    const modalStatus = document.getElementById("adminModalStatus");
    const modalSaveBtn = document.getElementById("adminModalSaveBtn");


    // =====================================================
    // DELETE MODAL
    // =====================================================

    const deleteModal = document.getElementById("adminDeleteBookingModal");
    const deleteOverlay = document.getElementById("adminDeleteBookingOverlay");
    const deleteCancel = document.getElementById("adminDeleteBookingCancel");
    const deleteConfirm = document.getElementById("adminDeleteBookingConfirm");


    // =====================================================
    // TOAST
    // =====================================================

    const toast = document.getElementById("adminSuccessToast");
    const toastText = document.getElementById("adminSuccessToastText");


    // =====================================================
    // SIDEBAR
    // =====================================================

    const logoutBtn = document.getElementById("adminLogoutBtn");
    const mobileMenuBtn = document.getElementById("adminMobileMenu");
    const sidebar = document.getElementById("adminSidebar");
    const sidebarOverlay = document.getElementById("adminSidebarOverlay");


    // =====================================================
    // DATA
    // =====================================================

    let bookings = [];
    let services = [];
    let staffMembers = [];
    let customers = [];

    let currentFilter = "all";

    let editingBookingNumber = null;
    let selectedBookingNumber = null;
    let deletingBookingNumber = null;

    let toastTimer = null;


    // =====================================================
    // DATE
    // =====================================================

    function getDateKey(date) {

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    const todayKey = getDateKey(new Date());


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


    if (dateInput) {
        dateInput.min = todayKey;
    }


    // =====================================================
    // HELPERS
    // =====================================================

    function safeJSON(key, fallback = []) {

        try {

            const value = JSON.parse(localStorage.getItem(key));

            return Array.isArray(value)
                ? value
                : fallback;

        } catch (error) {

            return fallback;
        }
    }


    function escapeHTML(value) {

        const div = document.createElement("div");

        div.textContent =
            value === undefined ||
            value === null ||
            value === ""
                ? "-"
                : String(value);

        return div.innerHTML;
    }


    function normalizePhone(phone) {

        return String(phone || "")
            .replace(/\s/g, "")
            .replace(/-/g, "")
            .trim();
    }


    function getPrice(price) {

        const number =
            Number(
                String(price || 0)
                    .replace(/[^\d.]/g, "")
            );

        return Number.isNaN(number)
            ? 0
            : number;
    }


    function isValidPhone(phone) {

        return /^05\d{8}$/.test(phone);
    }


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    function loadBookings() {

        bookings = safeJSON("bookings");


        // تحويل الحجوزات الماضية إلى مكتملة

        bookings = bookings.map(function (booking) {

            if (
                booking.date &&
                booking.date < todayKey &&
                booking.status !== "ملغي"
            ) {
                booking.status = "مكتمل";
            }


            if (!booking.status) {
                booking.status = "مؤكد";
            }


            return booking;
        });


        saveBookings();
    }


    function saveBookings() {

        localStorage.setItem(
            "bookings",
            JSON.stringify(bookings)
        );
    }


    // =====================================================
    // SERVICES
    // =====================================================

    function loadServices() {

        services = safeJSON("lumiereServices");


        // إذا الخدمات الإدارية فارغة
        // نقرأ الخدمات الموجودة بالحجوزات القديمة

        if (services.length === 0) {

            const map = new Map();


            bookings.forEach(function (booking) {

                const name = String(booking.service || "").trim();

                if (!name || map.has(name)) {
                    return;
                }


                map.set(name, {

                    id: "SRV-" + Date.now() + "-" + Math.random(),

                    name: name,

                    price: getPrice(booking.price),

                    category: "أخرى",

                    status: "active"
                });
            });


            services = Array.from(map.values());


            if (services.length > 0) {

                localStorage.setItem(
                    "lumiereServices",
                    JSON.stringify(services)
                );
            }
        }
    }


    // =====================================================
    // STAFF
    // =====================================================

    function loadStaff() {

        staffMembers = safeJSON("lumiereStaff");


        if (staffMembers.length === 0) {

            const map = new Map();


            bookings.forEach(function (booking) {

                const name = String(booking.staff || "").trim();

                if (!name || map.has(name)) {
                    return;
                }


                map.set(name, {

                    id: "STF-" + Date.now() + "-" + Math.random(),

                    name: name,

                    specialty: "متعددة التخصصات",

                    phone: "",

                    status: "active"
                });
            });


            staffMembers = Array.from(map.values());


            if (staffMembers.length > 0) {

                localStorage.setItem(
                    "lumiereStaff",
                    JSON.stringify(staffMembers)
                );
            }
        }
    }


    // =====================================================
    // CUSTOMERS
    // =====================================================

    function loadCustomers() {

        customers = safeJSON("lumiereCustomers");
    }


    // =====================================================
    // SELECT OPTIONS
    // =====================================================

    function fillServicesSelect() {

        if (!serviceInput) return;


        const previousValue = serviceInput.value;


        serviceInput.innerHTML = `
            <option value="">
                اختاري الخدمة
            </option>
        `;


        services
            .filter(function (service) {
                return service.status !== "inactive";
            })
            .forEach(function (service) {

                const option = document.createElement("option");

                option.value = service.name;

                option.textContent =
                    `${service.name} - ${getPrice(service.price)} ر.س`;

                option.dataset.price =
                    getPrice(service.price);

                serviceInput.appendChild(option);
            });


        serviceInput.value = previousValue;
    }


    function fillStaffSelect() {

        if (!staffInput) return;


        const previousValue = staffInput.value;


        staffInput.innerHTML = `
            <option value="">
                اختاري الموظفة
            </option>
        `;


        staffMembers
            .filter(function (staff) {
                return staff.status !== "inactive";
            })
            .forEach(function (staff) {

                const option = document.createElement("option");

                option.value = staff.name;

                option.textContent =
                    staff.specialty
                        ? `${staff.name} - ${staff.specialty}`
                        : staff.name;

                staffInput.appendChild(option);
            });


        staffInput.value = previousValue;
    }


    // =====================================================
    // AUTO PRICE
    // =====================================================

    if (serviceInput) {

        serviceInput.addEventListener("change", function () {

            const selectedOption =
                serviceInput.options[
                    serviceInput.selectedIndex
                ];


            if (
                selectedOption &&
                selectedOption.dataset.price !== undefined
            ) {

                priceInput.value =
                    selectedOption.dataset.price;
            }
        });
    }


    // =====================================================
    // STATISTICS
    // =====================================================

    function updateStats() {

        const confirmed =
            bookings.filter(function (booking) {
                return booking.status === "مؤكد";
            }).length;


        const completed =
            bookings.filter(function (booking) {
                return booking.status === "مكتمل";
            }).length;


        const cancelled =
            bookings.filter(function (booking) {
                return booking.status === "ملغي";
            }).length;


        if (allBookingsEl) {
            allBookingsEl.textContent = bookings.length;
        }

        if (confirmedBookingsEl) {
            confirmedBookingsEl.textContent = confirmed;
        }

        if (completedBookingsEl) {
            completedBookingsEl.textContent = completed;
        }

        if (cancelledBookingsEl) {
            cancelledBookingsEl.textContent = cancelled;
        }

        if (sidebarBookingsCount) {
            sidebarBookingsCount.textContent = confirmed;
        }
    }


    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    function getFilteredBookings() {

        const searchValue =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";


        return bookings.filter(function (booking) {

            if (
                currentFilter !== "all" &&
                booking.status !== currentFilter
            ) {
                return false;
            }


            if (searchValue) {

                const text = [
                    booking.bookingNumber,
                    booking.customerName,
                    booking.customerPhone,
                    booking.service,
                    booking.staff,
                    booking.date,
                    booking.time
                ]
                    .join(" ")
                    .toLowerCase();


                if (!text.includes(searchValue)) {
                    return false;
                }
            }


            return true;
        });
    }


    // =====================================================
    // STATUS CLASS
    // =====================================================

    function getStatusClass(status) {

        if (status === "مؤكد") {
            return "confirmed";
        }

        if (status === "مكتمل") {
            return "completed";
        }

        return "cancelled";
    }


    // =====================================================
    // DISPLAY BOOKINGS
    // =====================================================

    function displayBookings() {

        if (!tableBody) return;


        tableBody.innerHTML = "";


        const filtered =
            getFilteredBookings()
                .slice()
                .sort(function (a, b) {

                    const dateA =
                        `${a.date || ""} ${a.time || ""}`;

                    const dateB =
                        `${b.date || ""} ${b.time || ""}`;

                    return dateB.localeCompare(dateA);
                });


        if (resultsCount) {
            resultsCount.textContent = filtered.length;
        }


        if (filtered.length === 0) {

            if (emptyState) {
                emptyState.style.display = "flex";
            }

            return;
        }


        if (emptyState) {
            emptyState.style.display = "none";
        }


        filtered.forEach(function (booking) {

            const row = document.createElement("tr");


            const customerName =
                booking.customerName ||
                booking.name ||
                localStorage.getItem("customerName") ||
                "عميلة";


            row.innerHTML = `

                <td>

                    <button
                        type="button"
                        class="admin-booking-number-btn"
                        data-action="details"
                        data-number="${escapeHTML(booking.bookingNumber)}"
                    >
                        #${escapeHTML(booking.bookingNumber)}
                    </button>

                </td>


                <td>

                    <strong>
                        ${escapeHTML(customerName)}
                    </strong>

                </td>


                <td>
                    ${escapeHTML(booking.service)}
                </td>


                <td>
                    ${escapeHTML(booking.staff)}
                </td>


                <td>
                    ${escapeHTML(booking.date)}
                </td>


                <td>
                    ${escapeHTML(booking.time)}
                </td>


                <td>

                    <strong>
                        ${getPrice(booking.price).toLocaleString("en-US")}
                    </strong>

                    <span class="admin-currency">
                        ر.س
                    </span>

                </td>


                <td>

                    <span
                        class="admin-booking-status ${getStatusClass(booking.status)}"
                    >
                        ${escapeHTML(booking.status)}
                    </span>

                </td>


                <td>

                    <div class="admin-service-actions">

                        <button
                            type="button"
                            class="admin-service-action-btn edit"
                            data-action="edit"
                            data-number="${escapeHTML(booking.bookingNumber)}"
                            title="تعديل"
                        >
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>


                        <button
                            type="button"
                            class="admin-service-action-btn delete"
                            data-action="delete"
                            data-number="${escapeHTML(booking.bookingNumber)}"
                            title="حذف"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>

                </td>
            `;


            tableBody.appendChild(row);
        });


        setupTableButtons();
    }


    // =====================================================
    // TABLE BUTTONS
    // =====================================================

    function setupTableButtons() {

        const buttons =
            tableBody.querySelectorAll("[data-action][data-number]");


        buttons.forEach(function (button) {

            button.addEventListener("click", function () {

                const action =
                    button.getAttribute("data-action");

                const bookingNumber =
                    button.getAttribute("data-number");


                if (action === "details") {

                    openDetails(bookingNumber);
                    return;
                }


                if (action === "edit") {

                    openEditBooking(bookingNumber);
                    return;
                }


                if (action === "delete") {

                    openDeleteModal(bookingNumber);
                }
            });
        });
    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            displayBookings
        );
    }


    // =====================================================
    // FILTERS
    // =====================================================

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            currentFilter =
                button.getAttribute("data-filter") || "all";


            filterButtons.forEach(function (item) {
                item.classList.remove("active");
            });


            button.classList.add("active");

            displayBookings();
        });
    });


    // =====================================================
    // BOOKING NUMBER
    // =====================================================

    function generateBookingNumber() {

        let number;

        do {

            number =
                String(
                    Math.floor(
                        100000 + Math.random() * 900000
                    )
                );

        } while (
            bookings.some(function (booking) {
                return String(booking.bookingNumber) === number;
            })
        );


        return number;
    }


    // =====================================================
    // ADD BOOKING
    // =====================================================

    function openAddBooking() {

        editingBookingNumber = null;


        if (bookingForm) {
            bookingForm.reset();
        }


        fillServicesSelect();
        fillStaffSelect();


        if (formTitle) {
            formTitle.textContent = "إضافة حجز جديد";
        }


        if (statusInput) {
            statusInput.value = "مؤكد";
        }


        if (dateInput) {
            dateInput.min = todayKey;
        }


        clearFormError();

        openFormModal();
    }


    if (addBookingBtn) {

        addBookingBtn.addEventListener(
            "click",
            openAddBooking
        );
    }


    // =====================================================
    // EDIT BOOKING
    // =====================================================

    function openEditBooking(bookingNumber) {

        const booking =
            bookings.find(function (item) {
                return String(item.bookingNumber) === String(bookingNumber);
            });


        if (!booking) return;


        editingBookingNumber =
            String(booking.bookingNumber);


        fillServicesSelect();
        fillStaffSelect();


        // لو خدمة قديمة أو موظفة قديمة وغير موجودة حاليًا
        // نضيفها مؤقتًا حتى لا تختفي أثناء التعديل

        ensureOptionExists(
            serviceInput,
            booking.service
        );

        ensureOptionExists(
            staffInput,
            booking.staff
        );


        if (formTitle) {
            formTitle.textContent = "تعديل الحجز";
        }


        if (customerNameInput) {

            customerNameInput.value =
                booking.customerName ||
                booking.name ||
                localStorage.getItem("customerName") ||
                "";
        }


        if (customerPhoneInput) {

            customerPhoneInput.value =
                normalizePhone(
                    booking.customerPhone ||
                    booking.phone ||
                    localStorage.getItem("customerPhone") ||
                    ""
                );
        }


        serviceInput.value =
            booking.service || "";

        staffInput.value =
            booking.staff || "";

        dateInput.value =
            booking.date || "";

        timeInput.value =
            convertTimeForInput(booking.time);

        priceInput.value =
            getPrice(booking.price);

        statusInput.value =
            booking.status || "مؤكد";

        notesInput.value =
            booking.notes ||
            booking.bookingNotes ||
            "";


        clearFormError();

        openFormModal();
    }


    function ensureOptionExists(select, value) {

        if (!select || !value) return;


        const exists =
            Array.from(select.options)
                .some(function (option) {
                    return option.value === value;
                });


        if (!exists) {

            const option =
                document.createElement("option");

            option.value = value;
            option.textContent = value;

            select.appendChild(option);
        }
    }


    // =====================================================
    // TIME CONVERSION
    // =====================================================

    function convertTimeForInput(time) {

        if (!time) return "";


        const raw =
            String(time)
                .trim()
                .replace(/\s+/g, " ");


        // 24 hour already

        if (/^\d{1,2}:\d{2}$/.test(raw)) {

            const parts = raw.split(":");

            return (
                String(parts[0]).padStart(2, "0") +
                ":" +
                parts[1]
            );
        }


        // Arabic AM / PM

        const match =
            raw.match(
                /(\d{1,2}):(\d{2})\s*(ص|م|AM|PM)/i
            );


        if (!match) return "";


        let hour = Number(match[1]);

        const minutes = match[2];

        const period =
            match[3].toUpperCase();


        if (
            (period === "م" || period === "PM") &&
            hour !== 12
        ) {
            hour += 12;
        }


        if (
            (period === "ص" || period === "AM") &&
            hour === 12
        ) {
            hour = 0;
        }


        return (
            String(hour).padStart(2, "0") +
            ":" +
            minutes
        );
    }


    // =====================================================
    // FORM MODAL
    // =====================================================

    function openFormModal() {

        if (!formModal) return;


        formModal.classList.add("show");

        document.body.style.overflow = "hidden";


        setTimeout(function () {

            if (customerNameInput) {
                customerNameInput.focus();
            }

        }, 100);
    }


    function closeFormModal() {

        if (formModal) {
            formModal.classList.remove("show");
        }


        editingBookingNumber = null;

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
    // FORM ERROR
    // =====================================================

    function showFormError(message) {

        if (formError) {
            formError.textContent = message;
        }
    }


    function clearFormError() {

        if (formError) {
            formError.textContent = "";
        }
    }


    // =====================================================
    // SAVE BOOKING
    // =====================================================

    if (bookingForm) {

        bookingForm.addEventListener("submit", function (event) {

            event.preventDefault();

            clearFormError();


            const customerName =
                customerNameInput.value.trim();


            const customerPhone =
                normalizePhone(
                    customerPhoneInput.value
                );


            const service =
                serviceInput.value;


            const staff =
                staffInput.value;


            const date =
                dateInput.value;


            const time =
                timeInput.value;


            const price =
                Number(priceInput.value);


            const status =
                statusInput.value;


            const notes =
                notesInput.value.trim();


            // =============================================
            // VALIDATION
            // =============================================

            if (!customerName) {

                showFormError("اكتبي اسم العميلة.");
                return;
            }


            if (!isValidPhone(customerPhone)) {

                showFormError(
                    "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام."
                );

                return;
            }


            if (!service) {

                showFormError("اختاري الخدمة.");
                return;
            }


            if (!staff) {

                showFormError("اختاري الموظفة.");
                return;
            }


            if (!date) {

                showFormError("اختاري تاريخ الحجز.");
                return;
            }


            if (!time) {

                showFormError("اختاري وقت الحجز.");
                return;
            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                showFormError("اكتبي سعرًا صحيحًا.");
                return;
            }


            // =============================================
            // منع حجز نفس الموظفة بنفس الموعد
            // =============================================

            const conflict =
                bookings.some(function (booking) {

                    const sameBooking =
                        editingBookingNumber &&
                        String(booking.bookingNumber) ===
                        String(editingBookingNumber);


                    if (sameBooking) {
                        return false;
                    }


                    return (
                        booking.staff === staff &&
                        booking.date === date &&
                        convertTimeForInput(booking.time) === time &&
                        booking.status !== "ملغي"
                    );
                });


            if (conflict) {

                showFormError(
                    "هذه الموظفة لديها حجز في نفس التاريخ والوقت."
                );

                return;
            }


            // =============================================
            // EDIT
            // =============================================

            if (editingBookingNumber) {

                const index =
                    bookings.findIndex(function (booking) {

                        return (
                            String(booking.bookingNumber) ===
                            String(editingBookingNumber)
                        );
                    });


                if (index === -1) return;


                bookings[index] = {

                    ...bookings[index],

                    customerName: customerName,
                    customerPhone: customerPhone,

                    service: service,
                    staff: staff,

                    date: date,
                    time: time,

                    price: price,
                    status: status,

                    notes: notes,
                    bookingNotes: notes
                };


                saveBookings();

                syncCustomer(
                    customerName,
                    customerPhone
                );


                refreshPage();

                closeFormModal();

                showToast("تم تعديل الحجز بنجاح");

                return;
            }


            // =============================================
            // ADD
            // =============================================

            const bookingNumber =
                generateBookingNumber();


            const newBooking = {

                bookingNumber: bookingNumber,

                customerName: customerName,
                customerPhone: customerPhone,

                service: service,
                staff: staff,

                date: date,
                time: time,

                price: price,

                status: status,

                notes: notes,
                bookingNotes: notes,

                createdAt:
                    new Date().toISOString()
            };


            bookings.unshift(newBooking);

            saveBookings();


            syncCustomer(
                customerName,
                customerPhone
            );


            refreshPage();

            closeFormModal();

            showToast(
                "تمت إضافة الحجز #" +
                bookingNumber +
                " بنجاح"
            );
        });
    }


    // =====================================================
    // SYNC CUSTOMER
    // =====================================================

    function syncCustomer(name, phone) {

        customers = safeJSON("lumiereCustomers");


        const existingCustomer =
            customers.find(function (customer) {

                return (
                    normalizePhone(customer.phone) ===
                    normalizePhone(phone)
                );
            });


        if (existingCustomer) {

            existingCustomer.name = name;
            existingCustomer.phone = phone;

        } else {

            customers.unshift({

                id:
                    "CUS-" +
                    Date.now() +
                    "-" +
                    Math.floor(Math.random() * 10000),

                name: name,

                phone: phone,

                notes: ""
            });
        }


        localStorage.setItem(
            "lumiereCustomers",
            JSON.stringify(customers)
        );
    }


    // =====================================================
    // DETAILS
    // =====================================================

    function openDetails(bookingNumber) {

        const booking =
            bookings.find(function (item) {

                return (
                    String(item.bookingNumber) ===
                    String(bookingNumber)
                );
            });


        if (!booking) return;


        selectedBookingNumber =
            String(booking.bookingNumber);


        const customerName =
            booking.customerName ||
            booking.name ||
            localStorage.getItem("customerName") ||
            "عميلة";


        const customerPhone =
            normalizePhone(
                booking.customerPhone ||
                booking.phone ||
                localStorage.getItem("customerPhone") ||
                ""
            );


        modalService.textContent =
            booking.service || "-";

        modalBookingNumber.textContent =
            "#" + booking.bookingNumber;

        modalCustomerName.textContent =
            customerName;

        modalCustomerPhone.textContent =
            customerPhone || "-";

        modalStaff.textContent =
            booking.staff || "-";

        modalDate.textContent =
            booking.date || "-";

        modalTime.textContent =
            booking.time || "-";

        modalPrice.textContent =
            getPrice(booking.price).toLocaleString("en-US") +
            " ر.س";

        modalNotes.textContent =
            booking.notes ||
            booking.bookingNotes ||
            "لا توجد ملاحظات";


        modalStatus.value =
            booking.status || "مؤكد";


        if (detailsModal) {

            detailsModal.classList.add("show");

            document.body.style.overflow = "hidden";
        }
    }


    function closeDetails() {

        if (detailsModal) {
            detailsModal.classList.remove("show");
        }


        selectedBookingNumber = null;

        document.body.style.overflow = "";
    }


    if (detailsClose) {

        detailsClose.addEventListener(
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


    // =====================================================
    // SAVE STATUS FROM DETAILS
    // =====================================================

    if (modalSaveBtn) {

        modalSaveBtn.addEventListener("click", function () {

            if (!selectedBookingNumber) return;


            const index =
                bookings.findIndex(function (booking) {

                    return (
                        String(booking.bookingNumber) ===
                        String(selectedBookingNumber)
                    );
                });


            if (index === -1) return;


            bookings[index].status =
                modalStatus.value;


            saveBookings();

            refreshPage();

            closeDetails();

            showToast(
                "تم تحديث حالة الحجز"
            );
        });
    }


    // =====================================================
    // DELETE
    // =====================================================

    function openDeleteModal(bookingNumber) {

        deletingBookingNumber =
            String(bookingNumber);


        if (deleteModal) {

            deleteModal.classList.add("show");

            document.body.style.overflow = "hidden";
        }
    }


    function closeDeleteModal() {

        if (deleteModal) {
            deleteModal.classList.remove("show");
        }


        deletingBookingNumber = null;

        document.body.style.overflow = "";
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

        deleteConfirm.addEventListener("click", function () {

            if (!deletingBookingNumber) return;


            bookings =
                bookings.filter(function (booking) {

                    return (
                        String(booking.bookingNumber) !==
                        String(deletingBookingNumber)
                    );
                });


            saveBookings();

            refreshPage();

            closeDeleteModal();

            showToast("تم حذف الحجز");
        });
    }


    // =====================================================
    // TOAST
    // =====================================================

    function showToast(message) {

        if (!toast || !toastText) return;


        toastText.textContent = message;

        toast.classList.add("show");


        if (toastTimer) {
            clearTimeout(toastTimer);
        }


        toastTimer =
            setTimeout(function () {

                toast.classList.remove("show");

            }, 2500);
    }


    // =====================================================
    // REFRESH
    // =====================================================

    function refreshPage() {

        loadBookings();
        loadServices();
        loadStaff();
        loadCustomers();

        fillServicesSelect();
        fillStaffSelect();

        updateStats();
        displayBookings();
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            sessionStorage.removeItem(
                "lumiereAdminLoggedIn"
            );

            window.location.href =
                "admin-login.html";
        });
    }


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("show");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("show");
        }

        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("show");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
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
    // ESC
    // =====================================================

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") return;


        if (
            deleteModal &&
            deleteModal.classList.contains("show")
        ) {

            closeDeleteModal();
            return;
        }


        if (
            formModal &&
            formModal.classList.contains("show")
        ) {

            closeFormModal();
            return;
        }


        if (
            detailsModal &&
            detailsModal.classList.contains("show")
        ) {

            closeDetails();
            return;
        }


        closeSidebar();
    });


    // =====================================================
    // START
    // =====================================================

    refreshPage();

});
// =============================================
// MOBILE ADMIN MENU FIX
// =============================================

const mobileMenuFix = document.getElementById("adminMobileMenu");
const sidebarFix = document.getElementById("adminSidebar");
const sidebarOverlayFix = document.getElementById("adminSidebarOverlay");

if (mobileMenuFix && sidebarFix) {

    mobileMenuFix.addEventListener("click", function () {

        sidebarFix.classList.toggle("open");

        if (sidebarOverlayFix) {
            sidebarOverlayFix.classList.toggle("show");
        }

    });

}

if (sidebarOverlayFix && sidebarFix) {

    sidebarOverlayFix.addEventListener("click", function () {

        sidebarFix.classList.remove("open");
        sidebarOverlayFix.classList.remove("show");

    });

}