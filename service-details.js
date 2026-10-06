document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // معرفة القسم المختار
    // =====================================================

    const params =
        new URLSearchParams(window.location.search);

    const categoryFromUrl =
        params.get("service");

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

        categoryTitle.textContent =
            selectedCategory;
    }


    // =====================================================
    // الخدمات الافتراضية
    // تظهر تلقائياً لأول زيارة على أي جهاز / رابط جديد
    // =====================================================

    const defaultServices = [

        {
            id: "service-hair-cut",
            name: "قص الشعر",
            category: "الشعر",
            price: 80,
            duration: 45,
            status: "active",
            description: "قص احترافي يناسب شكل الوجه وإطلالتك"
        },

        {
            id: "service-blowdry",
            name: "استشوار",
            category: "الشعر",
            price: 70,
            duration: 45,
            status: "active",
            description: "تصفيف ناعم وأنيق للشعر"
        },

        {
            id: "service-hair-color",
            name: "صبغة شعر",
            category: "الشعر",
            price: 250,
            duration: 120,
            status: "active",
            description: "صبغة احترافية بلون يناسب إطلالتك"
        },

        {
            id: "service-manicure",
            name: "مانيكير",
            category: "الأظافر",
            price: 80,
            duration: 45,
            status: "active",
            description: "عناية وتنظيف وتجميل الأظافر"
        },

        {
            id: "service-pedicure",
            name: "بديكير",
            category: "الأظافر",
            price: 100,
            duration: 60,
            status: "active",
            description: "عناية متكاملة بالقدمين والأظافر"
        },

        {
            id: "service-facial",
            name: "تنظيف البشرة",
            category: "البشرة",
            price: 150,
            duration: 60,
            status: "active",
            description: "تنظيف لطيف وعميق يمنح البشرة انتعاشاً"
        },

        {
            id: "service-glow",
            name: "جلسة نضارة",
            category: "البشرة",
            price: 180,
            duration: 60,
            status: "active",
            description: "جلسة عناية تمنح البشرة إشراقة ونضارة"
        },

        {
            id: "service-soft-makeup",
            name: "مكياج ناعم",
            category: "المكياج",
            price: 180,
            duration: 60,
            status: "active",
            description: "إطلالة ناعمة وأنيقة تناسب يومك"
        },

        {
            id: "service-evening-makeup",
            name: "مكياج سهرة",
            category: "المكياج",
            price: 250,
            duration: 75,
            status: "active",
            description: "مكياج متكامل لإطلالة أكثر فخامة"
        }

    ];


    // =====================================================
    // قراءة الخدمات
    // =====================================================

    function getAdminServices() {

        try {

            const saved =
                localStorage.getItem("lumiereServices");


            // أول زيارة للموقع
            if (saved === null) {

                localStorage.setItem(
                    "lumiereServices",
                    JSON.stringify(defaultServices)
                );

                return [...defaultServices];
            }


            const parsed =
                JSON.parse(saved);


            if (!Array.isArray(parsed)) {

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
    // هل الخدمة نشطة؟
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
            status !== "متوقفة"
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
    // جميع الخدمات
    // =====================================================

    const allServices =
        getAdminServices();


    // =====================================================
    // خدمات القسم المختار
    // =====================================================

    const currentServices =
        allServices.filter(function (service) {

            const sameCategory =
                normalizeCategory(service.category) ===
                normalizeCategory(selectedCategory);


            return (
                sameCategory &&
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
    // قراءة المفضلة
    // =====================================================

    function getFavorites() {

        try {

            const favorites =
                JSON.parse(
                    localStorage.getItem(
                        "favoriteServices"
                    )
                );


            return Array.isArray(favorites)
                ? favorites
                : [];

        } catch (error) {

            return [];
        }
    }


    // =====================================================
    // هل الخدمة بالمفضلة؟
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

            favorites.splice(
                index,
                1
            );

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
                    Number(
                        service.price || 0
                    ),

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
    // تنسيق السعر
    // =====================================================

    function formatPrice(price) {

        const number =
            Number(price || 0);


        if (Number.isNaN(number)) {

            return "0";
        }


        return number.toLocaleString(
            "en-US"
        );
    }


    // =====================================================
    // رسالة عدم وجود خدمات
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

            return;
        }


        servicesList.innerHTML = "";


        // لا توجد خدمات
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
                    Number(
                        service.price || 0
                    );


                const serviceCard =
                    document.createElement(
                        "div"
                    );


                serviceCard.className =
                    "service-item";


                // =================================================
                // المفضلة
                // =================================================

                const favorite =
                    isFavorite(serviceName);


                const favoriteClass =
                    favorite
                        ? "fa-solid"
                        : "fa-regular";


                const activeClass =
                    favorite
                        ? "active"
                        : "";


                // =================================================
                // تصميم الخدمة
                // =================================================

                serviceCard.innerHTML = `

                    <button
                        type="button"
                        class="service-favorite-btn ${activeClass}"
                        aria-label="المفضلة"
                    >

                        <i class="${favoriteClass} fa-heart"></i>

                    </button>


                    <div class="service-item-info">

                        <h3>
                            ${escapeHTML(serviceName)}
                        </h3>


                        <p>
                            ${escapeHTML(description)}
                        </p>


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


                // =================================================
                // زر المفضلة
                // =================================================

                const favoriteButton =
                    serviceCard.querySelector(
                        ".service-favorite-btn"
                    );


                const favoriteIcon =
                    favoriteButton.querySelector(
                        "i"
                    );


                favoriteButton.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        toggleFavorite(
                            service
                        );


                        if (
                            isFavorite(
                                serviceName
                            )
                        ) {

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


                // =================================================
                // اختيار الخدمة
                // =================================================

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


                        // ID الخدمة
                        if (service.id) {

                            localStorage.setItem(
                                "selectedServiceId",
                                service.id
                            );

                        } else {

                            localStorage.removeItem(
                                "selectedServiceId"
                            );
                        }


                        // ليست عرضاً
                        localStorage.removeItem(
                            "selectedOffer"
                        );

                        localStorage.removeItem(
                            "selectedOfferId"
                        );

                        localStorage.removeItem(
                            "selectedOfferName"
                        );


                        // تنظيف بيانات الحجز السابق
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