document.addEventListener('DOMContentLoaded', () => {
    const fastLink = document.querySelector('.link-hoch'); // Auswahl des schnellen Links

    function smoothScrollToTop() {
        const scrollSpeed = 200; // Scrollgeschwindigkeit in Pixel pro Frame, für sanftes und langsameres Scrollen

        function scrollStep() {
            if (window.scrollY > 0) {
                window.scrollBy(0, -scrollSpeed); // Schrittweise nach oben scrollen
                requestAnimationFrame(scrollStep); // Wiederhole die Animation
            }
        }

        requestAnimationFrame(scrollStep); // Starte die Animation
    }

    if (fastLink) {
        fastLink.addEventListener('click', (e) => {
            e.preventDefault(); // Verhindert das sofortige Springen
            smoothScrollToTop(); // Startet das leicht verlangsamte Scrollen
        });
    }
});