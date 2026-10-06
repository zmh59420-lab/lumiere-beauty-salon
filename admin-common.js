document.addEventListener("DOMContentLoaded", function () {

    const mobileMenu = document.getElementById("adminMobileMenu");
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminSidebarOverlay");

    if (mobileMenu && sidebar) {

        mobileMenu.addEventListener("click", function () {

            sidebar.classList.toggle("open");

            if (overlay) {
                overlay.classList.toggle("show");
            }

        });

    }


    if (overlay && sidebar) {

        overlay.addEventListener("click", function () {

            sidebar.classList.remove("open");
            overlay.classList.remove("show");

        });

    }


    // يقفل القائمة بعد اختيار صفحة على الجوال
    const navLinks = document.querySelectorAll(".admin-nav-item");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 900) {

                sidebar.classList.remove("open");

                if (overlay) {
                    overlay.classList.remove("show");
                }

            }

        });

    });

});