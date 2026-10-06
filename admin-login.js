document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // عناصر الصفحة
    // ========================================

    const loginForm =
        document.getElementById("adminLoginForm");

    const emailInput =
        document.getElementById("adminEmail");

    const passwordInput =
        document.getElementById("adminPassword");

    const passwordToggle =
        document.getElementById("adminPasswordToggle");

    const loginError =
        document.getElementById("adminLoginError");


    // ========================================
    // بيانات الدخول التجريبية
    // لاحقاً ستنتقل للـ Backend
    // ========================================

    const DEMO_EMAIL =
        "admin@lumiere.com";

    const DEMO_PASSWORD =
        "123456";


    // ========================================
    // إظهار وإخفاء كلمة المرور
    // ========================================

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            function () {

                const icon =
                    passwordToggle.querySelector("i");


                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    if (icon) {
                        icon.classList.remove("fa-eye");
                        icon.classList.add("fa-eye-slash");
                    }

                } else {

                    passwordInput.type = "password";

                    if (icon) {
                        icon.classList.remove("fa-eye-slash");
                        icon.classList.add("fa-eye");
                    }

                }

            }
        );
    }


    // ========================================
    // إخفاء رسالة الخطأ عند الكتابة
    // ========================================

    function hideError() {

        if (loginError) {
            loginError.classList.remove("show");
        }

    }


    if (emailInput) {
        emailInput.addEventListener(
            "input",
            hideError
        );
    }


    if (passwordInput) {
        passwordInput.addEventListener(
            "input",
            hideError
        );
    }


    // ========================================
    // تسجيل الدخول
    // ========================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    emailInput.value
                        .trim()
                        .toLowerCase();


                const password =
                    passwordInput.value.trim();


                // ========================================
                // التحقق من البيانات
                // ========================================

                if (
                    email === DEMO_EMAIL &&
                    password === DEMO_PASSWORD
                ) {

                    // حفظ جلسة الإدارة التجريبية

                    sessionStorage.setItem(
                        "lumiereAdminLoggedIn",
                        "true"
                    );


                    // الانتقال للوحة التحكم

                    window.location.href =
                        "admin-dashboard.html";

                } else {

                    // إظهار الخطأ

                    if (loginError) {
                        loginError.classList.add("show");
                    }


                    // تفريغ كلمة المرور

                    passwordInput.value = "";


                    // التركيز على كلمة المرور

                    passwordInput.focus();

                }

            }
        );
    }

});