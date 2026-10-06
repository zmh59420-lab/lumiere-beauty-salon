document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const staffList =
        document.getElementById(
            "customerStaffList"
        );

    const emptyState =
        document.getElementById(
            "customerStaffEmpty"
        );

    const serviceNameElement =
        document.getElementById(
            "selectedServiceName"
        );

    const servicePriceElement =
        document.getElementById(
            "selectedServicePrice"
        );


    // ==========================================
    // SELECTED SERVICE
    // ==========================================

    const serviceName =
        localStorage.getItem(
            "selectedServiceName"
        );

    const servicePrice =
        localStorage.getItem(
            "selectedServicePrice"
        );


    if (serviceNameElement) {

        serviceNameElement.textContent =
            serviceName ||
            "الخدمة المختارة";
    }


    if (servicePriceElement) {

        if (servicePrice) {

            servicePriceElement.textContent =
                servicePrice +
                " ر.س";

        } else {

            servicePriceElement.textContent =
                "";
        }
    }


    // ==========================================
    // DEFAULT STAFF
    // ==========================================

    const defaultStaff = [

        {
            id: "staff-1",
            name: "سارة",
            specialty: "الشعر",
            phone: "",
            status: "active"
        },

        {
            id: "staff-2",
            name: "نورة",
            specialty: "متعددة التخصصات",
            phone: "",
            status: "active"
        },

        {
            id: "staff-3",
            name: "ريم",
            specialty: "الأظافر",
            phone: "",
            status: "active"
        },

        {
            id: "staff-4",
            name: "ليان",
            specialty: "البشرة",
            phone: "",
            status: "active"
        }

    ];


    // ==========================================
    // LOAD STAFF
    // ==========================================

    function loadStaff() {

        try {

            const saved =
                localStorage.getItem(
                    "lumiereStaff"
                );


            let parsed = [];


            if (saved) {

                parsed =
                    JSON.parse(
                        saved
                    );
            }


            if (
                !Array.isArray(parsed) ||
                parsed.length === 0
            ) {

                localStorage.setItem(
                    "lumiereStaff",
                    JSON.stringify(
                        defaultStaff
                    )
                );


                return defaultStaff.map(
                    function (staff) {

                        return {
                            ...staff
                        };
                    }
                );
            }


            return parsed;

        } catch (error) {

            console.error(
                "خطأ في قراءة الموظفات:",
                error
            );


            localStorage.setItem(
                "lumiereStaff",
                JSON.stringify(
                    defaultStaff
                )
            );


            return defaultStaff.map(
                function (staff) {

                    return {
                        ...staff
                    };
                }
            );
        }
    }


    // ==========================================
    // ESCAPE
    // ==========================================

    function escapeHTML(value) {

        const element =
            document.createElement(
                "div"
            );


        element.textContent =
            value === undefined ||
            value === null
                ? ""
                : String(value);


        return element.innerHTML;
    }


    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    function isStaffActive(staff) {

        const status =
            String(
                staff.status ||
                "active"
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


    // ==========================================
    // SPECIALTY DISPLAY
    // ==========================================

    function getSpecialtyText(
        specialty
    ) {

        const value =
            String(
                specialty || ""
            ).trim();


        if (
            value === "الشعر"
        ) {

            return "أخصائية شعر";
        }


        if (
            value === "الأظافر"
        ) {

            return "أخصائية أظافر";
        }


        if (
            value === "البشرة"
        ) {

            return "أخصائية بشرة";
        }


        if (
            value === "المكياج"
        ) {

            return "أخصائية مكياج";
        }


        if (
            value ===
            "متعددة التخصصات"
        ) {

            return "أخصائية تجميل";
        }


        return (
            value ||
            "أخصائية تجميل"
        );
    }


    // ==========================================
    // RENDER STAFF
    // ==========================================

    function renderStaff() {

        if (!staffList) {

            console.error(
                "customerStaffList غير موجود في staff.html"
            );

            return;
        }


        const allStaff =
            loadStaff();


        let activeStaff =
            allStaff.filter(
                isStaffActive
            );


        // حماية إضافية:
        // إذا كانت كل البيانات القديمة متوقفة
        // نظهر رسالة بدل الصفحة الفاضية

        staffList.innerHTML =
            "";


        if (
            activeStaff.length === 0
        ) {

            staffList.style.display =
                "none";


            if (emptyState) {

                emptyState.style.display =
                    "block";
            }


            return;
        }


        staffList.style.display =
            "";


        if (emptyState) {

            emptyState.style.display =
                "none";
        }


        activeStaff.forEach(
            function (staff) {

                const name =
                    staff.name ||
                    "موظفة LUMIÈRE";


                const specialty =
                    getSpecialtyText(
                        staff.specialty
                    );


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


                        // حفظ ID الموظفة

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


                        // حذف موعد سابق

                        localStorage.removeItem(
                            "selectedDate"
                        );

                        localStorage.removeItem(
                            "selectedTime"
                        );


                        // الانتقال للتاريخ والوقت

                        setTimeout(
                            function () {

                                window.location.href =
                                    "datetime.html";

                            },
                            150
                        );
                    }
                );


                staffList.appendChild(
                    card
                );
            }
        );
    }


    // ==========================================
    // START
    // ==========================================

    renderStaff();

});