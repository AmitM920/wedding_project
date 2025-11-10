export function observeElements(selector, callback, options = {}) {
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback(entry.target);
                entry.target.classList.add("show")
            }
            else {
                entry.target.classList.remove("show")
            }
        });
    }, options);

    elements.forEach((el) => observer.observe(el));
}
