document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // جلب بيانات الحجز
    // =========================

    const bookingNumber =
        localStorage.getItem("currentBookingNumber");

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


    // =========================
    // عرض رقم الحجز
    // =========================

    const bookingNumberElement =
        document.getElementById("bookingNumber");

    if (bookingNumberElement) {
        bookingNumberElement.textContent =
            bookingNumber || "-";
    }


    // =========================
    // عرض الخدمة
    // =========================

    const serviceElement =
        document.getElementById("successService");

    if (serviceElement) {
        serviceElement.textContent =
            serviceName || "-";
    }


    // =========================
    // عرض الموظفة
    // =========================

    const staffElement =
        document.getElementById("successStaff");

    if (staffElement) {
        staffElement.textContent =
            staffName || "-";
    }


    // =========================
    // عرض التاريخ
    // =========================

    const dateElement =
        document.getElementById("successDate");

    if (dateElement) {
        dateElement.textContent =
            selectedDate || "-";
    }


    // =========================
    // عرض الوقت
    // =========================

    const timeElement =
        document.getElementById("successTime");

    if (timeElement) {
        timeElement.textContent =
            selectedTime || "-";
    }


    // =========================
    // عرض السعر
    // =========================

    const priceElement =
        document.getElementById("successPrice");

    if (priceElement) {
        priceElement.textContent =
            servicePrice || "0";
    }

});