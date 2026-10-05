document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // جلب بيانات الحجز
    // ========================================

    const bookingNumber =
        localStorage.getItem("currentBookingNumber");

    const serviceName =
        localStorage.getItem("selectedServiceName");

    const servicePrice =
        localStorage.getItem("selectedServicePrice");

    const staffName =
        localStorage.getItem("selectedStaff");

    const selectedDate =
        localStorage.getItem("selectedDate");

    const selectedTime =
        localStorage.getItem("selectedTime");


    // ========================================
    // عناصر الصفحة
    // ========================================

    const bookingNumberElement =
        document.getElementById("bookingNumber");

    const serviceElement =
        document.getElementById("successService");

    const staffElement =
        document.getElementById("successStaff");

    const dateElement =
        document.getElementById("successDate");

    const timeElement =
        document.getElementById("successTime");

    const priceElement =
        document.getElementById("successPrice");

    const addCalendarBtn =
        document.getElementById("addCalendarBtn");

    const calendarToast =
        document.getElementById("calendarToast");


    // ========================================
    // عرض بيانات الحجز
    // ========================================

    if (bookingNumberElement) {
        bookingNumberElement.textContent =
            bookingNumber || "-";
    }

    if (serviceElement) {
        serviceElement.textContent =
            serviceName || "-";
    }

    if (staffElement) {
        staffElement.textContent =
            staffName || "-";
    }

    if (dateElement) {
        dateElement.textContent =
            selectedDate || "-";
    }

    if (timeElement) {
        timeElement.textContent =
            selectedTime || "-";
    }

    if (priceElement) {
        priceElement.textContent =
            servicePrice || "0";
    }


    // ========================================
    // تحويل الوقت العربي
    // مثال:
    // 5:30 مساءً
    // 10:00 صباحًا
    // ========================================

    function parseArabicTime(timeText) {

        if (!timeText) {
            return null;
        }

        const cleanTime =
            String(timeText).trim();

        const match =
            cleanTime.match(
                /(\d{1,2})\s*:\s*(\d{1,2})/
            );


        if (!match) {
            return null;
        }


        let hour =
            Number(match[1]);

        let minute =
            Number(match[2]);


        const isPM =
            cleanTime.includes("مساء") ||
            cleanTime.toLowerCase().includes("pm");


        const isAM =
            cleanTime.includes("صباح") ||
            cleanTime.toLowerCase().includes("am");


        // مساء

        if (isPM && hour < 12) {
            hour += 12;
        }


        // 12 صباحاً

        if (isAM && hour === 12) {
            hour = 0;
        }


        return {
            hour: hour,
            minute: minute
        };
    }


    // ========================================
    // إنشاء تاريخ ووقت الموعد
    // ========================================

    function getAppointmentDateTime() {

        if (!selectedDate || !selectedTime) {
            return null;
        }


        const dateParts =
            selectedDate.split("-");


        if (dateParts.length !== 3) {
            return null;
        }


        const year =
            Number(dateParts[0]);

        const month =
            Number(dateParts[1]) - 1;

        const day =
            Number(dateParts[2]);


        const time =
            parseArabicTime(selectedTime);


        if (!time) {
            return null;
        }


        return new Date(
            year,
            month,
            day,
            time.hour,
            time.minute,
            0,
            0
        );
    }


    // ========================================
    // تنسيق التاريخ لملف ICS
    // ========================================

    function formatICSDate(date) {

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

        const hour =
            String(
                date.getHours()
            ).padStart(2, "0");

        const minute =
            String(
                date.getMinutes()
            ).padStart(2, "0");

        const second =
            String(
                date.getSeconds()
            ).padStart(2, "0");


        return (
            year +
            month +
            day +
            "T" +
            hour +
            minute +
            second
        );
    }


    // ========================================
    // حماية النص داخل ملف التقويم
    // ========================================

    function escapeICSText(text) {

        return String(text || "")
            .replace(/\\/g, "\\\\")
            .replace(/\n/g, "\\n")
            .replace(/,/g, "\\,")
            .replace(/;/g, "\\;");
    }


    // ========================================
    // إضافة الموعد للتقويم
    // ========================================

    function addToCalendar() {

        const startDate =
            getAppointmentDateTime();


        if (!startDate) {

            alert(
                "تعذر قراءة تاريخ أو وقت الحجز."
            );

            return;
        }


        // نفترض مدة الحجز ساعة
        // فقط لغرض ظهور الموعد داخل التقويم

        const endDate =
            new Date(
                startDate.getTime() +
                60 * 60 * 1000
            );


        const title =
            "موعد LUMIÈRE - " +
            (serviceName || "حجز صالون");


        const description =
            "الخدمة: " +
            (serviceName || "-") +
            "\n" +
            "الموظفة: " +
            (staffName || "-") +
            "\n" +
            "رقم الحجز: " +
            (bookingNumber || "-");


        // ========================================
        // محتوى ملف التقويم
        // ========================================

        const calendarContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//LUMIERE Beauty Salon//Booking//AR",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",

            "BEGIN:VEVENT",

            "UID:" +
                (bookingNumber || Date.now()) +
                "@lumiere-salon",

            "DTSTART:" +
                formatICSDate(startDate),

            "DTEND:" +
                formatICSDate(endDate),

            "SUMMARY:" +
                escapeICSText(title),

            "DESCRIPTION:" +
                escapeICSText(description),

            "STATUS:CONFIRMED",

            "BEGIN:VALARM",
            "TRIGGER:-PT2H",
            "ACTION:DISPLAY",
            "DESCRIPTION:تذكير بموعدك في LUMIÈRE",
            "END:VALARM",

            "END:VEVENT",
            "END:VCALENDAR"

        ].join("\r\n");


        // ========================================
        // إنشاء ملف .ics
        // ========================================

        const blob =
            new Blob(
                [calendarContent],
                {
                    type:
                        "text/calendar;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "LUMIERE-" +
            (bookingNumber || "appointment") +
            ".ics";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        setTimeout(function () {

            URL.revokeObjectURL(url);

        }, 1000);


        // ========================================
        // رسالة نجاح
        // ========================================

        if (calendarToast) {

            calendarToast.classList.add(
                "show"
            );


            setTimeout(function () {

                calendarToast.classList.remove(
                    "show"
                );

            }, 3500);
        }
    }


    // ========================================
    // تشغيل زر التقويم
    // ========================================

    if (addCalendarBtn) {

        addCalendarBtn.addEventListener(
            "click",
            addToCalendar
        );
    }

});