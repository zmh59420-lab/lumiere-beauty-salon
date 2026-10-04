document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // جميع أزرار احجزي العرض
    // =========================================

    const offerButtons =
        document.querySelectorAll(".offer-book-btn");


    offerButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            // =====================================
            // أخذ بيانات العرض من الزر
            // =====================================

            const category =
                button.getAttribute("data-category");

            const serviceName =
                button.getAttribute("data-service");

            const price =
                button.getAttribute("data-price");


            // =====================================
            // حفظ بيانات الخدمة
            // =====================================

            localStorage.setItem(
                "selectedService",
                category
            );

            localStorage.setItem(
                "selectedServiceName",
                serviceName
            );

            localStorage.setItem(
                "selectedServicePrice",
                price
            );


            // =====================================
            // نحدد أن الحجز من عرض
            // =====================================

            localStorage.setItem(
                "selectedOffer",
                "true"
            );


            // =====================================
            // حذف بيانات أي حجز سابق
            // حتى يبدأ الحجز الجديد بشكل صحيح
            // =====================================

            localStorage.removeItem(
                "selectedStaff"
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

            localStorage.removeItem(
                "editingBookingNumber"
            );


            // =====================================
            // الانتقال لاختيار الموظفة
            // =====================================

            window.location.href =
                "staff.html";

        });

    });

});