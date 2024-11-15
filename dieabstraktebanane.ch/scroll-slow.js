document.addEventListener('DOMContentLoaded', () => {
    const slowLink = document.querySelector('.link-banane'); // Auswahl des langsamen Links

    function smoothScrollToSlow() {
        const targetId = slowLink.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 2000; // Langsame Geschwindigkeit (2000 ms)
            let start = null;

            function animation(currentTime) {
                if (!start) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);

                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        }
    }

    if (slowLink) {
        slowLink.addEventListener('click', (e) => {
            e.preventDefault(); // Verhindert das direkte Springen
            smoothScrollToSlow();
        });
    }
});