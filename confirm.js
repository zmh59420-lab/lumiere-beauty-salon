document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // بيانات الحجز الحالية
    // ========================================

    const serviceName =
        localStorage.getItem("selectedServiceName");

    const servicePrice =
        localStorage.getItem("selectedServicePrice");

    const staffName =
        localStorage.getItem("selectedStaff");

    const selectedDate =
        localStorage.getItem("selectedDate");

    const selectedTime =
        localStorage.getItem("selectedTime");


    // ========================================
    // هل نحن في وضع تعديل حجز؟
    // ========================================

    const editingBookingNumber =
        localStorage.getItem("editingBookingNumber");


    // ========================================
    // عناصر الصفحة
    // ========================================

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


    // ========================================
    // عرض بيانات الحجز
    // ========================================

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
        confirmPrice.textContent =
            servicePrice || "0";
    }


    // ========================================
    // جلب الحجوزات السابقة
    // ========================================

    let bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    // ========================================
    // إذا كان تعديل حجز
    // نعرض الملاحظة القديمة
    // ========================================

    if (editingBookingNumber) {

        const oldBooking =
            bookings.find(function (booking) {

                return (
                    booking.bookingNumber ===
                    editingBookingNumber
                );

            });


        if (oldBooking && bookingNotes) {

            bookingNotes.value =
                oldBooking.notes || "";

        }

    }


    // ========================================
    // عداد الملاحظات
    // ========================================

    function updateNotesCounter() {

        if (!bookingNotes || !notesCounter) {
            return;
        }


        const currentLength =
            bookingNotes.value.length;


        notesCounter.textContent =
            currentLength + " / 250";

    }


    if (bookingNotes) {

        bookingNotes.addEventListener(
            "input",
            updateNotesCounter
        );

    }


    updateNotesCounter();


    // ========================================
    // زر تأكيد الحجز
    // ========================================

    if (confirmButton) {

        // إذا كان تعديل نغير النص
        if (editingBookingNumber) {

            confirmButton.innerHTML = `
                حفظ تعديل الموعد
                <i class="fa-solid fa-check"></i>
            `;

        }


        confirmButton.addEventListener(
            "click",
            function () {


                // ========================================
                // الملاحظات
                // ========================================

                const notes =
                    bookingNotes
                    ? bookingNotes.value.trim()
                    : "";


                // ========================================
                // وضع تعديل الحجز
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

                        // نحافظ على رقم الحجز نفسه

                        bookings[bookingIndex].service =
                            serviceName || "";

                        bookings[bookingIndex].price =
                            servicePrice || "";

                        bookings[bookingIndex].staff =
                            staffName || "";

                        bookings[bookingIndex].date =
                            selectedDate || "";

                        bookings[bookingIndex].time =
                            selectedTime || "";

                        bookings[bookingIndex].notes =
                            notes;

                        bookings[bookingIndex].status =
                            "مؤكد";


                        // حفظ التعديل

                        localStorage.setItem(
                            "bookings",
                            JSON.stringify(bookings)
                        );


                        // نخلي صفحة النجاح تعرف
                        // أي حجز تعرض

                        localStorage.setItem(
                            "currentBookingNumber",
                            editingBookingNumber
                        );


                        // إنهاء وضع التعديل

                        localStorage.removeItem(
                            "editingBookingNumber"
                        );


                        // الانتقال لصفحة النجاح

                        window.location.href =
                            "success.html";

                        return;

                    }

                }


                // ========================================
                // حجز جديد
                // ========================================

                const bookingNumber =
                    "LUM-" +
                    Math.floor(
                        100000 +
                        Math.random() * 900000
                    );


                const booking = {

                    bookingNumber: bookingNumber,

                    service:
                        serviceName || "",

                    price:
                        servicePrice || "",

                    staff:
                        staffName || "",

                    date:
                        selectedDate || "",

                    time:
                        selectedTime || "",

                    notes:
                        notes,

                    status:
                        "مؤكد"

                };


                // إضافة الحجز

                bookings.push(booking);


                // حفظ الحجوزات

                localStorage.setItem(
                    "bookings",
                    JSON.stringify(bookings)
                );


                // حفظ رقم الحجز الحالي

                localStorage.setItem(
                    "currentBookingNumber",
                    bookingNumber
                );


                // تنظيف وضع التعديل احتياطياً

                localStorage.removeItem(
                    "editingBookingNumber"
                );


                // الانتقال لصفحة النجاح

                window.location.href =
                    "success.html";

            }
        );

    }

});