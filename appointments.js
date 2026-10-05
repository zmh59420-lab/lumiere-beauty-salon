document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // عناصر الصفحة
    // ========================================

    const appointmentsList = document.getElementById("appointmentsList");
    const emptyAppointments = document.getElementById("emptyAppointments");
    const tabs = document.querySelectorAll(".appointment-tab");

    // ========================================
    // نافذة تفاصيل الحجز
    // ========================================

    const bookingDetailsModal = document.getElementById("bookingDetailsModal");
    const bookingDetailsOverlay = document.getElementById("bookingDetailsOverlay");
    const bookingDetailsClose = document.getElementById("bookingDetailsClose");
    const bookingDetailsDone = document.getElementById("bookingDetailsDone");

    const detailsService = document.getElementById("detailsService");
    const detailsNumber = document.getElementById("detailsNumber");
    const detailsStatus = document.getElementById("detailsStatus");
    const detailsStaff = document.getElementById("detailsStaff");
    const detailsDate = document.getElementById("detailsDate");
    const detailsTime = document.getElementById("detailsTime");
    const detailsPrice = document.getElementById("detailsPrice");
    const detailsNotes = document.getElementById("detailsNotes");
    const detailsRatingBox = document.getElementById("detailsRatingBox");
    const detailsRatingStars = document.getElementById("detailsRatingStars");
    const detailsReview = document.getElementById("detailsReview");

    // ========================================
    // نافذة إلغاء الحجز
    // ========================================

    const cancelModal = document.getElementById("cancelModal");
    const cancelModalOverlay = document.getElementById("cancelModalOverlay");
    const cancelModalBack = document.getElementById("cancelModalBack");
    const cancelModalConfirm = document.getElementById("cancelModalConfirm");
    const cancelSuccessToast = document.getElementById("cancelSuccessToast");

    let bookingToCancel = null;
    let currentFilter = "upcoming";
    let bookings = [];

    // ========================================
    // قراءة الحجوزات
    // ========================================

    try {
        bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    } catch (error) {
        bookings = [];
    }

    // ========================================
    // التاريخ
    // ========================================

    function getBookingDate(booking) {
        if (!booking.date) return null;

        return new Date(booking.date + "T00:00:00");
    }

    // ========================================
    // تحديث الحالات
    // ========================================

    function updateBookingStatuses() {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        bookings = bookings.map(function (booking) {

            const bookingDate = getBookingDate(booking);

            if (!bookingDate) {
                return booking;
            }

            if (
                bookingDate < today &&
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

    // ========================================
    // نجوم التقييم
    // ========================================

    function createRatingStars() {

        let starsHTML = "";

        for (let i = 1; i <= 5; i++) {

            starsHTML += `
                <button
                    type="button"
                    class="rating-star-btn"
                    data-value="${i}"
                    aria-label="${i} نجوم"
                >
                    <i class="fa-regular fa-star"></i>
                </button>
            `;
        }

        return starsHTML;
    }

    function createSavedStars(rating) {

        let starsHTML = "";

        for (let i = 1; i <= 5; i++) {

            if (i <= Number(rating)) {
                starsHTML += `<i class="fa-solid fa-star"></i>`;
            } else {
                starsHTML += `<i class="fa-regular fa-star"></i>`;
            }
        }

        return starsHTML;
    }

    // ========================================
    // قسم التقييم
    // ========================================

    function createRatingSection(booking) {

        if (booking.status === "ملغي") {
            return "";
        }

        if (booking.status !== "مكتمل") {
            return "";
        }

        // إذا سبق تقييم الخدمة

        if (booking.rating) {

            return `
                <div class="saved-rating-box">

                    <div class="saved-rating-title">

                        <div>
                            <span>تقييمك للخدمة</span>
                            <h3>شكراً لمشاركتنا رأيكِ</h3>
                        </div>

                        <div class="saved-rating-stars">
                            ${createSavedStars(booking.rating)}
                        </div>

                    </div>

                    ${
                        booking.review
                            ? `
                                <p class="saved-rating-review">
                                    ${booking.review}
                                </p>
                            `
                            : ""
                    }

                </div>
            `;
        }

        // إذا لم يتم التقييم

        return `
            <div
                class="appointment-rating"
                data-number="${booking.bookingNumber}"
            >

                <div class="rating-heading">

                    <div>
                        <span>كيف كانت تجربتك؟</span>
                        <h3>قيّمي الخدمة</h3>
                    </div>

                    <i class="fa-regular fa-heart"></i>

                </div>

                <div class="rating-stars">
                    ${createRatingStars()}
                </div>

                <textarea
                    class="rating-review-input"
                    rows="3"
                    maxlength="250"
                    placeholder="اكتبي رأيك عن الخدمة (اختياري)"
                ></textarea>

                <div class="rating-footer">

                    <span class="rating-message"></span>

                    <button
                        type="button"
                        class="submit-rating-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        <i class="fa-regular fa-paper-plane"></i>
                        إرسال التقييم
                    </button>

                </div>

            </div>
        `;
    }

    // ========================================
    // فتح تفاصيل الحجز
    // ========================================

    function openBookingDetails(bookingNumber) {

        const booking = bookings.find(function (item) {
            return item.bookingNumber === bookingNumber;
        });

        if (!booking) {
            return;
        }

        detailsService.textContent =
            booking.service || "الخدمة";

        detailsNumber.textContent =
            booking.bookingNumber || "-";

        detailsStaff.textContent =
            booking.staff || "-";

        detailsDate.textContent =
            booking.date || "-";

        detailsTime.textContent =
            booking.time || "-";

        detailsPrice.textContent =
            booking.price || "0";

        detailsNotes.textContent =
            booking.notes || "لا توجد ملاحظات";

        // الحالة

        detailsStatus.textContent =
            booking.status || "-";

        detailsStatus.classList.remove(
            "confirmed",
            "completed",
            "cancelled"
        );

        if (booking.status === "مؤكد") {
            detailsStatus.classList.add("confirmed");
        }

        if (booking.status === "مكتمل") {
            detailsStatus.classList.add("completed");
        }

        if (booking.status === "ملغي") {
            detailsStatus.classList.add("cancelled");
        }

        // التقييم

        if (booking.rating) {

            detailsRatingBox.style.display = "block";

            detailsRatingStars.innerHTML =
                createSavedStars(booking.rating);

            detailsReview.textContent =
                booking.review ||
                "تم تقييم الخدمة بدون تعليق.";

        } else {

            detailsRatingBox.style.display = "none";
        }

        // فتح النافذة

        bookingDetailsModal.classList.add("show");

        document.body.style.overflow = "hidden";
    }

    // ========================================
    // إغلاق تفاصيل الحجز
    // ========================================

    function closeBookingDetails() {

        bookingDetailsModal.classList.remove("show");

        document.body.style.overflow = "";
    }

    if (bookingDetailsClose) {
        bookingDetailsClose.addEventListener(
            "click",
            closeBookingDetails
        );
    }

    if (bookingDetailsDone) {
        bookingDetailsDone.addEventListener(
            "click",
            closeBookingDetails
        );
    }

    if (bookingDetailsOverlay) {
        bookingDetailsOverlay.addEventListener(
            "click",
            closeBookingDetails
        );
    }

    // ========================================
    // عرض الحجوزات
    // ========================================

    function displayBookings(filter) {

        currentFilter = filter;

        updateBookingStatuses();

        appointmentsList.innerHTML = "";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filteredBookings =
            bookings.filter(function (booking) {

                const bookingDate =
                    getBookingDate(booking);

                if (!bookingDate) {
                    return false;
                }

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
        // إذا مافي حجوزات
        // ========================================

        if (filteredBookings.length === 0) {

            emptyAppointments.style.display =
                "block";

            return;
        }

        emptyAppointments.style.display =
            "none";

        // ========================================
        // إنشاء البطاقات
        // ========================================

        filteredBookings.forEach(function (booking) {

            const card =
                document.createElement("div");

            card.className =
                "appointment-card";

            let statusClass = "";

            if (booking.status === "مكتمل") {
                statusClass = "completed";
            }

            if (booking.status === "ملغي") {
                statusClass = "cancelled";
            }

            // ========================================
            // الأزرار
            // ========================================

            let actionsHTML = "";

            if (booking.status === "مؤكد") {

                actionsHTML = `

                    <button
                        type="button"
                        class="booking-details-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        <i class="fa-regular fa-eye"></i>
                        تفاصيل الحجز
                    </button>

                    <button
                        type="button"
                        class="edit-booking-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        <i class="fa-regular fa-calendar"></i>
                        تعديل الموعد
                    </button>

                    <button
                        type="button"
                        class="rebook-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        <i class="fa-solid fa-rotate-right"></i>
                        إعادة الحجز
                    </button>

                    <button
                        type="button"
                        class="cancel-booking-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        إلغاء الحجز
                    </button>
                `;

            } else {

                actionsHTML = `

                    <button
                        type="button"
                        class="booking-details-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        <i class="fa-regular fa-eye"></i>
                        تفاصيل الحجز
                    </button>

                    <button
                        type="button"
                        class="rebook-btn"
                        data-number="${booking.bookingNumber}"
                    >
                        <i class="fa-solid fa-rotate-right"></i>
                        إعادة الحجز
                    </button>
                `;
            }

            // ========================================
            // محتوى بطاقة الحجز
            // ========================================

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

                    <span
                        class="appointment-status ${statusClass}"
                    >
                        ${booking.status}
                    </span>

                </div>


                <div class="appointment-details">

                    <div>
                        <i class="fa-regular fa-user"></i>
                        <span>${booking.staff}</span>
                    </div>

                    <div>
                        <i class="fa-regular fa-calendar"></i>
                        <span>${booking.date}</span>
                    </div>

                    <div>
                        <i class="fa-regular fa-clock"></i>
                        <span>${booking.time}</span>
                    </div>

                </div>


                ${
                    booking.notes
                        ? `
                            <div class="appointment-notes">

                                <div class="appointment-notes-icon">
                                    <i class="fa-regular fa-message"></i>
                                </div>

                                <div>
                                    <strong>ملاحظتك</strong>
                                    <p>${booking.notes}</p>
                                </div>

                            </div>
                        `
                        : ""
                }


                <div class="appointment-bottom">

                    <div class="appointment-price">

                        <strong>
                            ${booking.price}
                        </strong>

                        <span>ر.س</span>

                    </div>


                    <div class="appointment-actions">

                        ${actionsHTML}

                    </div>

                </div>


                ${createRatingSection(booking)}
            `;

            appointmentsList.appendChild(card);
        });

        // مهم جداً
        // تشغيل الأزرار بعد إنشاء البطاقات

        setupDetailsButtons();
        setupEditButtons();
        setupRebookButtons();
        setupCancelButtons();
        setupRatingButtons();
    }

    // ========================================
    // زر تفاصيل الحجز
    // ========================================

    function setupDetailsButtons() {

        const buttons =
            document.querySelectorAll(
                ".booking-details-btn"
            );

        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const bookingNumber =
                        button.getAttribute(
                            "data-number"
                        );

                    openBookingDetails(
                        bookingNumber
                    );
                }
            );
        });
    }

    // ========================================
    // تعديل الموعد
    // ========================================

    function setupEditButtons() {

        const buttons =
            document.querySelectorAll(
                ".edit-booking-btn"
            );

        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const bookingNumber =
                        button.getAttribute(
                            "data-number"
                        );

                    const booking =
                        bookings.find(
                            function (item) {

                                return (
                                    item.bookingNumber ===
                                    bookingNumber
                                );
                            }
                        );

                    if (!booking) {
                        return;
                    }

                    localStorage.setItem(
                        "editingBookingNumber",
                        booking.bookingNumber
                    );

                    localStorage.setItem(
                        "selectedServiceName",
                        booking.service
                    );

                    localStorage.setItem(
                        "selectedServicePrice",
                        booking.price
                    );

                    localStorage.setItem(
                        "selectedStaff",
                        booking.staff
                    );

                    localStorage.removeItem(
                        "selectedDate"
                    );

                    localStorage.removeItem(
                        "selectedTime"
                    );

                    window.location.href =
                        "datetime.html";
                }
            );
        });
    }
       // ========================================
    // إعادة الحجز
    // ========================================

    function setupRebookButtons() {

        const buttons =
            document.querySelectorAll(
                ".rebook-btn"
            );

        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const bookingNumber =
                        button.getAttribute(
                            "data-number"
                        );

                    const booking =
                        bookings.find(
                            function (item) {

                                return (
                                    item.bookingNumber ===
                                    bookingNumber
                                );
                            }
                        );

                    if (!booking) {
                        return;
                    }

                    // هذا حجز جديد وليس تعديل

                    localStorage.removeItem(
                        "editingBookingNumber"
                    );

                    localStorage.setItem(
                        "selectedServiceName",
                        booking.service
                    );

                    localStorage.setItem(
                        "selectedServicePrice",
                        booking.price
                    );

                    localStorage.setItem(
                        "selectedStaff",
                        booking.staff
                    );

                    localStorage.removeItem(
                        "selectedDate"
                    );

                    localStorage.removeItem(
                        "selectedTime"
                    );

                    localStorage.removeItem(
                        "bookingNotes"
                    );

                    window.location.href =
                        "datetime.html";
                }
            );
        });
    }


    // ========================================
    // فتح نافذة إلغاء الحجز
    // ========================================

    function openCancelModal(bookingNumber) {

        bookingToCancel =
            bookingNumber;

        if (!cancelModal) {
            return;
        }

        cancelModal.classList.add(
            "show"
        );

        document.body.style.overflow =
            "hidden";
    }


    // ========================================
    // إغلاق نافذة إلغاء الحجز
    // ========================================

    function closeCancelModal() {

        if (!cancelModal) {
            return;
        }

        cancelModal.classList.remove(
            "show"
        );

        document.body.style.overflow =
            "";

        bookingToCancel = null;
    }


    // ========================================
    // تشغيل أزرار إلغاء الحجز
    // ========================================

    function setupCancelButtons() {

        const buttons =
            document.querySelectorAll(
                ".cancel-booking-btn"
            );

        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const bookingNumber =
                        button.getAttribute(
                            "data-number"
                        );

                    openCancelModal(
                        bookingNumber
                    );
                }
            );
        });
    }


    // ========================================
    // زر تراجعي
    // ========================================

    if (cancelModalBack) {

        cancelModalBack.addEventListener(
            "click",
            function () {

                closeCancelModal();
            }
        );
    }


    // ========================================
    // الضغط على خلفية نافذة الإلغاء
    // ========================================

    if (cancelModalOverlay) {

        cancelModalOverlay.addEventListener(
            "click",
            function () {

                closeCancelModal();
            }
        );
    }


    // ========================================
    // تأكيد إلغاء الحجز
    // ========================================

    if (cancelModalConfirm) {

        cancelModalConfirm.addEventListener(
            "click",
            function () {

                if (!bookingToCancel) {
                    return;
                }

                const cancelledNumber =
                    bookingToCancel;

                bookings =
                    bookings.map(
                        function (booking) {

                            if (
                                booking.bookingNumber ===
                                cancelledNumber
                            ) {

                                booking.status =
                                    "ملغي";
                            }

                            return booking;
                        }
                    );

                localStorage.setItem(
                    "bookings",
                    JSON.stringify(bookings)
                );

                closeCancelModal();

                displayBookings(
                    currentFilter
                );

                // رسالة نجاح الإلغاء

                if (cancelSuccessToast) {

                    cancelSuccessToast.classList.add(
                        "show"
                    );

                    setTimeout(
                        function () {

                            cancelSuccessToast.classList.remove(
                                "show"
                            );

                        },
                        3000
                    );
                }
            }
        );
    }


    // ========================================
    // التقييم
    // ========================================

    function setupRatingButtons() {

        const ratingBoxes =
            document.querySelectorAll(
                ".appointment-rating"
            );

        ratingBoxes.forEach(
            function (ratingBox) {

                const bookingNumber =
                    ratingBox.getAttribute(
                        "data-number"
                    );

                const starButtons =
                    ratingBox.querySelectorAll(
                        ".rating-star-btn"
                    );

                const reviewInput =
                    ratingBox.querySelector(
                        ".rating-review-input"
                    );

                const submitButton =
                    ratingBox.querySelector(
                        ".submit-rating-btn"
                    );

                const message =
                    ratingBox.querySelector(
                        ".rating-message"
                    );

                let selectedRating = 0;


                // ========================================
                // اختيار النجوم
                // ========================================

                starButtons.forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                selectedRating =
                                    Number(
                                        button.getAttribute(
                                            "data-value"
                                        )
                                    );

                                starButtons.forEach(
                                    function (starButton) {

                                        const value =
                                            Number(
                                                starButton.getAttribute(
                                                    "data-value"
                                                )
                                            );

                                        const icon =
                                            starButton.querySelector(
                                                "i"
                                            );

                                        if (
                                            value <=
                                            selectedRating
                                        ) {

                                            icon.classList.remove(
                                                "fa-regular"
                                            );

                                            icon.classList.add(
                                                "fa-solid"
                                            );

                                            starButton.classList.add(
                                                "selected"
                                            );

                                        } else {

                                            icon.classList.remove(
                                                "fa-solid"
                                            );

                                            icon.classList.add(
                                                "fa-regular"
                                            );

                                            starButton.classList.remove(
                                                "selected"
                                            );
                                        }
                                    }
                                );

                                if (message) {
                                    message.textContent = "";
                                }
                            }
                        );
                    }
                );


                // ========================================
                // إرسال التقييم
                // ========================================

                if (submitButton) {

                    submitButton.addEventListener(
                        "click",
                        function () {

                            if (
                                selectedRating === 0
                            ) {

                                if (message) {

                                    message.textContent =
                                        "اختاري عدد النجوم أولاً";
                                }

                                return;
                            }

                            const review =
                                reviewInput
                                    ? reviewInput.value.trim()
                                    : "";

                            bookings =
                                bookings.map(
                                    function (booking) {

                                        if (
                                            booking.bookingNumber ===
                                            bookingNumber
                                        ) {

                                            booking.rating =
                                                selectedRating;

                                            booking.review =
                                                review;
                                        }

                                        return booking;
                                    }
                                );

                            localStorage.setItem(
                                "bookings",
                                JSON.stringify(bookings)
                            );

                            displayBookings(
                                currentFilter
                            );
                        }
                    );
                }
            }
        );
    }


    // ========================================
    // زر ESC لإغلاق النوافذ
    // ========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            // تفاصيل الحجز

            if (
                bookingDetailsModal &&
                bookingDetailsModal.classList.contains(
                    "show"
                )
            ) {

                closeBookingDetails();
            }

            // إلغاء الحجز

            if (
                cancelModal &&
                cancelModal.classList.contains(
                    "show"
                )
            ) {

                closeCancelModal();
            }
        }
    );


    // ========================================
    // تبويبات القادمة / السابقة
    // ========================================

    tabs.forEach(function (tab) {

        tab.addEventListener(
            "click",
            function () {

                tabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );
                    }
                );

                tab.classList.add(
                    "active"
                );

                const filter =
                    tab.getAttribute(
                        "data-filter"
                    );

                displayBookings(
                    filter
                );
            }
        );
    });


    // ========================================
    // تشغيل الصفحة
    // ========================================

    updateBookingStatuses();

    displayBookings(
        "upcoming"
    );

}); 