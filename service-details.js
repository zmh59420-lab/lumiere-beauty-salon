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
    // قراءة الخدمات من لوحة الإدارة
    // =====================================================

    function getAdminServices() {

        try {

            const saved =
                localStorage.getItem("lumiereServices");


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
                "خطأ في قراءة الخدمات:",
                error
            );

            return [];
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
    // مقارنة الأقسام
    // =====================================================

    function normalizeCategory(value) {

        return String(value || "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
    }


    // =====================================================
    // خدمات القسم الحالي
    // =====================================================

    const allServices =
        getAdminServices();


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
    // هل الخدمة في المفضلة؟
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


        // حذف من المفضلة
        if (index !== -1) {

            favorites.splice(
                index,
                1
            );

        } else {

            // إضافة للمفضلة

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
    // عرض رسالة عدم وجود خدمات
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


        // =============================================
        // لا توجد خدمات
        // =============================================

        if (currentServices.length === 0) {

            showEmptyState();

            return;
        }


        // =============================================
        // إنشاء الخدمات
        // =============================================

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


                // =====================================
                // المفضلة
                // =====================================

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


                // =====================================
                // محتوى الخدمة
                // =====================================

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


                // =====================================
                // زر المفضلة
                // =====================================

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


                // =====================================
                // اختيار الخدمة
                // =====================================

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


                        // هذه خدمة عادية وليست عرض
                        localStorage.removeItem(
                            "selectedOffer"
                        );

                        localStorage.removeItem(
                            "selectedOfferId"
                        );

                        localStorage.removeItem(
                            "selectedOfferName"
                        );


                        // تنظيف الحجز السابق
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
    // START
    // =====================================================

    renderServices();

});