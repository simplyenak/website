<template>
  <div class="w-full max-w-2xl mx-auto">
    <form
      id="contact-form"
      @submit.prevent="handleSubmit"
      class="flex flex-col gap-6"
    >
      <!-- Turnstile will be added when site key is properly configured -->
      <!-- <div class="cf-turnstile" :data-sitekey="TURNSTILE_SITE_KEY"></div> -->

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
import { ref, reactive, computed, onMounted } from "vue";

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

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  submitMessage.value = null;

  try {
    formData.form_start_time = Date.now();

    // Turnstile verification will be added when properly configured
    // if (!window.turnstile) {
    //   throw new Error("Security verification not ready. Please refresh the page and try again.");
    // }

    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        source_page: window.location.pathname,
        utm_campaign: new URLSearchParams(window.location.search).get(
          "utm_campaign"
        ),
        "cf-turnstile-response": "", // Will be added when Turnstile is properly configured
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      submitMessage.value = {
        type: "success",
        text: "Thank you for contacting Simply Enak! We've received your inquiry and will get back to you within 24 hours.",
      };

      if (typeof window !== "undefined" && window.trackContactForm) {
        window.trackContactForm();
      }

      Object.keys(formData).forEach((key) => {
        if (key !== "website" && key !== "form_start_time") {
          formData[key] = "";
        }
      });
    } else {
      throw new Error(result.message || "Failed to submit form");
    }
  } catch (error) {
    console.error("Form submission error:", error);
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
});
</script>
