import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiCpu, FiShield } from "react-icons/fi";
import ReleaseOnScroll from "../ReleaseOnScroll";

const team = [
  {
    name: "Alex Chen",
    role: "AI Engineer",
    bio: "Specializes in reinforcement learning and multi-agent systems. Previously at Google Brain.",
    avatar: "/src/assets/images/profile.jpg",
    social: { github: "#", linkedin: "#" },
  },
  {
    name: "Samira Khan",
    role: "Full-Stack Developer",
    bio: "Builds the bridge between AI models and user experiences. Loves TypeScript and TensorFlow.js.",
    avatar: "/src/assets/images/profile.jpg",
    social: { github: "#", linkedin: "#" },
  },
  {
    name: "Jordan Smith",
    role: "UX Researcher",
    bio: "Ensures our AI recommendations feel human-centric. PhD in HCI from Stanford.",
    avatar: "/src/assets/images/profile.jpg",
    social: { github: "#", linkedin: "#" },
  },
];

export default function AboutUs() {
  return (
    <ReleaseOnScroll>
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Building the Future of E-Commerce
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-600 mb-8">
                At{" "}
                <span className="font-semibold text-indigo-600">AI-Shop</span>,
                we combine cutting-edge machine learning with human-centered
                design to create shopping experiences that feel magical yet
                trustworthy.
              </p>

              {/* Tech Pillars */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center px-4 py-2 bg-indigo-50 rounded-full"
                >
                  <FiCpu className="text-indigo-600 mr-2" />
                  <span className="text-sm font-medium">Autonomous Agents</span>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center px-4 py-2 bg-purple-50 rounded-full"
                >
                  <FiShield className="text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Ethical AI</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                {/* Avatar */}
                <div className="mb-6 relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                    <div
                      className={`w-6 h-6 rounded-full ${
                        index % 2 === 0 ? "bg-green-400" : "bg-amber-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-indigo-600 mb-2">{member.role}</p>
                <p className="text-gray-600 mb-4">{member.bio}</p>

                {/* Social */}
                <div className="flex space-x-3">
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <FiGithub className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          >
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">98%</p>
              <p className="text-gray-500">Recommendation Accuracy</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">10M+</p>
              <p className="text-gray-500">Products Analyzed</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">24/7</p>
              <p className="text-gray-500">AI Model Training</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">100%</p>
              <p className="text-gray-500">Privacy Focused</p>
            </div>
          </motion.div>
        </div>
      </section>
    </ReleaseOnScroll>
  );
}
