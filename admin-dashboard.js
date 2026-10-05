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

    const totalBookingsElement =
        document.getElementById("adminTotalBookings");

    const todayBookingsElement =
        document.getElementById("adminTodayBookings");

    const totalCustomersElement =
        document.getElementById("adminTotalCustomers");

    const revenueElement =
        document.getElementById("adminTotalRevenue");

    const recentBookingsBody =
        document.getElementById("adminRecentBookings");

    const emptyState =
        document.getElementById("adminDashboardEmpty");

    const sidebarBookingsCount =
        document.getElementById("sidebarBookingsCount");

    const currentDateElement =
        document.getElementById("adminCurrentDate");

    const logoutButton =
        document.getElementById("adminLogoutBtn");

    const mobileMenu =
        document.getElementById("adminMobileMenu");

    const sidebar =
        document.getElementById("adminSidebar");

    const sidebarOverlay =
        document.getElementById("adminSidebarOverlay");


    // =====================================================
    // HELPERS
    // =====================================================

    function readArray(key) {

        try {

            const data =
                JSON.parse(
                    localStorage.getItem(key)
                );

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            return [];
        }
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


    function getToday() {

        const date =
            new Date();

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


    function getBookingStatus(booking) {

        const status =
            String(
                booking.status || "مؤكد"
            ).trim();


        if (
            status === "ملغي" ||
            status === "ملغى" ||
            status === "cancelled"
        ) {
            return "ملغي";
        }


        if (
            status === "مكتمل" ||
            status === "completed"
        ) {
            return "مكتمل";
        }


        return "مؤكد";
    }


    function getStatusClass(status) {

        if (status === "مكتمل") {
            return "completed";
        }

        if (status === "ملغي") {
            return "cancelled";
        }

        return "confirmed";
    }


    // =====================================================
    // CURRENT DATE
    // =====================================================

    if (currentDateElement) {

        const date =
            new Date();


        currentDateElement.textContent =
            date.toLocaleDateString(
                "ar-SA",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );
    }


    // =====================================================
    // DATA
    // =====================================================

    const bookings =
        readArray("bookings");

    const savedCustomers =
        readArray("lumiereCustomers");


    // =====================================================
    // CUSTOMERS
    // =====================================================

    const customerPhones =
        new Set();


    bookings.forEach(function (booking) {

        const phone =
            booking.customerPhone ||
            booking.phone ||
            "";

        const name =
            booking.customerName ||
            booking.name ||
            "";


        if (phone) {

            customerPhones.add(
                String(phone)
            );

        } else if (name) {

            customerPhones.add(
                "name:" + String(name)
            );
        }
    });


    savedCustomers.forEach(function (customer) {

        if (customer.phone) {

            customerPhones.add(
                String(customer.phone)
            );

        } else if (customer.name) {

            customerPhones.add(
                "name:" + String(customer.name)
            );
        }
    });


    // =====================================================
    // REVENUE
    // =====================================================

    let revenue = 0;


    bookings.forEach(function (booking) {

        if (
            getBookingStatus(booking) === "مكتمل"
        ) {

            const price =
                Number(
                    booking.price ||
                    booking.servicePrice ||
                    0
                );


            if (!Number.isNaN(price)) {

                revenue += price;
            }
        }
    });


    // =====================================================
    // TODAY
    // =====================================================

    const today =
        getToday();


    const todayBookings =
        bookings.filter(
            function (booking) {

                return (
                    booking.date === today &&
                    getBookingStatus(booking) !== "ملغي"
                );
            }
        );


    // =====================================================
    // STATS
    // =====================================================

    if (totalBookingsElement) {

        totalBookingsElement.textContent =
            bookings.length;
    }


    if (todayBookingsElement) {

        todayBookingsElement.textContent =
            todayBookings.length;
    }


    if (totalCustomersElement) {

        totalCustomersElement.textContent =
            customerPhones.size;
    }


    if (revenueElement) {

        revenueElement.textContent =
            revenue.toLocaleString("en-US");
    }


    if (sidebarBookingsCount) {

        sidebarBookingsCount.textContent =
            bookings.length;
    }


    // =====================================================
    // RECENT BOOKINGS
    // =====================================================

    function renderRecentBookings() {

        if (!recentBookingsBody) {
            return;
        }


        recentBookingsBody.innerHTML = "";


        const recent =
            [...bookings]
                .reverse()
                .slice(0, 5);


        if (recent.length === 0) {

            if (emptyState) {
                emptyState.style.display = "block";
            }

            return;
        }


        if (emptyState) {
            emptyState.style.display = "none";
        }


        recent.forEach(function (booking) {

            const row =
                document.createElement("tr");


            const status =
                getBookingStatus(booking);


            row.innerHTML = `

                <td>
                    #${escapeHTML(
                        booking.bookingNumber ||
                        booking.number ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.customerName ||
                        booking.name ||
                        "عميلة"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.serviceName ||
                        booking.service ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.staff ||
                        booking.staffName ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        booking.date || "-"
                    )}
                </td>

                <td>

                    <span class="admin-booking-status ${getStatusClass(status)}">
                        ${status}
                    </span>

                </td>
            `;


            recentBookingsBody.appendChild(
                row
            );
        });
    }


    renderRecentBookings();


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

});