document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // القسم المختار
    // نقرأه أولاً من الرابط
    // وإذا غير موجود نقرأه من localStorage
    // ========================================

    const urlParams =
        new URLSearchParams(window.location.search);

    const categoryFromUrl =
        urlParams.get("service");

    const categoryFromStorage =
        localStorage.getItem("selectedService");

    const selectedCategory =
        categoryFromUrl || categoryFromStorage;


    // إذا القسم جاء من الرابط نحفظه أيضاً
    if (categoryFromUrl) {

        localStorage.setItem(
            "selectedService",
            categoryFromUrl
        );

    }


    const categoryTitle =
        document.getElementById("categoryTitle");

    const servicesList =
        document.getElementById("servicesList");


    // ========================================
    // الخدمات والأسعار
    // ========================================

    const services = {

        "الشعر": [

            {
                name: "قص الشعر",
                description: "قص وتنسيق الشعر",
                price: 80
            },

            {
                name: "استشوار",
                description: "تصفيف الشعر باحترافية",
                price: 70
            },

            {
                name: "صبغة شعر",
                description: "صبغة كاملة للشعر",
                price: 250
            },

            {
                name: "علاج الشعر",
                description: "جلسة عناية وترطيب للشعر",
                price: 150
            }

        ],


        "الأظافر": [

            {
                name: "مانيكير",
                description: "تنظيف وعناية بالأظافر",
                price: 70
            },

            {
                name: "بديكير",
                description: "عناية وتنظيف للقدمين",
                price: 90
            },

            {
                name: "مانيكير جل",
                description: "مانيكير مع طلاء جل",
                price: 120
            },

            {
                name: "تركيب أظافر",
                description: "تركيب وتنسيق الأظافر",
                price: 150
            }

        ],


        "البشرة": [

            {
                name: "تنظيف بشرة",
                description: "تنظيف وعناية بالبشرة",
                price: 150
            },

            {
                name: "هيدرافيشل",
                description: "تنظيف وترطيب عميق للبشرة",
                price: 300
            },

            {
                name: "جلسة نضارة",
                description: "عناية لإشراقة ونضارة البشرة",
                price: 250
            }

        ],


        "المكياج": [

            {
                name: "مكياج ناعم",
                description: "إطلالة ناعمة وطبيعية",
                price: 200
            },

            {
                name: "مكياج مناسبات",
                description: "مكياج متكامل للمناسبات",
                price: 300
            },

            {
                name: "مكياج عروس",
                description: "مكياج خاص للعروس",
                price: 700
            }

        ]

    };


    // ========================================
    // جلب المفضلة
    // ========================================

    let favorites =
        JSON.parse(
            localStorage.getItem("favoriteServices")
        ) || [];


    // ========================================
    // اسم القسم
    // ========================================

    if (categoryTitle) {

        categoryTitle.textContent =
            selectedCategory || "اختاري الخدمة";

    }


    // ========================================
    // إذا ما فيه قسم صحيح
    // ========================================

    if (
        !selectedCategory ||
        !services[selectedCategory]
    ) {

        servicesList.innerHTML = `

            <p class="no-services">
                لا توجد خدمات متاحة حالياً
            </p>

        `;

        return;

    }


    // ========================================
    // التحقق هل الخدمة مفضلة
    // ========================================

    function isFavorite(serviceName) {

        return favorites.some(function (item) {

            return item.name === serviceName;

        });

    }


    // ========================================
    // عرض الخدمات
    // ========================================

    services[selectedCategory].forEach(
        function (service) {

            const card =
                document.createElement("div");

            card.className =
                "detail-service-card";


            const favorite =
                isFavorite(service.name);


            card.innerHTML = `

                <button
                    type="button"
                    class="service-favorite-btn ${favorite ? "active" : ""}"
                    aria-label="إضافة للمفضلة"
                >

                    <i class="${
                        favorite
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                </button>


                <div class="detail-service-info">

                    <h3>
                        ${service.name}
                    </h3>

                    <p>
                        ${service.description}
                    </p>

                </div>


                <div class="detail-service-price">

                    <div>

                        <strong>
                            ${service.price}
                        </strong>

                        <span>
                            ر.س
                        </span>

                    </div>


                    <button
                        type="button"
                        class="select-service-btn"
                    >
                        اختيار
                    </button>

                </div>

            `;


            // ========================================
            // زر المفضلة
            // ========================================

            const favoriteButton =
                card.querySelector(
                    ".service-favorite-btn"
                );


            favoriteButton.addEventListener(
                "click",
                function () {

                    const favoriteIndex =
                        favorites.findIndex(
                            function (item) {

                                return (
                                    item.name ===
                                    service.name
                                );

                            }
                        );


                    // =================================
                    // إذا موجودة نحذفها
                    // =================================

                    if (favoriteIndex !== -1) {

                        favorites.splice(
                            favoriteIndex,
                            1
                        );


                        favoriteButton.classList.remove(
                            "active"
                        );


                        favoriteButton.innerHTML = `
                            <i class="fa-regular fa-heart"></i>
                        `;

                    }


                    // =================================
                    // إذا مو موجودة نضيفها
                    // =================================

                    else {

                        favorites.push({

                            name:
                                service.name,

                            description:
                                service.description,

                            price:
                                service.price,

                            category:
                                selectedCategory

                        });


                        favoriteButton.classList.add(
                            "active"
                        );


                        favoriteButton.innerHTML = `
                            <i class="fa-solid fa-heart"></i>
                        `;

                    }


                    // =================================
                    // حفظ المفضلة
                    // =================================

                    localStorage.setItem(

                        "favoriteServices",

                        JSON.stringify(
                            favorites
                        )

                    );

                }
            );


            // ========================================
            // زر اختيار الخدمة
            // ========================================

            const selectButton =
                card.querySelector(
                    ".select-service-btn"
                );


            selectButton.addEventListener(
                "click",
                function () {

                    // هذا حجز جديد
                    localStorage.removeItem(
                        "editingBookingNumber"
                    );


                    // حفظ القسم
                    localStorage.setItem(
                        "selectedService",
                        selectedCategory
                    );


                    // حفظ اسم الخدمة
                    localStorage.setItem(
                        "selectedServiceName",
                        service.name
                    );


                    // حفظ السعر
                    localStorage.setItem(
                        "selectedServicePrice",
                        service.price
                    );


                    // الانتقال لصفحة الموظفة
                    window.location.href =
                        "staff.html";

                }
            );


            servicesList.appendChild(card);

        }
    );

});