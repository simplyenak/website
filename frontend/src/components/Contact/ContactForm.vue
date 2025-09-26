<template>
  <div class="w-full max-w-2xl mx-auto">
    <form
      id="contact-form"
      @submit.prevent="handleSubmit"
      class="flex flex-col gap-6"
    >
      <div
        v-if="showTurnstile"
        ref="turnstileWidget"
        class="cf-turnstile flex justify-center my-6"
        :data-sitekey="TURNSTILE_SITE_KEY"
        :data-callback="turnstileCallbackName"
        :data-error-callback="turnstileErrorCallbackName"
        :data-theme="'light'"
        :data-size="'normal'"
      ></div>

      <div
        v-if="showTurnstile && !turnstileLoaded"
        class="text-center my-6 p-4 bg-gray-100 rounded border"
      >
        <p class="text-sm text-gray-600">
          Security verification is loading... If this persists, please refresh
          the page.
        </p>
      </div>

      <input
        type="text"
        name="website"
        class="hidden"
        tabindex="-1"
        v-model="formData.website"
      />
      <input
        type="hidden"
        name="form_start_time"
        id="form_start_time"
        v-model="formData.form_start_time"
      />

      <div class="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          v-model="formData.name"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800',
            errors.name
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          placeholder="Full Name"
          required
          maxlength="255"
        />
        <span
          v-if="errors.name"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.name }}</span
        >
      </div>

      <div class="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          v-model="formData.email"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800',
            errors.email
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          placeholder="Email Address"
          required
          maxlength="255"
        />
        <span
          v-if="errors.email"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.email }}</span
        >
      </div>

      <div class="flex flex-col gap-2">
        <input
          type="tel"
          name="phone"
          v-model="formData.phone"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800',
            errors.phone
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          placeholder="Phone Number"
          maxlength="20"
        />
        <span
          v-if="errors.phone"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.phone }}</span
        >
      </div>

      <div class="flex flex-col gap-2">
        <input
          type="text"
          name="company"
          v-model="formData.company"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800',
            errors.company
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          placeholder="Company"
          maxlength="255"
        />
        <span
          v-if="errors.company"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.company }}</span
        >
      </div>

      <div class="flex flex-col gap-2">
        <input
          type="text"
          name="country"
          v-model="formData.country"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800',
            errors.country
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          placeholder="Country"
          maxlength="100"
        />
        <span
          v-if="errors.country"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.country }}</span
        >
      </div>

      <div class="flex flex-col gap-2">
        <select
          name="inquiry_type"
          v-model="formData.inquiry_type"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800 cursor-pointer appearance-none pr-10',
            errors.inquiry_type
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          style="
            background-image: url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e');
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
          "
          required
        >
          <option value="">Select Inquiry Type</option>
          <option value="Public Tour">Public Tour</option>
          <option value="Private Tour">Private Tour</option>
          <option value="Food Experience">Food Experience</option>
          <option value="Corporate Event">Corporate Event</option>
          <option value="Partnership">Partnership Inquiry</option>
          <option value="Media">Media Inquiry</option>
          <option value="General">General Question</option>
        </select>
        <span
          v-if="errors.inquiry_type"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.inquiry_type }}</span
        >
      </div>

      <div class="flex flex-col gap-2">
        <textarea
          name="message"
          v-model="formData.message"
          :class="[
            'px-4 py-3.5 border-2 rounded-sm text-base font-pt-sans transition-all duration-300 bg-white text-gray-800 resize-y min-h-[120px] leading-relaxed',
            errors.message
              ? 'border-red-500'
              : 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]',
          ]"
          placeholder="Your message..."
          required
          maxlength="5000"
        ></textarea>
        <span
          v-if="errors.message"
          class="text-red-500 text-sm font-medium mt-1 font-pt-sans"
          >{{ errors.message }}</span
        >
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-primary text-white px-8 py-4 border-2 border-primary rounded-sm text-base font-bold font-pt-sans uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 mt-4 min-w-[210px] mx-auto hover:bg-[#efe5d940] hover:border-white hover:text-primary hover:-translate-y-0.5 hover:shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer"
      >
        <span
          v-if="isSubmitting"
          class="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"
        ></span>
        {{ isSubmitting ? "Sending..." : "Send Message" }}
      </button>

      <div
        v-if="submitMessage"
        :class="[
          'p-4 rounded-sm font-medium text-center font-pt-sans mt-4',
          submitMessage.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300',
        ]"
      >
        {{ submitMessage.text }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";

const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  "https://n8n.system.simplyenak.com/webhook/simply-enak-contact-2024-secure-form";

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAABpeXumlMVzDHFDl";

const formData = reactive({
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  inquiry_type: "",
  message: "",
  website: "",
  form_start_time: "",
});

const errors = reactive({});
const isSubmitting = ref(false);
const submitMessage = ref(null);
const showTurnstile = ref(false);
const turnstileToken = ref("");
const turnstileWidget = ref(null);
const turnstileLoaded = ref(false);

const turnstileCallbackName = `turnstileSuccess_${Math.random()
  .toString(36)
  .substr(2, 9)}`;
const turnstileErrorCallbackName = `turnstileError_${Math.random()
  .toString(36)
  .substr(2, 9)}`;

const validateForm = () => {
  const validationErrors = [];

  if (!formData.name?.trim()) validationErrors.push("Full name is required");
  if (!formData.email?.trim()) validationErrors.push("Email is required");
  if (!formData.inquiry_type) validationErrors.push("Inquiry type is required");
  if (!formData.message?.trim()) validationErrors.push("Message is required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    validationErrors.push("Please enter a valid email address");
  }

  if (validationErrors.length > 0) {
    alert("Please fix the following errors:\n" + validationErrors.join("\n"));
    return false;
  }

  return true;
};

let currentTurnstileToken = "";

const onTurnstileSuccess = (token) => {
  currentTurnstileToken = token;
  turnstileToken.value = token;
  if (submitMessage.value && submitMessage.value.type === "error") {
    submitMessage.value = null;
  }
};

const onTurnstileError = () => {
  currentTurnstileToken = "";
  turnstileToken.value = "";
  submitMessage.value = {
    type: "error",
    text: "Security verification failed. Please refresh the page and try again.",
  };
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  submitMessage.value = null;

  try {
    formData.form_start_time = Date.now();

    // Create FormData for N8N webhook compatibility
    const form = new FormData();

    // Add all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        form.append(key, formData[key]);
      }
    });

    // Add tracking data
    form.append("source_page", window.location.href);
    form.append(
      "utm_campaign",
      new URLSearchParams(window.location.search).get("utm_campaign") || ""
    );

    const tokenToUse = currentTurnstileToken || turnstileToken.value;
    const turnstileAvailable = typeof window.turnstile !== "undefined";

    if (showTurnstile.value && !tokenToUse) {
      const isPATConflict = !turnstileAvailable && showTurnstile.value;
      if (!isPATConflict) {
        submitMessage.value = {
          type: "error",
          text: "Please complete the security verification.",
        };
        isSubmitting.value = false;
        return;
      }
    }

    if (tokenToUse) {
      form.append("cf-turnstile-response", tokenToUse);
    } else if (showTurnstile.value) {
      submitMessage.value = {
        type: "error",
        text: "Security verification required. Please complete the CAPTCHA.",
      };
      isSubmitting.value = false;
      return;
    }

    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: form,
    });

    if (response.status === 403) {
      throw new Error(
        "Security verification failed. Please refresh the page and complete the security check."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (response.ok && result.success) {
      submitMessage.value = {
        type: "success",
        text:
          result.message ||
          "Thank you for contacting Simply Enak! We've received your inquiry and will get back to you within 24 hours.",
      };

      if (typeof window !== "undefined" && window.trackContactForm) {
        window.trackContactForm();
      }

      // Reset form
      Object.keys(formData).forEach((key) => {
        if (key !== "website" && key !== "form_start_time") {
          formData[key] = "";
        }
      });

      // Clear turnstile token
      currentTurnstileToken = "";
      turnstileToken.value = "";

      // Reset Turnstile if available
      if (
        typeof window !== "undefined" &&
        window.turnstile &&
        showTurnstile.value
      ) {
        const turnstileWidget = document.querySelector(".cf-turnstile");
        if (turnstileWidget) {
          try {
            window.turnstile.reset(turnstileWidget);
          } catch (error) {
            // Silent fail for production
          }
        }
      }
    } else {
      throw new Error(
        result.error || result.message || "Failed to submit form"
      );
    }
  } catch (error) {
    submitMessage.value = {
      type: "error",
      text: "Sorry, there was an error submitting your form. Please try again or contact us directly.",
    };
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  formData.form_start_time = Date.now();
  window[turnstileCallbackName] = onTurnstileSuccess;
  window[turnstileErrorCallbackName] = onTurnstileError;
  initializeTurnstile();
});

