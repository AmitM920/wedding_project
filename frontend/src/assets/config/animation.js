export function observeElements(selector, callback, options = {}) {
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Only call callback if it's a function
                if (typeof callback === 'function') {
                    callback(entry.target);
                }
                entry.target.classList.add("show")
            }
            else {
                entry.target.classList.remove("show")
            }
        });
    }, options);

    elements.forEach((el) => observer.observe(el));
}