document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // العناصر
    // =========================

    const dateInput = document.getElementById("bookingDate");
    const timeSlots = document.querySelectorAll(".time-slot");
    const continueButton = document.getElementById("continueBooking");

    const summaryService = document.getElementById("summaryService");
    const summaryStaff = document.getElementById("summaryStaff");


    // =========================
    // عرض تفاصيل الحجز
    // =========================

    const serviceName = localStorage.getItem("selectedServiceName");
    const servicePrice = localStorage.getItem("selectedServicePrice");
    const staffName = localStorage.getItem("selectedStaff");


    if (summaryService) {

        if (serviceName && servicePrice) {

            summaryService.textContent =
                serviceName + " — " + servicePrice + " ر.س";

        } else {

            summaryService.textContent = "لم يتم اختيار خدمة";

        }

    }


    if (summaryStaff) {

        if (staffName) {

            summaryStaff.textContent =
                "الموظفة: " + staffName;

        } else {

            summaryStaff.textContent =
                "لم يتم اختيار موظفة";

        }

    }


    // =========================
    // منع اختيار تاريخ سابق
    // =========================

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const todayDate =
        year + "-" + month + "-" + day;


    dateInput.min = todayDate;


    // =========================
    // التاريخ
    // =========================

    dateInput.addEventListener("change", function () {

        localStorage.setItem(
            "selectedDate",
            dateInput.value
        );

        checkBooking();

    });


    // =========================
    // الوقت
    // =========================

    timeSlots.forEach(function (slot) {

        slot.addEventListener("click", function () {

            // نشيل التحديد من كل الأوقات

            timeSlots.forEach(function (item) {

                item.classList.remove("selected");

            });


            // نحدد الوقت المختار

            slot.classList.add("selected");


            // نجيب الوقت

            const selectedTime =
                slot.getAttribute("data-time");


            // نحفظ الوقت

            localStorage.setItem(
                "selectedTime",
                selectedTime
            );


            // نفحص إذا اكتمل الحجز

            checkBooking();

        });

    });


    // =========================
    // تفعيل زر المتابعة
    // =========================

    function checkBooking() {

        const selectedDate =
            localStorage.getItem("selectedDate");

        const selectedTime =
            localStorage.getItem("selectedTime");


        if (selectedDate && selectedTime) {

            continueButton.disabled = false;

        } else {

            continueButton.disabled = true;

        }

    }


    // =========================
    // زر المتابعة
    // =========================

    continueButton.addEventListener("click", function () {

        const selectedDate =
            localStorage.getItem("selectedDate");

        const selectedTime =
            localStorage.getItem("selectedTime");


        if (!selectedDate || !selectedTime) {

            return;

        }


        window.location.href = "confirm.html";

    });


    // فحص أولي
    checkBooking();

});
/* ========================================
   أقرب موعد متاح
======================================== */

const nearestAppointmentBtn =
    document.getElementById("nearestAppointmentBtn");

const bookingDateInput =
    document.getElementById("bookingDate");


nearestAppointmentBtn.addEventListener("click", function () {

    /* تاريخ اليوم */

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");


    const todayFormatted =
        `${year}-${month}-${day}`;


    /* اختيار اليوم تلقائياً */

    bookingDateInput.value = todayFormatted;

    bookingDateInput.dispatchEvent(
        new Event("change")
    );


    /* جلب الأوقات المتاحة */

    const availableSlots =
        document.querySelectorAll(
            ".time-slot:not(:disabled)"
        );


    if (availableSlots.length === 0) {

        alert(
            "لا توجد مواعيد متاحة حالياً، اختاري يوماً آخر."
        );

        return;
    }


    /* إزالة أي اختيار سابق */

    document
        .querySelectorAll(".time-slot")
        .forEach(function (slot) {

            slot.classList.remove("selected");

        });


    /* اختيار أول موعد متاح */

    const nearestSlot = availableSlots[0];

    nearestSlot.click();


    /* النزول إلى الموعد المختار */

    nearestSlot.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});