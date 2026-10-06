document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const offersGrid =
        document.querySelector(".offers-page-grid");


    if (!offersGrid) {
        return;
    }


    // =====================================================
    // HELPERS
    // =====================================================

    function getOffers() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem("lumiereOffers")
                );


            return Array.isArray(saved)
                ? saved
                : [];

        } catch (error) {

            return [];
        }
    }


    function getServices() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem("lumiereServices")
                );


            return Array.isArray(saved)
                ? saved
                : [];

        } catch (error) {

            return [];
        }
    }


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


    function getPrice(value) {

        const number =
            Number(
                String(value || 0)
                    .replace(/[^\d.]/g, "")
            );


        return Number.isNaN(number)
            ? 0
            : number;
    }


    function getTodayKey() {

        const date = new Date();

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;
    }


    const todayKey =
        getTodayKey();


    // =====================================================
    // CHECK ACTIVE OFFER
    // =====================================================

    function isOfferAvailable(offer) {

        if (offer.status === "inactive") {
            return false;
        }


        if (
            offer.startDate &&
            todayKey < offer.startDate
        ) {
            return false;
        }


        if (
            offer.endDate &&
            todayKey > offer.endDate
        ) {
            return false;
        }


        return true;
    }


    // =====================================================
    // DISCOUNT
    // =====================================================

    function calculateDiscount(
        originalPrice,
        offerPrice
    ) {

        originalPrice =
            getPrice(originalPrice);

        offerPrice =
            getPrice(offerPrice);


        if (
            originalPrice <= 0 ||
            offerPrice >= originalPrice
        ) {
            return 0;
        }


        return Math.round(
            (
                (
                    originalPrice -
                    offerPrice
                ) /
                originalPrice
            ) * 100
        );
    }


    // =====================================================
    // GET SERVICE CATEGORY
    // =====================================================

    function getServiceCategory(serviceName) {

        const services =
            getServices();


        const service =
            services.find(function (item) {

                return (
                    String(item.name || "")
                        .trim()
                        .toLowerCase()
                    ===
                    String(serviceName || "")
                        .trim()
                        .toLowerCase()
                );
            });


        if (
            service &&
            service.category
        ) {
            return service.category;
        }


        return "خدمات LUMIÈRE";
    }


    // =====================================================
    // ICON
    // =====================================================

    function getCategoryIcon(category) {

        const text =
            String(category || "");


        if (text.includes("شعر")) {

            return "fa-solid fa-scissors";
        }


        if (
            text.includes("أظافر") ||
            text.includes("اظافر")
        ) {

            return "fa-regular fa-hand";
        }


        if (
            text.includes("بشرة") ||
            text.includes("عناية")
        ) {

            return "fa-regular fa-face-smile";
        }


        if (text.includes("مكياج")) {

            return "fa-solid fa-wand-magic-sparkles";
        }


        if (
            text.includes("رموش") ||
            text.includes("حواجب")
        ) {

            return "fa-regular fa-eye";
        }


        return "fa-solid fa-spa";
    }


    // =====================================================
    // DISPLAY OFFERS
    // =====================================================

    function displayOffers() {

        const allOffers =
            getOffers();


        const activeOffers =
            allOffers.filter(
                isOfferAvailable
            );


        offersGrid.innerHTML = "";


        // =========================================
        // NO OFFERS
        // =========================================

        if (activeOffers.length === 0) {

            offersGrid.innerHTML = `

                <div class="offers-empty-state">

                    <div class="offers-empty-icon">
                        <i class="fa-solid fa-tags"></i>
                    </div>

                    <h2>
                        لا توجد عروض حالياً
                    </h2>

                    <p>
                        ترقبي عروض LUMIÈRE الجديدة قريباً
                    </p>

                    <a
                        href="booking.html"
                        class="offers-empty-btn"
                    >
                        تصفحي الخدمات

                        <i class="fa-solid fa-arrow-left"></i>
                    </a>

                </div>
            `;

            return;
        }


        // =========================================
        // SHOW OFFERS
        // =========================================

        activeOffers.forEach(
            function (offer) {

                const originalPrice =
                    getPrice(
                        offer.originalPrice
                    );


                const offerPrice =
                    getPrice(
                        offer.offerPrice
                    );


                const discount =
                    calculateDiscount(
                        originalPrice,
                        offerPrice
                    );


                const category =
                    getServiceCategory(
                        offer.service
                    );


                const icon =
                    getCategoryIcon(
                        category
                    );


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "special-offer-card";


                card.innerHTML = `

                    <div class="special-offer-top">

                        <span class="special-offer-badge">

                            ${
                                discount > 0
                                    ? `خصم ${discount}%`
                                    : "عرض خاص"
                            }

                        </span>


                        <div class="special-offer-icon">

                            <i class="${icon}"></i>

                        </div>

                    </div>


                    <div class="special-offer-content">

                        <span class="special-offer-category">
                            ${escapeHTML(category)}
                        </span>


                        <h2>
                            ${escapeHTML(
                                offer.name ||
                                offer.service
                            )}
                        </h2>


                        <p>

                            ${
                                escapeHTML(
                                    offer.description ||
                                    `عرض خاص على ${offer.service}`
                                )
                            }

                        </p>


                        <div class="special-offer-service-name">

                            <i class="fa-solid fa-scissors"></i>

                            <span>
                                ${escapeHTML(offer.service)}
                            </span>

                        </div>


                        <div class="special-offer-price">

                            <div>

                                <span>
                                    بدلاً من
                                </span>

                                <del>
                                    ${originalPrice.toLocaleString("en-US")}
                                    ر.س
                                </del>

                            </div>


                            <strong>

                                ${offerPrice.toLocaleString("en-US")}

                                <small>
                                    ر.س
                                </small>

                            </strong>

                        </div>


                        ${
                            offer.endDate
                                ? `
                                    <div class="special-offer-expiry">

                                        <i class="fa-regular fa-clock"></i>

                                        <span>
                                            العرض متاح حتى
                                            ${escapeHTML(offer.endDate)}
                                        </span>

                                    </div>
                                `
                                : ""
                        }


                        <button
                            type="button"
                            class="offer-book-btn"
                            data-category="${escapeHTML(category)}"
                            data-service="${escapeHTML(offer.service)}"
                            data-price="${offerPrice}"
                            data-offer-id="${escapeHTML(offer.id || "")}"
                            data-offer-name="${escapeHTML(offer.name || "")}"
                        >

                            احجزي العرض

                            <i class="fa-solid fa-arrow-left"></i>

                        </button>

                    </div>
                `;


                offersGrid.appendChild(
                    card
                );
            }
        );


        setupOfferButtons();
    }


    // =====================================================
    // BOOK OFFER
    // =====================================================

    function setupOfferButtons() {

        const offerButtons =
            document.querySelectorAll(
                ".offer-book-btn"
            );


        offerButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const category =
                            button.getAttribute(
                                "data-category"
                            );


                        const serviceName =
                            button.getAttribute(
                                "data-service"
                            );


                        const price =
                            button.getAttribute(
                                "data-price"
                            );


                        const offerId =
                            button.getAttribute(
                                "data-offer-id"
                            );


                        const offerName =
                            button.getAttribute(
                                "data-offer-name"
                            );


                        // =============================
                        // SERVICE
                        // =============================

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


                        // =============================
                        // OFFER
                        // =============================

                        localStorage.setItem(
                            "selectedOffer",
                            "true"
                        );


                        localStorage.setItem(
                            "selectedOfferId",
                            offerId || ""
                        );


                        localStorage.setItem(
                            "selectedOfferName",
                            offerName || ""
                        );


                        // =============================
                        // CLEAR OLD BOOKING
                        // =============================

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


                        localStorage.removeItem(
                            "editingBookingNumber"
                        );


                        // =============================
                        // NEXT PAGE
                        // =============================

                        window.location.href =
                            "staff.html";
                    }
                );
            }
        );
    }


    // =====================================================
    // START
    // =====================================================

    displayOffers();

});