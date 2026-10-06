document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // بيانات الحجز الحالية
    // =====================================================

    const serviceName =
        localStorage.getItem("selectedServiceName");

    const servicePrice =
        localStorage.getItem("selectedServicePrice");

    const serviceId =
        localStorage.getItem("selectedServiceId");

    const staffName =
        localStorage.getItem("selectedStaff");

    const staffId =
        localStorage.getItem("selectedStaffId");

    const selectedDate =
        localStorage.getItem("selectedDate");

    const selectedTime =
        localStorage.getItem("selectedTime");


    // =====================================================
    // هل نحن في وضع تعديل حجز؟
    // =====================================================

    const editingBookingNumber =
        localStorage.getItem("editingBookingNumber");


    // =====================================================
    // عناصر الصفحة
    // =====================================================

    const confirmService =
        document.getElementById("confirmService");

    const confirmStaff =
        document.getElementById("confirmStaff");

    const confirmDate =
        document.getElementById("confirmDate");

    const confirmTime =
        document.getElementById("confirmTime");

    const confirmPrice =
        document.getElementById("confirmPrice");

    const confirmButton =
        document.getElementById("confirmBookingBtn");

    const bookingNotes =
        document.getElementById("bookingNotes");

    const notesCounter =
        document.getElementById("notesCounter");


    // =====================================================
    // عرض بيانات الحجز
    // =====================================================

    if (confirmService) {
        confirmService.textContent =
            serviceName || "-";
    }

    if (confirmStaff) {
        confirmStaff.textContent =
            staffName || "-";
    }

    if (confirmDate) {
        confirmDate.textContent =
            selectedDate || "-";
    }

    if (confirmTime) {
        confirmTime.textContent =
            selectedTime || "-";
    }

    if (confirmPrice) {

        if (servicePrice) {

            confirmPrice.textContent =
                servicePrice + " ر.س";

        } else {

            confirmPrice.textContent =
                "0 ر.س";
        }
    }


    // =====================================================
    // جلب الحجوزات السابقة بأمان
    // =====================================================

    function loadBookings() {

        try {

            const saved =
                localStorage.getItem("bookings");

            if (!saved) {
                return [];
            }

            const parsed =
                JSON.parse(saved);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "خطأ في قراءة الحجوزات:",
                error
            );

            return [];
        }
    }


    let bookings =
        loadBookings();


    // =====================================================
    // إذا كان تعديل حجز
    // نعرض الملاحظة القديمة
    // =====================================================

    if (editingBookingNumber) {

        const oldBooking =
            bookings.find(
                function (booking) {

                    return (
                        booking.bookingNumber ===
                        editingBookingNumber
                    );
                }
            );


        if (oldBooking && bookingNotes) {

            bookingNotes.value =
                oldBooking.notes || "";
        }
    }


    // =====================================================
    // عداد الملاحظات
    // =====================================================

    function updateNotesCounter() {

        if (!bookingNotes || !notesCounter) {
            return;
        }


        // منع أكثر من 250 حرف
        if (bookingNotes.value.length > 250) {

            bookingNotes.value =
                bookingNotes.value.substring(
                    0,
                    250
                );
        }


        notesCounter.textContent =
            bookingNotes.value.length +
            " / 250";
    }


    if (bookingNotes) {

        bookingNotes.setAttribute(
            "maxlength",
            "250"
        );

        bookingNotes.addEventListener(
            "input",
            updateNotesCounter
        );
    }


    updateNotesCounter();


    // =====================================================
    // التحقق من اكتمال بيانات الحجز
    // =====================================================

    function validateBooking() {

        if (!serviceName) {

            alert(
                "يرجى اختيار الخدمة أولاً"
            );

            window.location.href =
                "booking.html";

            return false;
        }


        if (!staffName) {

            alert(
                "يرجى اختيار الموظفة أولاً"
            );

            window.location.href =
                "staff.html";

            return false;
        }


        if (!selectedDate) {

            alert(
                "يرجى اختيار تاريخ الموعد"
            );

            window.location.href =
                "datetime.html";

            return false;
        }


        if (!selectedTime) {

            alert(
                "يرجى اختيار وقت الموعد"
            );

            window.location.href =
                "datetime.html";

            return false;
        }


        return true;
    }


    // =====================================================
    // إنشاء رقم حجز غير مكرر
    // =====================================================

    function generateBookingNumber() {

        let bookingNumber;

        let exists = true;


        while (exists) {

            bookingNumber =
                "LUM-" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            exists =
                bookings.some(
                    function (booking) {

                        return (
                            booking.bookingNumber ===
                            bookingNumber
                        );
                    }
                );
        }


        return bookingNumber;
    }


    // =====================================================
    // زر تأكيد الحجز
    // =====================================================

    if (confirmButton) {

        // ================================================
        // إذا كان تعديل
        // ================================================

        if (editingBookingNumber) {

            confirmButton.innerHTML = `
                حفظ تعديل الموعد
                <i class="fa-solid fa-check"></i>
            `;
        }


        confirmButton.addEventListener(
            "click",
            function () {

                // منع الضغط مرتين بسرعة
                if (
                    confirmButton.dataset.processing ===
                    "true"
                ) {
                    return;
                }


                // ========================================
                // التحقق من البيانات
                // ========================================

                if (!validateBooking()) {
                    return;
                }


                confirmButton.dataset.processing =
                    "true";


                const oldButtonHTML =
                    confirmButton.innerHTML;


                confirmButton.disabled =
                    true;


                confirmButton.innerHTML = `
                    جاري تأكيد الحجز...
                    <i class="fa-solid fa-spinner fa-spin"></i>
                `;


                // ========================================
                // الملاحظات
                // ========================================

                const notes =
                    bookingNotes
                        ? bookingNotes.value
                            .trim()
                            .substring(0, 250)
                        : "";


                // ========================================
                // تعديل حجز موجود
                // ========================================

                if (editingBookingNumber) {

                    const bookingIndex =
                        bookings.findIndex(
                            function (booking) {

                                return (
                                    booking.bookingNumber ===
                                    editingBookingNumber
                                );
                            }
                        );


                    if (bookingIndex !== -1) {

                        bookings[bookingIndex] = {

                            ...bookings[bookingIndex],

                            service:
                                serviceName || "",

                            serviceId:
                                serviceId || "",

                            price:
                                servicePrice || "",

                            staff:
                                staffName || "",

                            staffId:
                                staffId || "",

                            date:
                                selectedDate || "",

                            time:
                                selectedTime || "",

                            notes:
                                notes,

                            status:
                                "مؤكد",

                            updatedAt:
                                new Date()
                                    .toISOString()

                        };


                        localStorage.setItem(
                            "bookings",
                            JSON.stringify(bookings)
                        );


                        localStorage.setItem(
                            "currentBookingNumber",
                            editingBookingNumber
                        );


                        localStorage.removeItem(
                            "editingBookingNumber"
                        );


                        window.location.href =
                            "success.html";

                        return;
                    }
                }


                // ========================================
                // إنشاء حجز جديد
                // ========================================

                const bookingNumber =
                    generateBookingNumber();


                const booking = {

                    bookingNumber:
                        bookingNumber,

                    service:
                        serviceName || "",

                    serviceId:
                        serviceId || "",

                    price:
                        servicePrice || "",

                    staff:
                        staffName || "",

                    staffId:
                        staffId || "",

                    date:
                        selectedDate || "",

                    time:
                        selectedTime || "",

                    notes:
                        notes,

                    status:
                        "مؤكد",

                    createdAt:
                        new Date()
                            .toISOString()

                };


                // ========================================
                // إضافة الحجز
                // ========================================

                bookings.push(
                    booking
                );


                // ========================================
                // حفظ الحجوزات
                // ========================================

                try {

                    localStorage.setItem(
                        "bookings",
                        JSON.stringify(bookings)
                    );


                    localStorage.setItem(
                        "currentBookingNumber",
                        bookingNumber
                    );


                    localStorage.removeItem(
                        "editingBookingNumber"
                    );


                    // ====================================
                    // الانتقال لصفحة نجاح الحجز
                    // ====================================

                    window.location.href =
                        "success.html";


                } catch (error) {

                    console.error(
                        "خطأ في حفظ الحجز:",
                        error
                    );


                    alert(
                        "حدث خطأ أثناء حفظ الحجز، حاولي مرة أخرى."
                    );


                    confirmButton.disabled =
                        false;


                    confirmButton.dataset.processing =
                        "false";


                    confirmButton.innerHTML =
                        oldButtonHTML;
                }

            }
        );
    }

});