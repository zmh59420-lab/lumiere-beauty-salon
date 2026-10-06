document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // عناصر بيانات الحساب
    // ==================================================

    const profileName =
        document.getElementById("profileName");

    const profilePhone =
        document.getElementById("profilePhone");

    const editProfileBtn =
        document.getElementById("editProfileBtn");

    const personalInfoBtn =
        document.getElementById("personalInfoBtn");

    const profileEditSection =
        document.getElementById("profileEditSection");

    const closeProfileEdit =
        document.getElementById("closeProfileEdit");

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");

    const saveProfileBtn =
        document.getElementById("saveProfileBtn");


    // ==================================================
    // عناصر التواصل
    // ==================================================

    const contactBtn =
        document.getElementById("contactBtn");

    const contactModal =
        document.getElementById("contactModal");

    const contactOverlay =
        document.getElementById("contactOverlay");

    const closeContactBtn =
        document.getElementById("closeContactBtn");

    const whatsappContact =
        document.getElementById("whatsappContact");

    const phoneContact =
        document.getElementById("phoneContact");

    const locationContact =
        document.getElementById("locationContact");


    // ==================================================
    // عناصر المفضلة
    // ==================================================

    const favoritesList =
        document.getElementById("favoritesList");

    const favoritesEmpty =
        document.getElementById("favoritesEmpty");


    // ==================================================
    // جلب بيانات العميلة
    // ==================================================

    const savedName =
        localStorage.getItem("customerName");

    const savedPhone =
        localStorage.getItem("customerPhone");


    if (savedName && profileName) {

        profileName.textContent =
            savedName;

    }


    if (savedPhone && profilePhone) {

        profilePhone.textContent =
            savedPhone;

    }


    if (savedName && customerName) {

        customerName.value =
            savedName;

    }


    if (savedPhone && customerPhone) {

        customerPhone.value =
            savedPhone;

    }


    // ==================================================
    // فتح تعديل البيانات
    // ==================================================

    function openProfileEdit() {

        if (!profileEditSection) {
            return;
        }


        profileEditSection.classList.add("show");


        if (customerName) {

            customerName.value =
                localStorage.getItem("customerName") || "";

        }


        if (customerPhone) {

            customerPhone.value =
                localStorage.getItem("customerPhone") || "";

        }


        profileEditSection.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }


    if (editProfileBtn) {

        editProfileBtn.addEventListener(
            "click",
            openProfileEdit
        );

    }


    if (personalInfoBtn) {

        personalInfoBtn.addEventListener(
            "click",
            openProfileEdit
        );

    }


    // ==================================================
    // إغلاق تعديل البيانات
    // ==================================================

    if (closeProfileEdit) {

        closeProfileEdit.addEventListener(
            "click",
            function () {

                profileEditSection.classList.remove("show");

            }
        );

    }


    // ==================================================
    // السماح بأرقام فقط للجوال
    // ==================================================

    if (customerPhone) {

        customerPhone.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(/[^0-9]/g, "");

            }
        );

    }


    // ==================================================
    // حفظ بيانات العميلة
    // ==================================================

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            function () {

                const name =
                    customerName.value.trim();

                const phone =
                    customerPhone.value.trim();


                // التحقق من الاسم

                if (name === "") {

                    alert("اكتبي اسمك أولاً");

                    customerName.focus();

                    return;

                }


                // التحقق من الجوال

                if (phone === "") {

                    alert("اكتبي رقم الجوال");

                    customerPhone.focus();

                    return;

                }


                // التحقق من رقم سعودي

                if (
                    phone.length !== 10 ||
                    !phone.startsWith("05")
                ) {

                    alert(
                        "اكتبي رقم جوال صحيح يبدأ بـ 05 ويتكون من 10 أرقام"
                    );

                    customerPhone.focus();

                    return;

                }


                // حفظ البيانات

                localStorage.setItem(
                    "customerName",
                    name
                );

                localStorage.setItem(
                    "customerPhone",
                    phone
                );


                // تحديث البطاقة

                if (profileName) {

                    profileName.textContent =
                        name;

                }


                if (profilePhone) {

                    profilePhone.textContent =
                        phone;

                }


                // رسالة نجاح داخل الزر

                saveProfileBtn.innerHTML = `

                    تم حفظ البيانات

                    <i class="fa-solid fa-check"></i>

                `;


                setTimeout(function () {

                    profileEditSection.classList.remove("show");


                    saveProfileBtn.innerHTML = `

                        حفظ البيانات

                        <i class="fa-solid fa-check"></i>

                    `;

                }, 900);

            }
        );

    }


    // ==================================================
    // فتح نافذة تواصلي معنا
    // ==================================================

    function openContactModal() {

        if (!contactModal) {
            return;
        }


        contactModal.classList.add("show");


        // منع تحريك الصفحة الخلفية

        document.body.style.overflow =
            "hidden";

    }


    // ==================================================
    // إغلاق نافذة تواصلي معنا
    // ==================================================

    function closeContactModal() {

        if (!contactModal) {
            return;
        }


        contactModal.classList.remove("show");


        document.body.style.overflow =
            "";

    }


    // زر تواصلي معنا

    if (contactBtn) {

        contactBtn.addEventListener(
            "click",
            openContactModal
        );

    }


    // زر X

    if (closeContactBtn) {

        closeContactBtn.addEventListener(
            "click",
            closeContactModal
        );

    }


    // الضغط على الخلفية

    if (contactOverlay) {

        contactOverlay.addEventListener(
            "click",
            closeContactModal
        );

    }


    // زر ESC

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                contactModal &&
                contactModal.classList.contains("show")
            ) {

                closeContactModal();

            }

        }
    );


    // ==================================================
    // أزرار التواصل
    // ==================================================
    //
    // حالياً نخليها تجريبية.
    // لاحقاً نحط رقم الصالون الحقيقي
    // ورابط الموقع الحقيقي.
    //
    // ==================================================


    // واتساب

    if (whatsappContact) {

        whatsappContact.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "سيتم ربط رقم واتساب الصالون هنا"
                );

            }
        );

    }


    // اتصال

    if (phoneContact) {

        phoneContact.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "سيتم ربط رقم الصالون هنا"
                );

            }
        );

    }


    // الموقع

    if (locationContact) {

        locationContact.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "سيتم ربط موقع الصالون على الخريطة هنا"
                );

            }
        );

    }


    // ==================================================
    // عرض الخدمات المفضلة
    // ==================================================

    function displayFavorites() {

        if (
            !favoritesList ||
            !favoritesEmpty
        ) {

            return;

        }


        let favorites =
            JSON.parse(
                localStorage.getItem("favoriteServices")
            ) || [];


        favoritesList.innerHTML =
            "";


        // ==============================================
        // ما فيه مفضلة
        // ==============================================

        if (favorites.length === 0) {

            favoritesEmpty.style.display =
                "block";

            favoritesList.style.display =
                "none";

            return;

        }


        // ==============================================
        // فيه مفضلة
        // ==============================================

        favoritesEmpty.style.display =
            "none";

        favoritesList.style.display =
            "grid";


        favorites.forEach(
            function (service, index) {

                const card =
                    document.createElement("div");


                card.className =
                    "profile-favorite-card";


                card.innerHTML = `

                    <button
                        type="button"
                        class="remove-favorite-btn"
                        data-index="${index}"
                        aria-label="إزالة من المفضلة"
                    >

                        <i class="fa-solid fa-heart"></i>

                    </button>


                    <div class="profile-favorite-info">

                        <span class="favorite-category">

                            ${service.category || ""}

                        </span>


                        <h3>

                            ${service.name || ""}

                        </h3>


                        <p>

                            ${service.description || ""}

                        </p>

                    </div>


                    <div class="profile-favorite-bottom">

                        <div class="profile-favorite-price">

                            <strong>

                                ${service.price || "0"}

                            </strong>

                            <span>
                                ر.س
                            </span>

                        </div>


                        <button
                            type="button"
                            class="favorite-book-btn"
                            data-index="${index}"
                        >

                            احجزي الآن

                            <i class="fa-solid fa-arrow-left"></i>

                        </button>

                    </div>

                `;


                favoritesList.appendChild(
                    card
                );

            }
        );


        // ==================================================
        // حذف خدمة من المفضلة
        // ==================================================

        const removeButtons =
            document.querySelectorAll(
                ".remove-favorite-btn"
            );


        removeButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.getAttribute(
                                    "data-index"
                                )
                            );


                        favorites.splice(
                            index,
                            1
                        );


                        localStorage.setItem(

                            "favoriteServices",

                            JSON.stringify(
                                favorites
                            )

                        );


                        displayFavorites();

                    }
                );

            }
        );


        // ==================================================
        // الحجز من المفضلة
        // ==================================================

        const bookButtons =
            document.querySelectorAll(
                ".favorite-book-btn"
            );


        bookButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.getAttribute(
                                    "data-index"
                                )
                            );


                        const service =
                            favorites[index];


                        if (!service) {
                            return;
                        }


                        // حجز جديد

                        localStorage.removeItem(
                            "editingBookingNumber"
                        );


                        // القسم

                        localStorage.setItem(

                            "selectedService",

                            service.category || ""

                        );


                        // الخدمة

                        localStorage.setItem(

                            "selectedServiceName",

                            service.name || ""

                        );


                        // السعر

                        localStorage.setItem(

                            "selectedServicePrice",

                            service.price || ""

                        );


                        // تنظيف بيانات حجز سابق

                        localStorage.removeItem(
                            "selectedStaff"
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


                        // اختيار الموظفة

                        window.location.href =
                            "staff.html";

                    }
                );

            }
        );

    }


    // ==================================================
    // تشغيل المفضلة
    // ==================================================

    displayFavorites();

});