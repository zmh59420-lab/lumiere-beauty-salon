document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // عرض الخدمة المختارة
    // =========================

    const serviceName =
        localStorage.getItem("selectedServiceName");

    const servicePrice =
        localStorage.getItem("selectedServicePrice");

    const serviceNameElement =
        document.getElementById("selectedServiceName");

    const servicePriceElement =
        document.getElementById("selectedServicePrice");


    if (serviceNameElement) {
        serviceNameElement.textContent =
            serviceName || "لم يتم اختيار خدمة";
    }


    if (servicePriceElement) {

        if (servicePrice) {
            servicePriceElement.textContent =
                servicePrice + " ر.س";
        } else {
            servicePriceElement.textContent = "";
        }

    }


    // =========================
    // اختيار الموظفة
    // =========================

    const staffCards =
        document.querySelectorAll(".staff-card");


    staffCards.forEach(function (card) {

        card.addEventListener("click", function () {

            // إزالة التحديد من الجميع
            staffCards.forEach(function (item) {
                item.classList.remove("selected");
            });


            // تحديد الموظفة
            card.classList.add("selected");


            // معرفة اسم الموظفة
            const selectedStaff =
                card.getAttribute("data-staff");


            // حفظ اسم الموظفة
            localStorage.setItem(
                "selectedStaff",
                selectedStaff
            );


            // الانتقال لصفحة اختيار الموعد
            setTimeout(function () {

                window.location.href = "datetime.html";

            }, 250);

        });

    });

});