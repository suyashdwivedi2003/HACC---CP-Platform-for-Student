import { useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../lib/axios";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await axiosInstance.post("/contact/team", formData);
      if (response.status === 200) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-40 mb-20 p-10 bg-white text-gray-900 shadow-2xl rounded-3xl border border-gray-200"
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Get in Touch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
            required
          ></textarea>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 transition-all"
        >
          Send Message
        </motion.button>

        {status && (
          <p className="text-center mt-4 text-sm text-gray-600">
            {status}
          </p>
        )}
      </form>
    </motion.div>
  );
}
