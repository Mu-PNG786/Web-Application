const form = document.querySelector("#trailForm");
const errorRegion = document.querySelector("#errors");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const messageInput = document.querySelector("#message");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML.trim();
}

function validateForm() {
    const errors = [];

    nameInput.setAttribute("aria-invalid", "false");
    emailInput.setAttribute("aria-invalid", "false");
    messageInput.setAttribute("aria-invalid", "false");

    if (!nameInput.value.trim()) {
        errors.push("Name is required.");
        nameInput.setAttribute("aria-invalid", "true");
    }

    if (!emailRegex.test(emailInput.value.trim())) {
        errors.push("Enter a valid email address.");
        emailInput.setAttribute("aria-invalid", "true");
    }

    if (messageInput.value.length > 500) {
        errors.push("Message cannot exceed 500 characters.");
        messageInput.setAttribute("aria-invalid", "true");
    }

    if (!messageInput.value.trim()) {
        errors.push("Message is required.");
        messageInput.setAttribute("aria-invalid", "true");
    }

    errorRegion.innerHTML = errors.join("<br>");

    return errors.length === 0;
}

function debounce(callback, delay = 300) {
    let timeoutId;

    return (...args) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

const debouncedValidation = debounce(validateForm, 300);

[nameInput, emailInput, messageInput].forEach(field => {
    field.addEventListener("input", debouncedValidation);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = new FormData(form);

    const data = Object.fromEntries(
        [...formData.entries()].map(([key, value]) => [
            key,
            sanitize(value)
        ])
    );

    console.log(JSON.stringify(data, null, 2));

    errorRegion.textContent =
        "Form submitted successfully. Check console for JSON output.";
});