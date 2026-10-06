document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // زر احجزي موعدك الآن
    // ==================================================

    const bookingButton = document.querySelector(".main-btn");

    if (bookingButton) {
        bookingButton.addEventListener("click", function () {
            window.location.href = "booking.html";
        });
    }


    // ==================================================
    // زر اكتشفي العروض
    // ==================================================

    const offersBtn = document.getElementById("offersBtn");

    if (offersBtn) {
        offersBtn.addEventListener("click", function () {
            window.location.href = "offers.html";
        });
    }


    // ==================================================
    // الخدمات الأكثر طلباً
    // الضغط على الكرت = حجز الخدمة
    // ==================================================

    const popularCards =
        document.querySelectorAll(".popular-card[data-service]");


    popularCards.forEach(function (card) {

        card.style.cursor = "pointer";
        card.setAttribute("tabindex", "0");


        card.addEventListener("click", function () {

            const category =
                card.getAttribute("data-category");

            const serviceName =
                card.getAttribute("data-service");

            const price =
                card.getAttribute("data-price");

            const isOffer =
                card.getAttribute("data-offer");


            // حفظ الخدمة

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


            // هل الخدمة عليها عرض؟

            if (isOffer === "true") {

                localStorage.setItem(
                    "selectedOffer",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "selectedOffer"
                );

            }


            // تنظيف بيانات الحجز السابق

            localStorage.removeItem("selectedStaff");
            localStorage.removeItem("selectedDate");
            localStorage.removeItem("selectedTime");
            localStorage.removeItem("bookingNotes");
            localStorage.removeItem("editingBookingNumber");


            // الانتقال لاختيار الموظفة

            window.location.href = "staff.html";

        });


        // دعم زر Enter من الكيبورد

        card.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();
                card.click();

            }

        });

    });


    // ==================================================
    // المفضلة
    // ==================================================

    const favoriteButtons =
        document.querySelectorAll(".popular-favorite-btn");


    // قراءة المفضلة الحالية

    function getFavorites() {

        try {

            return JSON.parse(
                localStorage.getItem("favoriteServices")
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // ==================================================
    // هل الخدمة موجودة في المفضلة؟
    // ==================================================

    function isFavorite(serviceName) {

        const favorites = getFavorites();

        return favorites.some(function (item) {

            return item.name === serviceName;

        });

    }


    // ==================================================
    // تغيير شكل القلب
    // ==================================================

    function updateFavoriteButton(button) {

        const serviceName =
            button.getAttribute("data-favorite-service");

        const icon =
            button.querySelector("i");


        if (!icon) return;


        if (isFavorite(serviceName)) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            button.classList.add("active");

            button.setAttribute(
                "aria-label",
                "إزالة " + serviceName + " من المفضلة"
            );

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            button.classList.remove("active");

            button.setAttribute(
                "aria-label",
                "إضافة " + serviceName + " للمفضلة"
            );

        }

    }


    // تحديث القلوب عند فتح الصفحة

    favoriteButtons.forEach(function (button) {

        updateFavoriteButton(button);


        button.addEventListener("click", function (event) {

            // مهم:
            // منع ضغطة القلب من تشغيل ضغطة الكرت

            event.preventDefault();
            event.stopPropagation();


            const category =
                button.getAttribute(
                    "data-favorite-category"
                );

            const serviceName =
                button.getAttribute(
                    "data-favorite-service"
                );

            const price =
                button.getAttribute(
                    "data-favorite-price"
                );


            let favorites =
                getFavorites();


            const favoriteIndex =
                favorites.findIndex(function (item) {

                    return item.name === serviceName;

                });


            // =========================================
            // إذا موجودة نحذفها
            // =========================================

            if (favoriteIndex !== -1) {

                favorites.splice(
                    favoriteIndex,
                    1
                );

            }

            // =========================================
            // إذا مو موجودة نضيفها
            // =========================================

            else {

                favorites.push({

                    category: category,

                    name: serviceName,

                    price: Number(price),

                    offer: true

                });

            }


            // حفظ المفضلة

            localStorage.setItem(
                "favoriteServices",
                JSON.stringify(favorites)
            );


            // تحديث شكل القلب

            updateFavoriteButton(button);

        });

    });


    // ==================================================
    // منع Enter على القلب من تشغيل الكرت
    // ==================================================

    favoriteButtons.forEach(function (button) {

        button.addEventListener("keydown", function (event) {

            event.stopPropagation();

        });

    });


    // ==================================================
    // القائمة الجانبية
    // ==================================================

    const menuBtn =
        document.getElementById("menuBtn");

    const sideMenu =
        document.getElementById("sideMenu");

    const sideMenuClose =
        document.getElementById("sideMenuClose");

    const sideMenuOverlay =
        document.getElementById("sideMenuOverlay");


    function openSideMenu() {

        if (!sideMenu) return;

        sideMenu.classList.add("show");

        document.body.style.overflow =
            "hidden";

    }


    function closeSideMenu() {

        if (!sideMenu) return;

        sideMenu.classList.remove("show");

        document.body.style.overflow =
            "";

    }


    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            openSideMenu
        );

    }


    if (sideMenuClose) {

        sideMenuClose.addEventListener(
            "click",
            closeSideMenu
        );

    }


    if (sideMenuOverlay) {

        sideMenuOverlay.addEventListener(
            "click",
            closeSideMenu
        );

    }


    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            sideMenu &&
            sideMenu.classList.contains("show")
        ) {

            closeSideMenu();

        }

    });


    // ==================================================
    // اسم العميلة داخل القائمة
    // ==================================================

    const menuCustomerName =
        document.getElementById("menuCustomerName");

    const savedCustomerName =
        localStorage.getItem("customerName");


    if (
        menuCustomerName &&
        savedCustomerName
    ) {

        menuCustomerName.textContent =
            savedCustomerName;

    }


    // ==================================================
    // تواصلي معنا من القائمة
    // ==================================================

    const menuContactBtn =
        document.getElementById("menuContactBtn");

    const homeContact =
        document.getElementById("homeContact");


    if (menuContactBtn) {

        menuContactBtn.addEventListener(
            "click",
            function () {

                closeSideMenu();


                if (homeContact) {

                    setTimeout(function () {

                        homeContact.scrollIntoView({

                            behavior: "smooth",
                            block: "start"

                        });

                    }, 250);

                }

            }
        );

    }


    // ==================================================
    // الإشعارات
    // ==================================================

    const notificationBadge =
        document.getElementById("notificationBadge");

    const sideNotificationBadge =
        document.getElementById("sideNotificationBadge");


    const bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    const readNotifications =
        JSON.parse(
            localStorage.getItem("readNotifications")
        ) || [];


    // ==================================================
    // إنشاء IDs للإشعارات
    // ==================================================

    function getNotificationIds() {

        const ids = [];


        bookings.forEach(function (booking) {

            const bookingNumber =
                booking.bookingNumber || "";

            const status =
                booking.status || "مؤكد";


            if (status === "ملغي") {

                ids.push(
                    "cancelled-" + bookingNumber
                );

            } else {

                ids.push(
                    "confirmed-" + bookingNumber
                );


                if (
                    booking.date &&
                    booking.time
                ) {

                    ids.push(
                        "reminder-" + bookingNumber
                    );

                }

            }

        });


        return ids;

    }


    // ==================================================
    // حساب الإشعارات غير المقروءة
    // ==================================================

    function getUnreadCount() {

        const notificationIds =
            getNotificationIds();


        const unread =
            notificationIds.filter(function (id) {

                return !readNotifications.includes(id);

            });


        return unread.length;

    }


    // ==================================================
    // عرض عدد الإشعارات
    // ==================================================

    function updateNotificationBadges() {

        const count =
            getUnreadCount();


        localStorage.setItem(
            "unreadNotificationsCount",
            count
        );


        const displayCount =
            count > 99
                ? "99+"
                : count;


        // جرس الهيدر

        if (notificationBadge) {

            if (count > 0) {

                notificationBadge.textContent =
                    displayCount;

                notificationBadge.style.display =
                    "flex";

            } else {

                notificationBadge.style.display =
                    "none";

            }

        }


        // جرس القائمة

        if (sideNotificationBadge) {

            if (count > 0) {

                sideNotificationBadge.textContent =
                    displayCount;

                sideNotificationBadge.style.display =
                    "flex";

            } else {

                sideNotificationBadge.style.display =
                    "none";

            }

        }

    }


    updateNotificationBadges();


    // ==================================================
    // تحديث الإشعارات عند تغير التخزين
    // ==================================================

    window.addEventListener(
        "storage",
        function () {

            updateNotificationBadges();

        }
    );

});