document.addEventListener("DOMContentLoaded", function () {

    const serviceCards = document.querySelectorAll(".booking-service-card");

    serviceCards.forEach(function (card) {

        card.addEventListener("click", function () {

            // نعرف القسم اللي اختارته العميلة
            const selectedService = card.getAttribute("data-service");

            // نحفظ القسم
            localStorage.setItem("selectedService", selectedService);

            // نحدد الكرت
            serviceCards.forEach(function (item) {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            // نفتح صفحة خدمات القسم
            setTimeout(function () {
                window.location.href = "service-details.html";
            }, 200);

        });

    });

});
/* ========================================
   البحث عن الخدمات
======================================== */

const serviceSearch = document.getElementById("serviceSearch");

const serviceCards = document.querySelectorAll(".booking-service-card");

const noServicesMessage = document.getElementById("noServicesMessage");


serviceSearch.addEventListener("input", function () {

    // الكلمة التي كتبتها العميلة
    const searchValue = serviceSearch.value
        .trim()
        .toLowerCase();

    let foundService = false;


    serviceCards.forEach(function (card) {

        // نبحث في كل الكلام الموجود داخل البطاقة
        const serviceText = card.textContent
            .trim()
            .toLowerCase();


        if (serviceText.includes(searchValue)) {

            card.style.display = "";

            foundService = true;

        } else {

            card.style.display = "none";

        }

    });


    // إذا لم نجد أي خدمة
    if (foundService) {

        noServicesMessage.style.display = "none";

    } else {

        noServicesMessage.style.display = "block";

    }

});
/* ========================================
   المفضلة
======================================== */

const favoriteButtons = document.querySelectorAll(".favorite-btn");


// جلب المفضلة المحفوظة
let favorites = JSON.parse(localStorage.getItem("lumiereFavorites")) || [];


// إظهار القلوب المحفوظة عند فتح الصفحة
favoriteButtons.forEach(function (button) {

    const serviceName = button.dataset.favorite;
    const heartIcon = button.querySelector("i");


    if (favorites.includes(serviceName)) {

        button.classList.add("active");

        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");

    }


    // عند الضغط على القلب
    button.addEventListener("click", function (event) {

        // يمنع فتح الخدمة عند الضغط على القلب
        event.preventDefault();
        event.stopPropagation();


        const service = button.dataset.favorite;


        // إذا كانت موجودة في المفضلة نحذفها
        if (favorites.includes(service)) {

            favorites = favorites.filter(function (item) {
                return item !== service;
            });

            button.classList.remove("active");

            heartIcon.classList.remove("fa-solid");
            heartIcon.classList.add("fa-regular");

        }


        // إذا لم تكن موجودة نضيفها
        else {

            favorites.push(service);

            button.classList.add("active");

            heartIcon.classList.remove("fa-regular");
            heartIcon.classList.add("fa-solid");

        }


        // حفظ المفضلة
        localStorage.setItem(
            "lumiereFavorites",
            JSON.stringify(favorites)
        );

    });

});