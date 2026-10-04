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
    // القائمة الجانبية
    // ==================================================

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const sideMenuClose = document.getElementById("sideMenuClose");
    const sideMenuOverlay = document.getElementById("sideMenuOverlay");

    function openSideMenu() {

        if (!sideMenu) return;

        sideMenu.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    function closeSideMenu() {

        if (!sideMenu) return;

        sideMenu.classList.remove("show");

        document.body.style.overflow = "";
    }


    if (menuBtn) {
        menuBtn.addEventListener("click", openSideMenu);
    }


    if (sideMenuClose) {
        sideMenuClose.addEventListener("click", closeSideMenu);
    }


    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener("click", closeSideMenu);
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


    if (menuCustomerName && savedCustomerName) {

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

        menuContactBtn.addEventListener("click", function () {

            closeSideMenu();

            if (homeContact) {

                setTimeout(function () {

                    homeContact.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }, 250);

            }

        });
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


            // حجز ملغي

            if (status === "ملغي") {

                ids.push(
                    "cancelled-" + bookingNumber
                );

            }

            // حجز مؤكد

            else {

                ids.push(
                    "confirmed-" + bookingNumber
                );


                // تذكير

                if (booking.date && booking.time) {

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
    // عرض الرقم على الجرس
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


        // الجرس فوق

        if (notificationBadge) {

            if (count > 0) {

                notificationBadge.textContent =
                    displayCount;

                notificationBadge.style.display =
                    "flex";

            }

            else {

                notificationBadge.style.display =
                    "none";

            }

        }


        // الإشعارات داخل القائمة

        if (sideNotificationBadge) {

            if (count > 0) {

                sideNotificationBadge.textContent =
                    displayCount;

                sideNotificationBadge.style.display =
                    "flex";

            }

            else {

                sideNotificationBadge.style.display =
                    "none";

            }

        }

    }


    updateNotificationBadges();


    // ==================================================
    // تحديث الإشعارات عند تغير التخزين
    // ==================================================

    window.addEventListener("storage", function () {

        updateNotificationBadges();

    });

});