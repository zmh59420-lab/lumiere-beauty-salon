document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // عناصر الصفحة
    // =========================================

    const notificationsList =
        document.getElementById("notificationsList");

    const notificationsEmpty =
        document.getElementById("notificationsEmpty");

    const markAllReadBtn =
        document.getElementById("markAllReadBtn");


    // =========================================
    // جلب الحجوزات
    // =========================================

    const bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    // =========================================
    // الإشعارات المقروءة
    // =========================================

    let readNotifications =
        JSON.parse(
            localStorage.getItem("readNotifications")
        ) || [];


    // =========================================
    // إنشاء الإشعارات من الحجوزات
    // =========================================

    function createNotifications() {

        const notifications = [];


        bookings.forEach(function (booking) {

            const bookingNumber =
                booking.bookingNumber || "";

            const service =
                booking.service || "الخدمة";

            const staff =
                booking.staff || "";

            const date =
                booking.date || "";

            const time =
                booking.time || "";

            const status =
                booking.status || "مؤكد";


            // =====================================
            // الحجز الملغي
            // =====================================

            if (status === "ملغي") {

                notifications.push({

                    id:
                        "cancelled-" +
                        bookingNumber,

                    type:
                        "cancelled",

                    icon:
                        "fa-solid fa-calendar-xmark",

                    title:
                        "تم إلغاء حجزك",

                    message:
                        "تم إلغاء حجز " +
                        service +
                        (date ? " بتاريخ " + date : "") +
                        (time ? " الساعة " + time : "") +
                        ".",

                    bookingNumber:
                        bookingNumber

                });

            }


            // =====================================
            // الحجز المؤكد
            // =====================================

            else {

                notifications.push({

                    id:
                        "confirmed-" +
                        bookingNumber,

                    type:
                        "confirmed",

                    icon:
                        "fa-solid fa-circle-check",

                    title:
                        "تم تأكيد حجزك",

                    message:
                        "تم تأكيد موعد " +
                        service +
                        (staff ? " مع " + staff : "") +
                        (date ? " بتاريخ " + date : "") +
                        (time ? " الساعة " + time : "") +
                        ".",

                    bookingNumber:
                        bookingNumber

                });


                // =================================
                // تذكير بالموعد
                // =================================

                if (date && time) {

                    notifications.push({

                        id:
                            "reminder-" +
                            bookingNumber,

                        type:
                            "reminder",

                        icon:
                            "fa-regular fa-clock",

                        title:
                            "تذكير بموعدك",

                        message:
                            "موعدك لخدمة " +
                            service +
                            " بتاريخ " +
                            date +
                            " الساعة " +
                            time +
                            ".",

                        bookingNumber:
                            bookingNumber

                    });

                }

            }

        });


        return notifications;

    }


    // =========================================
    // معرفة هل الإشعار مقروء
    // =========================================

    function isNotificationRead(id) {

        return readNotifications.includes(id);

    }


    // =========================================
    // حفظ المقروء
    // =========================================

    function saveReadNotifications() {

        localStorage.setItem(
            "readNotifications",
            JSON.stringify(readNotifications)
        );

    }


    // =========================================
    // تحديد إشعار كمقروء
    // =========================================

    function markAsRead(id) {

        if (!readNotifications.includes(id)) {

            readNotifications.push(id);

            saveReadNotifications();

        }

    }


    // =========================================
    // عرض الإشعارات
    // =========================================

    function displayNotifications() {

        const notifications =
            createNotifications();


        notificationsList.innerHTML = "";


        // =====================================
        // ما فيه إشعارات
        // =====================================

        if (notifications.length === 0) {

            notificationsList.style.display =
                "none";

            notificationsEmpty.style.display =
                "block";

            markAllReadBtn.style.display =
                "none";

            return;

        }


        // =====================================
        // فيه إشعارات
        // =====================================

        notificationsList.style.display =
            "flex";

        notificationsEmpty.style.display =
            "none";

        markAllReadBtn.style.display =
            "flex";


        // الأحدث أولاً

        notifications
            .slice()
            .reverse()
            .forEach(function (notification) {

                const read =
                    isNotificationRead(
                        notification.id
                    );


                const card =
                    document.createElement("div");


                card.className =
                    "notification-card " +
                    notification.type +
                    (read ? "" : " unread");


                card.setAttribute(
                    "data-id",
                    notification.id
                );


                card.innerHTML = `

                    <div class="notification-icon">

                        <i class="${notification.icon}"></i>

                    </div>


                    <div class="notification-info">

                        <h3>
                            ${notification.title}
                        </h3>

                        <p>
                            ${notification.message}
                        </p>

                        ${
                            notification.bookingNumber
                            ? `
                                <span class="notification-time">
                                    رقم الحجز:
                                    ${notification.bookingNumber}
                                </span>
                              `
                            : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="notification-action"
                        title="${
                            read
                            ? "مقروء"
                            : "تحديد كمقروء"
                        }"
                    >

                        <i class="${
                            read
                            ? "fa-solid fa-check-double"
                            : "fa-solid fa-check"
                        }"></i>

                    </button>

                `;


                // =================================
                // الضغط على زر المقروء
                // =================================

                const actionButton =
                    card.querySelector(
                        ".notification-action"
                    );


                actionButton.addEventListener(
                    "click",
                    function () {

                        markAsRead(
                            notification.id
                        );

                        card.classList.remove(
                            "unread"
                        );


                        actionButton.innerHTML = `

                            <i class="fa-solid fa-check-double"></i>

                        `;


                        updateUnreadCount();

                    }
                );


                notificationsList.appendChild(
                    card
                );

            });


        updateUnreadCount();

    }


    // =========================================
    // عدد الإشعارات الجديدة
    // =========================================

    function updateUnreadCount() {

        const notifications =
            createNotifications();


        const unreadCount =
            notifications.filter(
                function (notification) {

                    return !isNotificationRead(
                        notification.id
                    );

                }
            ).length;


        // نحفظ العدد عشان نستخدمه
        // لاحقاً عند جرس الإشعارات

        localStorage.setItem(
            "unreadNotificationsCount",
            unreadCount
        );


        // إذا كلها مقروءة

        if (unreadCount === 0) {

            markAllReadBtn.innerHTML = `

                <i class="fa-solid fa-check-double"></i>

                تمت قراءة الكل

            `;

        }

        else {

            markAllReadBtn.innerHTML = `

                <i class="fa-solid fa-check-double"></i>

                تحديد الكل كمقروء

            `;

        }

    }


    // =========================================
    // تحديد الكل كمقروء
    // =========================================

    if (markAllReadBtn) {

        markAllReadBtn.addEventListener(
            "click",
            function () {

                const notifications =
                    createNotifications();


                notifications.forEach(
                    function (notification) {

                        if (
                            !readNotifications.includes(
                                notification.id
                            )
                        ) {

                            readNotifications.push(
                                notification.id
                            );

                        }

                    }
                );


                saveReadNotifications();

                displayNotifications();

            }
        );

    }


    // =========================================
    // تشغيل الصفحة
    // =========================================

    displayNotifications();

});