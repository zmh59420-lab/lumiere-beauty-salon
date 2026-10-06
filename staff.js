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
            serviceName || "الخدمة المختارة";
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
    // DEFAULT STAFF
    // تظهر إذا Netlify ما عنده بيانات محفوظة
    // =====================================================

    const defaultStaff = [

        {
            id: "staff-1",
            name: "سارة",
            specialty: "أخصائية شعر",
            status: "active"
        },

        {
            id: "staff-2",
            name: "نورة",
            specialty: "أخصائية تجميل",
            status: "active"
        },

        {
            id: "staff-3",
            name: "ريم",
            specialty: "أخصائية أظافر",
            status: "active"
        },

        {
            id: "staff-4",
            name: "ليان",
            specialty: "أخصائية بشرة ومكياج",
            status: "active"
        }

    ];


    // =====================================================
    // LOAD STAFF
    // =====================================================

    function loadStaff() {

        try {

            const saved =
                localStorage.getItem("lumiereStaff");


            let parsed = [];


            if (saved) {

                parsed =
                    JSON.parse(saved);
            }


            // =============================================
            // إذا البيانات غير موجودة أو القائمة فاضية
            // نحفظ الموظفات الافتراضيات
            // =============================================

            if (
                !Array.isArray(parsed) ||
                parsed.length === 0
            ) {

                localStorage.setItem(
                    "lumiereStaff",
                    JSON.stringify(defaultStaff)
                );


                return [...defaultStaff];
            }


            return parsed;


        } catch (error) {

            console.error(
                "خطأ في قراءة الموظفات:",
                error
            );


            localStorage.setItem(
                "lumiereStaff",
                JSON.stringify(defaultStaff)
            );


            return [...defaultStaff];
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

        const status =
            String(
                staff.status || "active"
            )
                .trim()
                .toLowerCase();


        return (
            status !== "inactive" &&
            status !== "disabled" &&
            status !== "متوقفة" &&
            status !== "غير نشطة" &&
            status !== "غير نشط"
        );
    }


    // =====================================================
    // RENDER STAFF
    // =====================================================

    function renderStaff() {

        if (!staffList) {

            console.error(
                "customerStaffList غير موجود في staff.html"
            );

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


        // =================================================
        // NO STAFF
        // =================================================

        if (activeStaff.length === 0) {

            staffList.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "block";
            }


            return;
        }


        // =================================================
        // SHOW STAFF
        // =================================================

        staffList.style.display =
            "";


        if (emptyState) {

            emptyState.style.display =
                "none";
        }


        // =================================================
        // CREATE STAFF CARDS
        // =================================================

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


                // =========================================
                // CLICK STAFF
                // =========================================

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


                        // =================================
                        // SAVE STAFF NAME
                        // =================================

                        localStorage.setItem(
                            "selectedStaff",
                            name
                        );


                        // =================================
                        // SAVE STAFF ID
                        // =================================

                        if (staffId) {

                            localStorage.setItem(
                                "selectedStaffId",
                                String(staffId)
                            );

                        } else {

                            localStorage.removeItem(
                                "selectedStaffId"
                            );
                        }


                        // =================================
                        // CLEAN OLD DATE/TIME
                        // =================================

                        localStorage.removeItem(
                            "selectedDate"
                        );

                        localStorage.removeItem(
                            "selectedTime"
                        );


                        // =================================
                        // GO TO DATE & TIME
                        // =================================

                        setTimeout(
                            function () {

                                window.location.href =
                                    "datetime.html";

                            },
                            200
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