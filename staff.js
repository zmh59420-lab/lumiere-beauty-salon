document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const staffList =
        document.getElementById("customerStaffList");

    const emptyState =
        document.getElementById("customerStaffEmpty");

    const serviceNameElement =
        document.getElementById("selectedServiceName");

    const servicePriceElement =
        document.getElementById("selectedServicePrice");


    // =====================================================
    // SERVICE INFO
    // =====================================================

    const serviceName =
        localStorage.getItem("selectedServiceName");

    const servicePrice =
        localStorage.getItem("selectedServicePrice");


    if (serviceNameElement) {

        serviceNameElement.textContent =
            serviceName ||
            "لم يتم اختيار خدمة";
    }


    if (servicePriceElement) {

        if (servicePrice) {

            servicePriceElement.textContent =
                servicePrice + " ر.س";

        } else {

            servicePriceElement.textContent = "";
        }
    }


    // =====================================================
    // LOAD STAFF
    // =====================================================

    function loadStaff() {

        try {

            const saved =
                localStorage.getItem("lumiereStaff");


            if (saved === null) {

                return [];
            }


            const parsed =
                JSON.parse(saved);


            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "خطأ في قراءة الموظفات:",
                error
            );

            return [];
        }
    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        const element =
            document.createElement("div");


        element.textContent =
            value === undefined ||
            value === null
                ? ""
                : String(value);


        return element.innerHTML;
    }


    // =====================================================
    // STAFF STATUS
    // =====================================================

    function isStaffActive(staff) {

        /*
            ندعم أكثر من شكل للحالة
            حتى لو كانت البيانات قديمة
        */

        const status =
            String(
                staff.status || "active"
            ).toLowerCase();


        return (
            status !== "inactive" &&
            status !== "متوقفة" &&
            status !== "غير نشطة"
        );
    }


    // =====================================================
    // RENDER STAFF
    // =====================================================

    function renderStaff() {

        if (!staffList) {
            return;
        }


        const allStaff =
            loadStaff();


        const activeStaff =
            allStaff.filter(
                isStaffActive
            );


        // تنظيف القائمة
        staffList.innerHTML = "";


        // =========================================
        // NO STAFF
        // =========================================

        if (activeStaff.length === 0) {

            staffList.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "block";
            }


            return;
        }


        // =========================================
        // SHOW LIST
        // =========================================

        staffList.style.display = "";


        if (emptyState) {

            emptyState.style.display =
                "none";
        }


        // =========================================
        // CREATE STAFF CARDS
        // =========================================

        activeStaff.forEach(
            function (staff) {

                const name =
                    staff.name ||
                    "موظفة LUMIÈRE";


                const specialty =
                    staff.specialty ||
                    "أخصائية تجميل";


                const staffId =
                    staff.id || "";


                const card =
                    document.createElement(
                        "button"
                    );


                card.type =
                    "button";


                card.className =
                    "staff-card";


                card.setAttribute(
                    "data-staff",
                    name
                );


                card.setAttribute(
                    "data-staff-id",
                    staffId
                );


                card.innerHTML = `

                    <div class="staff-avatar">

                        <i class="fa-regular fa-user"></i>

                    </div>


                    <div class="staff-info">

                        <h3>
                            ${escapeHTML(name)}
                        </h3>

                        <span>
                            ${escapeHTML(specialty)}
                        </span>

                    </div>


                    <i class="fa-solid fa-chevron-left"></i>

                `;


                // =================================
                // CLICK STAFF
                // =================================

                card.addEventListener(
                    "click",
                    function () {

                        const allCards =
                            staffList.querySelectorAll(
                                ".staff-card"
                            );


                        allCards.forEach(
                            function (item) {

                                item.classList.remove(
                                    "selected"
                                );
                            }
                        );


                        card.classList.add(
                            "selected"
                        );


                        // حفظ اسم الموظفة
                        localStorage.setItem(
                            "selectedStaff",
                            name
                        );


                        // حفظ ID
                        if (staffId) {

                            localStorage.setItem(
                                "selectedStaffId",
                                staffId
                            );

                        } else {

                            localStorage.removeItem(
                                "selectedStaffId"
                            );
                        }


                        // الانتقال للموعد
                        setTimeout(
                            function () {

                                window.location.href =
                                    "datetime.html";

                            },
                            250
                        );
                    }
                );


                staffList.appendChild(
                    card
                );
            }
        );
    }


    // =====================================================
    // START
    // =====================================================

    renderStaff();

});