watch(turnstileWidget, (newWidget) => {
  if (newWidget && typeof window.turnstile !== "undefined") {
    setTimeout(renderTurnstileWidget, 100);
  }
});

const initializeTurnstile = () => {
  showTurnstile.value = true;
  forceLoadTurnstile();
};

const forceLoadTurnstile = () => {
  if (typeof window.turnstile !== "undefined") {
    turnstileLoaded.value = true;
    return;
  }

  const existingScript = document.querySelector(
    'script[src*="challenges.cloudflare.com"]'
  );
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      turnstileLoaded.value = true;
      setTimeout(renderTurnstileWidget, 100);
    };
    script.onerror = () => setTimeout(loadTurnstileScript, 1000);
    document.head.appendChild(script);
  } else {
    let attempts = 0;
    const checkExistingScript = () => {
      attempts++;
      if (typeof window.turnstile !== "undefined") {
        turnstileLoaded.value = true;
        setTimeout(renderTurnstileWidget, 100);
        return;
      }
      if (attempts < 20) {
        setTimeout(checkExistingScript, 250);
      } else {
        loadTurnstileScript();
      }
    };
    setTimeout(checkExistingScript, 100);
  }
};

const loadTurnstileScript = () => {
  if (typeof window.turnstile !== "undefined") {
    showTurnstile.value = true;
    turnstileLoaded.value = true;
    return;
  }

  if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      showTurnstile.value = true;
      turnstileLoaded.value = true;
    };
    script.onerror = () => {
      submitMessage.value = {
        type: "error",
        text: "Security verification system failed to load. Please refresh the page and try again.",
      };
      showTurnstile.value = false;
    };
    document.head.appendChild(script);
  } else {
    const checkTurnstile = setInterval(() => {
      if (typeof window.turnstile !== "undefined") {
        showTurnstile.value = true;
        clearInterval(checkTurnstile);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkTurnstile);
      if (typeof window.turnstile === "undefined") {
        showTurnstile.value = false;
      }
    }, 5000);
  }
};

const renderTurnstileWidget = () => {
  if (typeof window.turnstile !== "undefined" && turnstileWidget.value) {
    try {
      window.turnstile.render(turnstileWidget.value, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: window[turnstileCallbackName],
        "error-callback": window[turnstileErrorCallbackName],
        theme: "light",
        size: "normal",
      });
      turnstileLoaded.value = true;
    } catch (error) {
      // Silent fail for production
    }
  }
};

onUnmounted(() => {
  if (window[turnstileCallbackName]) delete window[turnstileCallbackName];
  if (window[turnstileErrorCallbackName])
    delete window[turnstileErrorCallbackName];
});
</script>
