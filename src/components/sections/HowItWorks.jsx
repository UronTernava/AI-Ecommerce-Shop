import { motion } from "framer-motion";
import {
  FiCpu,
  FiDatabase,
  FiUser,
  FiShoppingBag,
  FiCode,
  FiChevronRight,
} from "react-icons/fi";
import ReleaseOnScroll from "../ReleaseOnScroll";

const steps = [
  {
    icon: <FiUser className="w-6 h-6" />,
    title: "Learn Your Preferences",
    description:
      "Our AI observes your browsing patterns and purchase history to build a unique taste profile.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <FiDatabase className="w-6 h-6" />,
    title: "Analyze Product Catalog",
    description:
      "Every product is processed through computer vision and NLP models to extract key features.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <FiCpu className="w-6 h-6" />,
    title: "Generate Recommendations",
    description:
      "Reinforcement learning algorithms match products to your profile with 94% accuracy.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: <FiShoppingBag className="w-6 h-6" />,
    title: "Deliver Personalized Results",
    description:
      "You see only products that genuinely match your style and needs.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const TechPill = ({ children }) => (
  <motion.span
    whileHover={{ y: -2 }}
    className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mr-2 mb-2"
  >
    {children}
  </motion.span>
);

export default function HowItWorks() {
  return (
    <ReleaseOnScroll>
      <section id="how-it-works" className="py-16 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Our AI Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A transparent look at the machine learning magic behind your
              personalized shopping experience.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-1/2 h-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-amber-300 w-full -translate-x-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step Icon */}
                  <div
                    className={`mb-4 p-4 rounded-full ${step.color} relative z-10 shadow-sm`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div className="px-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>

                  {/* Mobile arrow */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden mt-6">
                      <FiChevronRight className="w-6 h-6 text-gray-300 mx-auto" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Stack Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 max-w-4xl mx-auto"
          >
            <h4 className="text-center font-medium text-gray-900 mb-4">
              Under the Hood
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              <TechPill>TensorFlow</TechPill>
              <TechPill>Vision Transformers</TechPill>
              <TechPill>NLP</TechPill>
              <TechPill>Reinforcement Learning</TechPill>
              <TechPill>LLMs</TechPill>
              <TechPill>ONNX Runtime</TechPill>
              <TechPill>Hugging Face</TechPill>
            </div>
          </motion.div>

          {/* API Sandbox Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            <div className="p-4 bg-gray-50 border-b flex items-center">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm font-mono text-gray-500">
                api-demo.js
              </span>
              <FiCode className="ml-auto text-gray-400" />
            </div>
            <pre className="p-6 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
              {`// Sample API call to our recommendation engine\n`}
              {`const fetchRecommendations = async () => {\n`}
              {`  try {\n`}
              {`    const response = await fetch('https://api.aishop.dev/v1/recommend', {\n`}
              {`      method: 'POST',\n`}
              {`      headers: { 'Content-Type': 'application/json' },\n`}
              {`      body: JSON.stringify({\n`}
              {`        userId: 'user_${Math.random()
                .toString(36)
                .substring(2, 8)}',\n`}
              {`        preferences: {\n`}
              {`          priceRange: [20, 100],\n`}
              {`          likedCategories: ['tech', 'eco'],\n`}
              {`          dislikedBrands: []\n`}
              {`        },\n`}
              {`        diversity: 0.7 // 0-1 scale\n`}
              {`      })\n`}
              {`    });\n`}
              {`    const data = await response.json();\n`}
              {`    console.log('AI Recommendations:', data.recommendations);\n`}
              {`  } catch (error) {\n`}
              {`    console.error('API Error:', error);\n`}
              {`  }\n`}
              {`};\n\n`}
              {`// Execute the function\n`}
              {`fetchRecommendations();`}
            </pre>
            <div className="p-4 bg-gray-50 border-t text-right">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
              >
                Try in Postman
              </motion.button>
            </div>
          </motion.div>

          {/* Documentation CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="#"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
            >
              Read Full API Documentation
              <FiChevronRight className="ml-1 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>
    </ReleaseOnScroll>
  );
}
