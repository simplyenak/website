<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- No webhook configured -->
    <div v-if="!webhookUrl" class="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
      <p class="text-amber-800 font-medium mb-2">Contact form not yet configured.</p>
      <p class="text-amber-700 text-sm">
        In the meantime, reach us directly:
        <a href="mailto:contact@simplyenak.com" class="underline font-semibold">contact@simplyenak.com</a>
        or WhatsApp <a href="https://wa.me/60172878929" class="underline font-semibold">+60 17-287 8929</a>
      </p>
    </div>

    <form
      v-else
      id="contact-form"
      @submit.prevent="handleSubmit"
      class="flex flex-col gap-6"
    >
      <div class="flex flex-col gap-1.5">
        <label for="cf-fullName" class="text-sm font-medium text-gray-700">Full Name <span aria-hidden="true">*</span></label>
        <input
          id="cf-fullName"
          type="text"
          name="fullName"
          v-model="formData.fullName"
          :class="fieldClass('fullName')"
          placeholder="e.g. Sarah Chen"
          required
          maxlength="255"
          autocomplete="name"
        />
        <span v-if="errors.fullName" role="alert" class="text-red-500 text-sm font-medium">{{ errors.fullName }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="cf-email" class="text-sm font-medium text-gray-700">Email Address <span aria-hidden="true">*</span></label>
        <input
          id="cf-email"
          type="email"
          name="email"
          v-model="formData.email"
          :class="fieldClass('email')"
          placeholder="you@example.com"
          required
          maxlength="255"
          autocomplete="email"
        />
        <span v-if="errors.email" role="alert" class="text-red-500 text-sm font-medium">{{ errors.email }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="cf-phone" class="text-sm font-medium text-gray-700">Phone / WhatsApp <span class="text-gray-400 font-normal">(optional)</span></label>
        <input
          id="cf-phone"
          type="tel"
          name="phoneNumber"
          v-model="formData.phoneNumber"
          :class="fieldClass('phoneNumber')"
          placeholder="+60 17-287 8929"
          maxlength="30"
          autocomplete="tel"
        />
      </div>

      <div class="grid sm:grid-cols-2 gap-6">
        <div class="flex flex-col gap-1.5">
          <label for="cf-company" class="text-sm font-medium text-gray-700">Company <span class="text-gray-400 font-normal">(optional)</span></label>
          <input
            id="cf-company"
            type="text"
            name="company"
            v-model="formData.company"
            :class="fieldClass('company')"
            placeholder="Your company name"
            maxlength="255"
            autocomplete="organization"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="cf-country" class="text-sm font-medium text-gray-700">Country</label>
          <input
            id="cf-country"
            type="text"
            name="country"
            v-model="formData.country"
            :class="fieldClass('country')"
            placeholder="e.g. Australia"
            maxlength="100"
            autocomplete="country-name"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="cf-inquiryType" class="text-sm font-medium text-gray-700">What can we help you with? <span aria-hidden="true">*</span></label>
        <select
          id="cf-inquiryType"
          name="inquiryType"
          v-model="formData.inquiryType"
          :class="fieldClass('inquiryType')"
          style="background-image:url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e');background-position:right .5rem center;background-repeat:no-repeat;background-size:1.5em 1.5em"
          required
        >
          <option value="">Select an option…</option>
          <option value="Public Tour">Join a Public Tour</option>
          <option value="Private Tour">Private / Group Tour</option>
          <option value="Food Experience">Custom Food Experience</option>
          <option value="Corporate Event">Corporate Team Building</option>
          <option value="Partnership">Partnership Inquiry</option>
          <option value="Media">Media Inquiry</option>
          <option value="General">General Question</option>
        </select>
        <span v-if="errors.inquiryType" role="alert" class="text-red-500 text-sm font-medium">{{ errors.inquiryType }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="cf-message" class="text-sm font-medium text-gray-700">Your message <span aria-hidden="true">*</span></label>
        <textarea
          id="cf-message"
          name="message"
          v-model="formData.message"
          :class="fieldClass('message')"
          placeholder="Tell us about your group, preferred dates, dietary needs, or anything else you'd like to know…"
          required
          maxlength="5000"
          rows="5"
        ></textarea>
        <span v-if="errors.message" role="alert" class="text-red-500 text-sm font-medium">{{ errors.message }}</span>
      </div>

      <!-- Anti-spam: Honeypot field (hidden from humans, bots will fill it) -->
      <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;visibility:hidden;" aria-hidden="true">
        <label for="honeypot_website">Leave this blank</label>
        <input
          type="text"
          id="honeypot_website"
          name="honeypot_website"
          v-model="formData.honeypot_website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>
      <!-- End honeypot -->

      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-primary text-white px-8 py-4 border-2 border-primary rounded-sm text-base font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 mt-4 min-w-[210px] mx-auto hover:bg-[#efe5d940] hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
      >
        <span v-if="isSubmitting" class="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></span>
        {{ isSubmitting ? "Sending..." : "Send Message" }}
      </button>

      <div
        v-if="submitMessage"
        :class="['p-4 rounded-lg font-medium text-center mt-4', submitMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300']"
      >
        {{ submitMessage.text }}
      </div>

      <p class="text-xs text-gray-400 text-center">
        Your details are used only to respond to your enquiry and stored for up to 3 years.
        <a href="/privacy-policy/" class="underline hover:text-gray-600 transition-colors">Privacy Policy</a>.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  webhookUrl: {
    type: String,
    default: '',
  },
});

const baseFieldClass = 'px-4 py-3.5 border-2 rounded-sm text-base transition-all duration-300 bg-white text-gray-800';
const errorFieldClass = 'border-red-500';
const normalFieldClass = 'border-gray-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(181,45,56,0.1)]';

const fieldClass = (field) => [
  baseFieldClass,
  errors[field] ? errorFieldClass : normalFieldClass,
  field === 'inquiryType' ? 'cursor-pointer appearance-none pr-10' : '',
  field === 'message' ? 'resize-y min-h-[140px] leading-relaxed' : '',
];

const formData = reactive({
  fullName: "",
  email: "",
  phoneNumber: "",
  company: "",
  country: "",
  inquiryType: "",
  honeypot_website: "",  // Anti-spam honeypot
  message: "",
});

const errors = reactive({});
const isSubmitting = ref(false);
const submitMessage = ref(null);

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k]);
  let ok = true;

  if (!formData.fullName.trim()) { errors.fullName = "Full name is required"; ok = false; }
  if (!formData.email.trim()) { errors.email = "Email is required"; ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { errors.email = "Please enter a valid email"; ok = false; }
  if (!formData.inquiryType) { errors.inquiryType = "Please select an inquiry type"; ok = false; }
  if (!formData.message.trim()) { errors.message = "Please tell us a bit about what you're looking for"; ok = false; }
  // Anti-spam: Check honeypot
  if (formData.honeypot_website) { errors.honeypot_website = "Spam detected"; ok = false; }

  return ok;
};

const handleSubmit = async () => {
  if (!validate()) return;

  isSubmitting.value = true;
  submitMessage.value = null;

  try {
    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: typeof window !== 'undefined' ? window.location.href : 'website',
    };

    const res = await fetch(props.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    if (typeof window !== "undefined" && window.trackContactForm) {
      window.trackContactForm();
    }

    // Redirect to thank-you page on success
    if (typeof window !== "undefined") {
      window.location.href = "/thank-you-contact/";
      return;
    }

  } catch (error) {
    console.error("Form submission error:", error);
    submitMessage.value = {
      type: "error",
      text: "Sorry, something went wrong. Please email us directly at contact@simplyenak.com or WhatsApp +60 17-287 8929.",
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>
