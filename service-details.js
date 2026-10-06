document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // القسم المختار
    // =====================================================

    const params = new URLSearchParams(window.location.search);

    const categoryFromUrl =
        params.get("service") ||
        params.get("category");

    const categoryFromStorage =
        localStorage.getItem("selectedService");

    const selectedCategory =
        categoryFromUrl ||
        categoryFromStorage ||
        "الشعر";

    if (categoryFromUrl) {
        localStorage.setItem(
            "selectedService",
            categoryFromUrl
        );
    }


    // =====================================================
    // عناصر الصفحة
    // =====================================================

    const categoryTitle =
        document.getElementById("categoryTitle");

    const servicesList =
        document.getElementById("servicesList");


    if (categoryTitle) {
        categoryTitle.textContent = selectedCategory;
    }


    // =====================================================
    // الخدمات الأساسية
    // =====================================================

    const defaultServices = [

        // =========================
        // الشعر
        // =========================

        {
            id: "hair-cut",
            name: "قص الشعر",
            category: "الشعر",
            price: 80,
            duration: 45,
            status: "active",
            description: "قص وتنسيق الشعر باحترافية"
        },

        {
            id: "hair-style",
            name: "استشوار وتصفيف",
            category: "الشعر",
            price: 70,
            duration: 45,
            status: "active",
            description: "تصفيف أنيق يناسب إطلالتك"
        },

        {
            id: "hair-color",
            name: "صبغة شعر",
            category: "الشعر",
            price: 250,
            duration: 120,
            status: "active",
            description: "صبغة شعر احترافية بلون يناسب إطلالتك"
        },


        // =========================
        // الأظافر
        // =========================

        {
            id: "manicure",
            name: "مانيكير",
            category: "الأظافر",
            price: 80,
            duration: 45,
            status: "active",
            description: "عناية وتنظيف وتجميل الأظافر"
        },

        {
            id: "pedicure",
            name: "بديكير",
            category: "الأظافر",
            price: 100,
            duration: 60,
            status: "active",
            description: "عناية متكاملة بالقدمين والأظافر"
        },


        // =========================
        // البشرة
        // =========================

        {
            id: "facial-cleaning",
            name: "تنظيف البشرة",
            category: "البشرة",
            price: 150,
            duration: 60,
            status: "active",
            description: "تنظيف وعناية متكاملة بالبشرة"
        },

        {
            id: "facial-glow",
            name: "جلسة نضارة",
            category: "البشرة",
            price: 180,
            duration: 60,
            status: "active",
            description: "جلسة تمنح البشرة إشراقة ونضارة"
        },


        // =========================
        // المكياج
        // =========================

        {
            id: "soft-makeup",
            name: "مكياج ناعم",
            category: "المكياج",
            price: 180,
            duration: 60,
            status: "active",
            description: "مكياج ناعم وأنيق لإطلالة طبيعية"
        },

        {
            id: "evening-makeup",
            name: "مكياج سهرة",
            category: "المكياج",
            price: 250,
            duration: 75,
            status: "active",
            description: "مكياج متكامل للمناسبات والسهرات"
        }

    ];


    // =====================================================
    // قراءة الخدمات من Local Storage
    // =====================================================

    function getAdminServices() {

        try {

            const saved =
                localStorage.getItem("lumiereServices");

            let parsed = [];


            if (saved) {

                parsed = JSON.parse(saved);

            }


            // إذا ما فيه بيانات
            // أو البيانات ليست Array
            // أو القائمة موجودة لكنها فاضية []

            if (
                !Array.isArray(parsed) ||
                parsed.length === 0
            ) {

                localStorage.setItem(
                    "lumiereServices",
                    JSON.stringify(defaultServices)
                );

                return [...defaultServices];
            }


            return parsed;

        } catch (error) {

            console.error(
                "خطأ في قراءة الخدمات:",
                error
            );


            localStorage.setItem(
                "lumiereServices",
                JSON.stringify(defaultServices)
            );


            return [...defaultServices];
        }
    }


    // =====================================================
    // التأكد من أن الخدمة نشطة
    // =====================================================

    function isServiceActive(service) {

        const status =
            String(
                service.status || "active"
            )
                .trim()
                .toLowerCase();


        return (
            status !== "inactive" &&
            status !== "غير نشطة" &&
            status !== "غير نشط" &&
            status !== "متوقفة" &&
            status !== "disabled"
        );
    }


    // =====================================================
    // توحيد أسماء الأقسام
    // =====================================================

    function normalizeCategory(value) {

        return String(value || "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
    }


    // =====================================================
    // قراءة جميع الخدمات
    // =====================================================

    const allServices =
        getAdminServices();


    // =====================================================
    // فلترة خدمات القسم المختار
    // =====================================================

    const currentServices =
        allServices.filter(function (service) {

            const serviceCategory =
                normalizeCategory(service.category);

            const currentCategory =
                normalizeCategory(selectedCategory);


            return (
                serviceCategory === currentCategory &&
                isServiceActive(service)
            );
        });


    // =====================================================
    // حماية النصوص
    // =====================================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value === undefined ||
            value === null
                ? ""
                : String(value);


        return div.innerHTML;
    }


    // =====================================================
    // تنسيق السعر
    // =====================================================

    function formatPrice(price) {

        const number =
            Number(price || 0);


        if (Number.isNaN(number)) {
            return "0";
        }


        return number.toLocaleString("en-US");
    }


    // =====================================================
    // قراءة المفضلة
    // =====================================================

    function getFavorites() {

        try {

            const saved =
                localStorage.getItem("favoriteServices");


            if (!saved) {
                return [];
            }


            const favorites =
                JSON.parse(saved);


            return Array.isArray(favorites)
                ? favorites
                : [];

        } catch (error) {

            console.error(
                "خطأ في قراءة المفضلة:",
                error
            );

            return [];
        }
    }


    // =====================================================
    // هل الخدمة موجودة في المفضلة؟
    // =====================================================

    function isFavorite(serviceName) {

        const favorites =
            getFavorites();


        return favorites.some(
            function (item) {

                return (
                    item.name === serviceName
                );
            }
        );
    }


    // =====================================================
    // إضافة / حذف المفضلة
    // =====================================================

    function toggleFavorite(service) {

        let favorites =
            getFavorites();


        const index =
            favorites.findIndex(
                function (item) {

                    return (
                        item.name === service.name
                    );
                }
            );


        if (index !== -1) {

            favorites.splice(index, 1);

        } else {

            favorites.push({

                id:
                    service.id || "",

                category:
                    service.category ||
                    selectedCategory,

                name:
                    service.name,

                price:
                    Number(service.price || 0),

                offer:
                    false

            });
        }


        localStorage.setItem(
            "favoriteServices",
            JSON.stringify(favorites)
        );
    }


    // =====================================================
    // إذا لم توجد خدمات
    // =====================================================

    function showEmptyState() {

        if (!servicesList) {
            return;
        }


        servicesList.innerHTML = `

            <div class="services-empty-state">

                <div class="services-empty-icon">

                    <i class="fa-solid fa-spa"></i>

                </div>


                <h3>
                    لا توجد خدمات متاحة حالياً
                </h3>


                <p>
                    لا توجد خدمات نشطة في قسم
                    ${escapeHTML(selectedCategory)}
                    حالياً
                </p>


                <a
                    href="booking.html"
                    class="services-empty-back"
                >

                    <i class="fa-solid fa-arrow-right"></i>

                    العودة للأقسام

                </a>

            </div>
        `;
    }


    // =====================================================
    // عرض الخدمات
    // =====================================================

    function renderServices() {

        if (!servicesList) {

            console.error(
                "عنصر servicesList غير موجود في الصفحة"
            );

            return;
        }


        servicesList.innerHTML = "";


        // إذا القسم لا يحتوي خدمات

        if (currentServices.length === 0) {

            showEmptyState();

            return;
        }


        currentServices.forEach(
            function (service) {

                const serviceName =
                    service.name ||
                    "خدمة LUMIÈRE";


                const description =
                    service.description ||
                    "خدمة مميزة من LUMIÈRE";


                const price =
                    Number(service.price || 0);


                const duration =
                    Number(service.duration || 0);


                const serviceCard =
                    document.createElement("div");


                serviceCard.className =
                    "service-item";


                // =========================================
                // حالة المفضلة
                // =========================================

                const favorite =
                    isFavorite(serviceName);


                const favoriteIconClass =
                    favorite
                        ? "fa-solid"
                        : "fa-regular";


                const favoriteActiveClass =
                    favorite
                        ? "active"
                        : "";


                // =========================================
                // بطاقة الخدمة
                // =========================================

                serviceCard.innerHTML = `

                    <button
                        type="button"
                        class="service-favorite-btn ${favoriteActiveClass}"
                        aria-label="إضافة إلى المفضلة"
                    >

                        <i class="${favoriteIconClass} fa-heart"></i>

                    </button>


                    <div class="service-item-info">

                        <h3>
                            ${escapeHTML(serviceName)}
                        </h3>


                        <p>
                            ${escapeHTML(description)}
                        </p>


                        ${
                            duration > 0
                                ? `
                                    <span class="service-duration">
                                        <i class="fa-regular fa-clock"></i>
                                        ${duration} دقيقة
                                    </span>
                                `
                                : ""
                        }


                        <strong class="service-normal-price">

                            ${formatPrice(price)}
                            ر.س

                        </strong>

                    </div>


                    <button
                        type="button"
                        class="select-service-btn"
                    >

                        اختاري

                    </button>
                `;


                // =========================================
                // زر المفضلة
                // =========================================

                const favoriteButton =
                    serviceCard.querySelector(
                        ".service-favorite-btn"
                    );


                const favoriteIcon =
                    favoriteButton.querySelector("i");


                favoriteButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        toggleFavorite(service);


                        if (isFavorite(serviceName)) {

                            favoriteIcon.classList.remove(
                                "fa-regular"
                            );

                            favoriteIcon.classList.add(
                                "fa-solid"
                            );

                            favoriteButton.classList.add(
                                "active"
                            );

                        } else {

                            favoriteIcon.classList.remove(
                                "fa-solid"
                            );

                            favoriteIcon.classList.add(
                                "fa-regular"
                            );

                            favoriteButton.classList.remove(
                                "active"
                            );
                        }
                    }
                );


                // =========================================
                // اختيار الخدمة
                // =========================================

                const selectButton =
                    serviceCard.querySelector(
                        ".select-service-btn"
                    );


                selectButton.addEventListener(
                    "click",
                    function () {

                        // القسم

                        localStorage.setItem(
                            "selectedService",
                            service.category ||
                            selectedCategory
                        );


                        // اسم الخدمة

                        localStorage.setItem(
                            "selectedServiceName",
                            serviceName
                        );


                        // السعر

                        localStorage.setItem(
                            "selectedServicePrice",
                            String(price)
                        );


                        // مدة الخدمة

                        localStorage.setItem(
                            "selectedServiceDuration",
                            String(duration)
                        );


                        // ID الخدمة

                        if (service.id) {

                            localStorage.setItem(
                                "selectedServiceId",
                                String(service.id)
                            );

                        } else {

                            localStorage.removeItem(
                                "selectedServiceId"
                            );
                        }


                        // الخدمة ليست عرضاً

                        localStorage.removeItem(
                            "selectedOffer"
                        );

                        localStorage.removeItem(
                            "selectedOfferId"
                        );

                        localStorage.removeItem(
                            "selectedOfferName"
                        );

                        localStorage.removeItem(
                            "selectedOfferPrice"
                        );


                        // تنظيف الاختيارات القديمة

                        localStorage.removeItem(
                            "selectedStaff"
                        );

                        localStorage.removeItem(
                            "selectedStaffId"
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


                        // الانتقال لاختيار الموظفة

                        window.location.href =
                            "staff.html";
                    }
                );


                // =========================================
                // إضافة البطاقة
                // =========================================

                servicesList.appendChild(
                    serviceCard
                );
            }
        );
    }


    // =====================================================
    // تشغيل الصفحة
    // =====================================================

    renderServices();

});