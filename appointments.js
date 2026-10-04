document.addEventListener("DOMContentLoaded", function () {

    const appointmentsList =
        document.getElementById("appointmentsList");

    const emptyAppointments =
        document.getElementById("emptyAppointments");

    const tabs =
        document.querySelectorAll(".appointment-tab");


    // ========================================
    // جلب الحجوزات المحفوظة
    // ========================================

    let bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    // ========================================
    // عرض الحجوزات
    // ========================================

    function displayBookings(filter) {

        appointmentsList.innerHTML = "";

        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const filteredBookings = bookings.filter(function (booking) {

            const bookingDate =
                new Date(booking.date + "T00:00:00");


            if (filter === "upcoming") {

                return (
                    bookingDate >= today &&
                    booking.status !== "ملغي"
                );

            }


            if (filter === "previous") {

                return (
                    bookingDate < today ||
                    booking.status === "ملغي"
                );

            }


            return true;

        });


        // ========================================
        // إذا ما فيه حجوزات
        // ========================================

        if (filteredBookings.length === 0) {

            emptyAppointments.style.display = "block";

            return;

        }


        emptyAppointments.style.display = "none";


        // ========================================
        // إنشاء كروت الحجوزات
        // ========================================

        filteredBookings.forEach(function (booking) {

            const card =
                document.createElement("div");

            card.className = "appointment-card";


            card.innerHTML = `

                <div class="appointment-card-top">

                    <div>

                        <span class="appointment-number">
                            ${booking.bookingNumber}
                        </span>

                        <h2>
                            ${booking.service}
                        </h2>

                    </div>


                    <span class="appointment-status">
                        ${booking.status}
                    </span>

                </div>


                <div class="appointment-details">

                    <div>

                        <i class="fa-regular fa-user"></i>

                        <span>
                            ${booking.staff}
                        </span>

                    </div>


                    <div>

                        <i class="fa-regular fa-calendar"></i>

                        <span>
                            ${booking.date}
                        </span>

                    </div>


                    <div>

                        <i class="fa-regular fa-clock"></i>

                        <span>
                            ${booking.time}
                        </span>

                    </div>

                </div>


                ${
                    booking.notes
                    ?
                    `

                    <div class="appointment-notes">

                        <div class="appointment-notes-icon">

                            <i class="fa-regular fa-message"></i>

                        </div>


                        <div>

                            <strong>
                                ملاحظتك
                            </strong>

                            <p>
                                ${booking.notes}
                            </p>

                        </div>

                    </div>

                    `
                    :
                    ""
                }


                <div class="appointment-bottom">

                    <div class="appointment-price">

                        <strong>
                            ${booking.price}
                        </strong>

                        <span>
                            ر.س
                        </span>

                    </div>


                    <div class="appointment-actions">

                        ${
                            booking.status !== "ملغي"
                            ?
                            `

                            <button
                                type="button"
                                class="edit-booking-btn"
                                data-number="${booking.bookingNumber}">

                                <i class="fa-regular fa-calendar"></i>

                                تعديل الموعد

                            </button>


                            <button
                                type="button"
                                class="rebook-btn"
                                data-number="${booking.bookingNumber}">

                                <i class="fa-solid fa-rotate-right"></i>

                                إعادة الحجز

                            </button>


                            <button
                                type="button"
                                class="cancel-booking-btn"
                                data-number="${booking.bookingNumber}">

                                إلغاء الحجز

                            </button>

                            `
                            :
                            `

                            <button
                                type="button"
                                class="rebook-btn"
                                data-number="${booking.bookingNumber}">

                                <i class="fa-solid fa-rotate-right"></i>

                                إعادة الحجز

                            </button>

                            `
                        }

                    </div>

                </div>

            `;


            appointmentsList.appendChild(card);

        });


        setupCancelButtons();

        setupRebookButtons();

        setupEditButtons();

    }


    // ========================================
    // تعديل الموعد
    // ========================================

    function setupEditButtons() {

        const editButtons =
            document.querySelectorAll(".edit-booking-btn");


        editButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const bookingNumber =
                    button.getAttribute("data-number");


                const booking =
                    bookings.find(function (item) {

                        return (
                            item.bookingNumber === bookingNumber
                        );

                    });


                if (!booking) {
                    return;
                }


                // حفظ رقم الحجز الذي نريد تعديله

                localStorage.setItem(
                    "editingBookingNumber",
                    booking.bookingNumber
                );


                // حفظ بيانات الخدمة

                localStorage.setItem(
                    "selectedServiceName",
                    booking.service
                );


                localStorage.setItem(
                    "selectedServicePrice",
                    booking.price
                );


                // حفظ الموظفة

                localStorage.setItem(
                    "selectedStaff",
                    booking.staff
                );


                // حذف الموعد القديم من الاختيار المؤقت

                localStorage.removeItem("selectedDate");

                localStorage.removeItem("selectedTime");


                // الانتقال لاختيار موعد جديد

                window.location.href = "datetime.html";

            });

        });

    }


    // ========================================
    // إعادة الحجز
    // ========================================

    function setupRebookButtons() {

        const rebookButtons =
            document.querySelectorAll(".rebook-btn");


        rebookButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const bookingNumber =
                    button.getAttribute("data-number");


                const booking =
                    bookings.find(function (item) {

                        return (
                            item.bookingNumber === bookingNumber
                        );

                    });


                if (!booking) {
                    return;
                }


                // مهم:
                // إعادة الحجز = حجز جديد
                // لذلك نحذف وضع التعديل

                localStorage.removeItem(
                    "editingBookingNumber"
                );


                // حفظ الخدمة

                localStorage.setItem(
                    "selectedServiceName",
                    booking.service
                );


                localStorage.setItem(
                    "selectedServicePrice",
                    booking.price
                );


                // حفظ الموظفة

                localStorage.setItem(
                    "selectedStaff",
                    booking.staff
                );


                // نطلب موعد جديد

                localStorage.removeItem("selectedDate");

                localStorage.removeItem("selectedTime");


                // الانتقال لصفحة الموعد

                window.location.href = "datetime.html";

            });

        });

    }


    // ========================================
    // إلغاء الحجز
    // ========================================

    function setupCancelButtons() {

        const cancelButtons =
            document.querySelectorAll(".cancel-booking-btn");


        cancelButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const bookingNumber =
                    button.getAttribute("data-number");


                const confirmCancel =
                    confirm(
                        "هل أنتِ متأكدة من إلغاء الحجز؟"
                    );


                if (!confirmCancel) {
                    return;
                }


                bookings =
                    bookings.map(function (booking) {

                        if (
                            booking.bookingNumber ===
                            bookingNumber
                        ) {

                            booking.status = "ملغي";

                        }

                        return booking;

                    });


                // حفظ التعديل

                localStorage.setItem(
                    "bookings",
                    JSON.stringify(bookings)
                );


                // تحديث القائمة

                displayBookings("upcoming");

            });

        });

    }


    // ========================================
    // التبويبات
    // ========================================

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            tabs.forEach(function (item) {

                item.classList.remove("active");

            });


            tab.classList.add("active");


            const filter =
                tab.getAttribute("data-filter");


            displayBookings(filter);

        });

    });


    // ========================================
    // عرض الحجوزات القادمة أولاً
    // ========================================

    displayBookings("upcoming");

});