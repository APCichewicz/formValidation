class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.customValidations = [];
        this.init();
    }

    init() {
        this.form.addEventListener("focusout", (event) => {
            this.validateField(event.target);
        });

        this.form.addEventListener("keydown", (event) => {
            this.reset(event.target);
        });

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.validateForm();
        });

        // Add event listener for password field keypress
        this.form.password.addEventListener("input", (event) => {
            this.validateField(event.target);
        });
        this.form.password_confirmation.addEventListener("input", (event) => {
            this.validateField(event.target);
        });
    }
    reset(field) {
        field.parentElement.classList.remove("invalid-child");
        field.classList.remove("invalid");
        field.parentElement.querySelector(".warning").textContent = "";
        field.setCustomValidity("");
    }

    validateField(field) {
        let isValid = field.checkValidity();
        let hasCustomValidator = field.customValidator !== undefined;
        let customValid = true;

        if (isValid && hasCustomValidator) {
            const customValidations = this.customValidations[field.customValidator]; // Get the array of custom validations for this field
            for (let i = 0; i < customValidations.length - 1; i++) {
                if (!customValidations[i](field)) { // If any of the custom validations fail, set customValid to false
                    customValid = false;
                    break;
                }
            };
        }
        const validationMessageContainer = field.parentElement.querySelector(".warning");
        const validityMessage = field.customValidity || field.validationMessage || "";
        if (isValid && customValid) {
            validationMessageContainer.textContent = validityMessage;
            field.parentElement.classList.remove("invalid-child");
            field.classList.remove("invalid");
            field.classList.add("valid");
        } else {
            validationMessageContainer.textContent = validityMessage;
            field.parentElement.classList.add("invalid-child");
            field.classList.remove("valid");
            field.classList.add("invalid");
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll("input");
        fields.forEach((field) => {
            this.validateField(field);
        });
    }

    registerCustomValidation(field, validation) {
        let index = field.customValidator || undefined;
        if (index !== undefined) {
            this.customValidations[index].push(validation);
        }
        else {
            index = this.customValidations.length;
            field.customValidator = index;
            this.customValidations.push([validation]);
        }
    }
}
const reset = document.querySelector("button[type='reset']");
reset.addEventListener("click", (event) => {
    const fields = document.querySelectorAll("input");
    fields.forEach((field) => {
        validator.reset(field)
    });
});

const form = document.querySelector("form");
const validator = new FormValidator(form);
const phoneCheck = function (field) {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    if (regex.test(field.value)) {
        return true;
    } else {
        field.setCustomValidity("Please enter a valid phone number");
        return false;
    }
}
validator.registerCustomValidation(form.phone, phoneCheck);
const passwordminlengthCheck = function (field) {
    if (field.value.length >= 8) {
        return true;
    } else {
        field.setCustomValidity("Password must be at least 8 characters");
        return false;
    }
}
validator.registerCustomValidation(form.password, passwordminlengthCheck);

const passwordmaxlengthCheck = function (field) {
    if (field.value.length <= 20) {
        return true;
    } else {
        field.setCustomValidity("Password must be less than 20 characters");
        return false;
    }
}
validator.registerCustomValidation(form.password, passwordmaxlengthCheck);
const passwordspecialcharactercheck = function (field) {
    const regex = /(?=.*[!@#$%^&*])/;
    if (regex.test(field.value)) {
        return true;
    } else {
        field.setCustomValidity("Password must contain at least one special character");
        return false;
    }
}
validator.registerCustomValidation(form.password, passwordspecialcharactercheck);
const passworduppercasecheck = function (field) {
    const regex = /(?=.*[A-Z])/;
    if (regex.test(field.value)) {
        return true;
    } else {
        field.setCustomValidity("Password must contain at least one uppercase letter");
        return false;
    }
}
validator.registerCustomValidation(form.password, passworduppercasecheck);
const passwordlowercasecheck = function (field) {
    const regex = /(?=.*[a-z])/;
    if (regex.test(field.value)) {
        return true;
    } else {
        field.setCustomValidity("Password must contain at least one lowercase letter");
        return false;
    }
}
validator.registerCustomValidation(form.password, passwordlowercasecheck);
const passwordnumbercheck = function (field) {
    const regex = /(?=.*[0-9])/;
    if (regex.test(field.value)) {
        return true;
    } else {
        field.setCustomValidity("Password must contain at least one number");
        return false;
    }
}
validator.registerCustomValidation(form.password, passwordnumbercheck);
const passwordmatchcheck = function (field) {
    if (field.value === form.password.value) {
        return true;
    } else {
        field.setCustomValidity("Passwords must match");
        return false;
    }
}
validator.registerCustomValidation(form.password_confirmation, passwordmatchcheck);