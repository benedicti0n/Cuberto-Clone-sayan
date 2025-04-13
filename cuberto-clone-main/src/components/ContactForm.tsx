"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface ContactFormProps {
  isVisible: boolean;
  onClose: () => void;
}
// eslint-disable-next-line
const ContactForm: React.FC<ContactFormProps> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    };

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);

    return Object.values(errors).every((err) => err === "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/contactForm/add`, formData);

      if (response.status === 200) {
        setSuccessMessage("Thanks! Your message has been submitted.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setFormErrors({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className={`fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[500px] bg-white p-10 shadow-lg ${isVisible ? "block" : "hidden"
        }`}
      style={{ zIndex: 50, backgroundColor: "#ffffff" }}
    >
      <div className="space-y-6">
        {successMessage ? (
          <div className="text-green-600 text-sm text-center">{successMessage}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-xs text-black/60 font-light-regular">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className={`p-2 border ${formErrors.name ? 'border-red-400' : 'border-gray-200'} rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs text-black/60 font-light-regular">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  className={`p-2 border ${formErrors.email ? 'border-red-400' : 'border-gray-200'} rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-xs text-black/60 font-light-regular">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone number"
                  className={`p-2 border ${formErrors.phone ? 'border-red-400' : 'border-gray-200'} rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20`}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  inputMode="tel"
                />
                {formErrors.phone && <p className="text-red-500 text-xs">{formErrors.phone}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="subject" className="text-xs text-black/60 font-light-regular">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="What’s this about?"
                className={`p-2 border ${formErrors.subject ? 'border-red-400' : 'border-gray-200'} rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20`}
                value={formData.subject}
                onChange={handleChange}
                disabled={isLoading}
              />
              {formErrors.subject && <p className="text-red-500 text-xs">{formErrors.subject}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-xs text-black/60 font-light-regular">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Leave us a message..."
                className={`p-2 border ${formErrors.message ? 'border-red-400' : 'border-gray-200'} rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/20`}
                value={formData.message}
                onChange={handleChange}
                disabled={isLoading}
                rows={4}
              />
              {formErrors.message && <p className="text-red-500 text-xs">{formErrors.message}</p>}
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-black text-white rounded-md hover:bg-black/80 transition-colors mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ContactForm;