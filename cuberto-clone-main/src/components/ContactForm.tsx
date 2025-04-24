"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { LucideX } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface ContactFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isVisible, onClose }) => {
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [canResendOtp, setCanResendOtp] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    otp: ""
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    otp: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // OTP Resend Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && isOtpSent) {
      setCanResendOtp(true);
    }

    return () => clearInterval(interval);
  }, [otpTimer, isOtpSent]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      otp: ""
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
    if (showOtpField && !formData.otp.trim()) errors.otp = "OTP cannot be empty";

    setFormErrors(errors);

    return Object.values(errors).every((err) => err === "");
  };

  const validateFirstStage = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      otp: ""
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

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP not yet sent, validate first stage and send OTP
    if (!isOtpSent) {
      if (!validateFirstStage()) return;
      await sendOTP(e);
      return;
    }

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`${serverUrl}/contactForm/add`, formData);

      if (response.status === 200) {
        // Send notification email to admin
        await sendAdminNotification();
        
        setSuccessMessage("Thanks! Your message has been submitted.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          otp: ""
        });
        setFormErrors({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          otp: ""
        });
        setShowOtpField(false);
        setIsOtpSent(false);
        setCanResendOtp(false);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error('Wrong OTP!');
      // Reset OTP field and let user try again
      setFormData(prev => ({ ...prev, otp: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  const sendAdminNotification = async () => {
    try {
      await axios.post(`${serverUrl}/contactForm/notify-admin`, {
        adminEmail: "sayanbanik459@gmail.com",
        userData: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        },
        // Add email template details for a professional admin notification
        emailTemplate: {
          subject: "New Contact Form Submission - LinkUp",
          title: "LinkUp Notification",
          greeting: "Hello,",
          message: `You have received a new contact form submission with the following details:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}
Message: ${formData.message}

This is an automated notification.`,
          footer: "Regards,\nLinkUp Team"
        }
      });
    } catch (err) {
      console.error("Error sending admin notification:", err);
      // Continue even if admin notification fails
    }
  };

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFirstStage()) return;

    try {
      setOtpLoading(true);
      
      // Let the server generate the OTP instead of generating it in the client
      const response = await axios.post(`${serverUrl}/contactForm/send-otp`, { 
        email: formData.email,
        name: formData.name,
        // Use a more compatible email template format
        emailTemplate: {
          subject: "Your OTP Verification Code",
          title: "LinkUp Verification",
          greeting: "Hello,",
          otpText: "your OTP is {{otp}}. It is valid for 5 minutes",
          disclaimerText: "If you did not request this code, please ignore this email.",
          signature: "Regards,\nLinkUp Team",
          // Simpler styling directives that most email clients can handle
          colors: {
            background: "#282828",
            text: "#FFFFFF",
            highlight: "#D4AF37",
            otpBackground: "#333333"
          }
        }
      });

      // Store the OTP from the server response for validation
      if (response.status === 200) {
        // Log the success info but don't expose the OTP
        console.log("OTP sent successfully");
        
        setIsOtpSent(true);
        setShowOtpField(true);
        setFormErrors(prev => ({ ...prev, email: "" }));
        toast.success('OTP sent successfully!');
        
        // Set OTP resend timer to 60 seconds
        setOtpTimer(60);
        setCanResendOtp(false);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setFormErrors(prev => ({ ...prev, email: "Failed to send OTP. Please try again." }));
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Simple loader component
  const Spinner = () => (
    <div style={{ 
      display: 'flex',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{ 
        position: 'relative',
        width: '60px', 
        height: '60px', 
        transform: 'rotate(165deg)',
      }} className="loader-element">
        <style jsx>{`
          .loader-element:before, .loader-element:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            display: block;
            width: 0.5em;
            height: 0.5em;
            border-radius: 0.25em;
            transform: translate(-50%, -50%);
          }
          
          .loader-element:before {
            animation: before8 2s infinite;
          }
          
          .loader-element:after {
            animation: after6 2s infinite;
          }
          
          @keyframes before8 {
            0% {
              width: 0.5em;
              box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
            }
          
            35% {
              width: 2.5em;
              box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
            }
          
            70% {
              width: 0.5em;
              box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
            }
          
            100% {
              box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
            }
          }
          
          @keyframes after6 {
            0% {
              height: 0.5em;
              box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
            }
          
            35% {
              height: 2.5em;
              box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
            }
          
            70% {
              height: 0.5em;
              box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
            }
          
            100% {
              box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
            }
          }
        `}</style>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed right-0 top-0 h-full w-full sm:w-[450px] md:w-[500px] bg-gradient-to-b from-white to-gray-50 p-8 shadow-xl ${isVisible ? "block" : "hidden"}`}
        style={{ zIndex: 50 }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="p-6 rounded-xl" style={{ width: '150px', height: '150px' }}>
              <Spinner />
            </div>
          </div>
        )}
        
        {otpLoading && !isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="p-6 rounded-xl" style={{ width: '150px', height: '150px' }}>
              <Spinner />
            </div>
          </div>
        )}
        
        <div className="space-y-5 pt-6">
          <button 
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors" 
            onClick={onClose}
          >
            <LucideX className="w-4 h-4" />
          </button>
          
          <div className="mb-4 flex flex-col items-center">
            <h2 className="text-xl font-bold tracking-tight mb-1">Get in touch</h2>
            <div className="w-8 h-1 bg-black rounded-full"></div>
          </div>
          
          {successMessage ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center h-[250px]"
            >
              <div className="text-5xl mb-4 text-green-500">✓</div>
              <div className="text-green-600 text-lg font-medium text-center">{successMessage}</div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {!showOtpField && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-black/70">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className={`p-2 border-b ${formErrors.name ? 'border-red-400' : 'border-gray-300'} bg-transparent focus:outline-none focus:border-black transition-colors duration-300`}
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-black/70">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email address"
                        className={`p-2 border-b ${formErrors.email ? 'border-red-400' : 'border-gray-300'} bg-transparent focus:outline-none focus:border-black transition-colors duration-300`}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading || isOtpSent}
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide text-black/70">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        className={`p-2 border-b ${formErrors.phone ? 'border-red-400' : 'border-gray-300'} bg-transparent focus:outline-none focus:border-black transition-colors duration-300`}
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                        inputMode="tel"
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-xs font-medium uppercase tracking-wide text-black/70">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        className={`p-2 border-b ${formErrors.subject ? 'border-red-400' : 'border-gray-300'} bg-transparent focus:outline-none focus:border-black transition-colors duration-300`}
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-black/70">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Leave us a message..."
                        className={`p-2 border-b ${formErrors.message ? 'border-red-400' : 'border-gray-300'} bg-transparent focus:outline-none focus:border-black transition-colors duration-300 min-h-[80px] resize-none`}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading}
                        rows={3}
                      />
                      {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                    </div>
                  </>
                )}

                {showOtpField && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="otp" className="text-xs font-medium uppercase tracking-wide text-black/70">OTP</label>
                    <p className="text-xs text-black/60 mb-2">
                      A verification code has been sent to {formData.email}
                    </p>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      placeholder="Enter OTP"
                      className={`p-2 border-b ${formErrors.otp ? 'border-red-400' : 'border-gray-300'} bg-transparent focus:outline-none focus:border-black transition-colors duration-300`}
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {formErrors.otp && <p className="text-red-500 text-xs mt-1">{formErrors.otp}</p>}
                    
                    {otpTimer > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Resend OTP in {formatTime(otpTimer)}
                      </p>
                    )}
                    
                    {canResendOtp && (
                      <button
                        type="button"
                        onClick={(e) => sendOTP(e)}
                        className="text-blue-600 text-xs mt-2 hover:text-blue-800 transition-colors"
                        disabled={isLoading || otpLoading}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black text-white text-sm font-medium tracking-wide rounded-md hover:bg-black/90 transition-all duration-300 shadow-md hover:shadow-lg mt-4 uppercase"
                disabled={isLoading || otpLoading}
              >
                {isLoading ? "Submitting..." : (showOtpField ? "Submit Message" : "Get Verification Code")}
              </button>

              {showOtpField && (
                <button
                  type="button"
                  className="w-full py-2 text-black/70 text-xs font-medium tracking-wide mt-2 hover:text-black transition-colors uppercase"
                  onClick={() => {
                    setShowOtpField(false);
                    setIsOtpSent(false);
                    setCanResendOtp(false);
                    setFormData(prev => ({ ...prev, otp: "" }));
                    setOtpTimer(0);
                  }}
                  disabled={isLoading}
                >
                  Back to Form
                </button>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ContactForm;