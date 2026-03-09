import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  User, 
  MessageSquare, 
  Building, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch via email",
    value: "support@stocksense.ai",
    link: "mailto:support@stocksense.ai",
    gradient: "from-blue-500/20 to-cyan-500/20",
    hoverColor: "blue"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our team",
    value: "+91 1800-123-4567",
    link: "tel:+911800123456",
    gradient: "from-green-500/20 to-emerald-500/20",
    hoverColor: "green"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    value: "Mumbai, Maharashtra, India",
    link: "#",
    gradient: "from-purple-500/20 to-pink-500/20",
    hoverColor: "purple"
  }
];

const companyStats = [
  { label: "Response Time", value: "< 2 hours", icon: Clock },
  { label: "Global Clients", value: "50K+", icon: Globe },
  { label: "Security Level", value: "SOC 2", icon: Shield },
  { label: "Success Rate", value: "99.9%", icon: Zap }
];

export function PremiumContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.23, 0.86, 0.39, 0.96] as [number, number, number, number]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-screen bg-[#0a0a1a] overflow-hidden py-24 px-6">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient mesh */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Moving orbs */}
        <motion.div className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-400/60 rounded-full" animate={{ y: [0, -30, 0], x: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full" animate={{ y: [0, 20, 0], x: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

        {/* Communication lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          {[...Array(6)].map((_, i) => (
            <line key={i} x1={`${i * 20}%`} y1="0" x2={`${100 - i * 15}%`} y2="100%" stroke="white" strokeWidth="1" />
          ))}
        </svg>
      </div>

      <motion.div className="relative max-w-7xl mx-auto" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="text-center mb-20" variants={fadeInUp}>
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] backdrop-blur-sm rounded-full border border-white/[0.1] mb-6" whileHover={{ scale: 1.05 }}>
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-white/70">✨ Let's Connect</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Get in </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Ready to transform your trading with AI? Let's start a conversation about your goals and how StockSense AI can help you achieve them.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20" variants={fadeInUp}>
          {companyStats.map((stat, index) => (
            <motion.div key={index} className="text-center p-6 bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.08]" whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}>
              <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/50 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl border border-white/[0.1] p-8 md:p-10" variants={fadeInUp}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
              <p className="text-white/50">Tell us about your project and we'll get back to you within 24 hours.</p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full pl-10 pr-4 py-4 bg-white/[0.08] border rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-all ${errors.name ? 'border-red-400' : 'border-white/[0.15]'}`} />
                      </div>
                      {errors.name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">{errors.name}</motion.p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`w-full pl-10 pr-4 py-4 bg-white/[0.08] border rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-all ${errors.email ? 'border-red-400' : 'border-white/[0.15]'}`} />
                      </div>
                      {errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">{errors.email}</motion.p>}
                    </div>
                  </div>

                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input type="text" placeholder="Company (Optional)" value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)} className="w-full pl-10 pr-4 py-4 bg-white/[0.08] border border-white/[0.15] rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-all" />
                  </div>

                  <div>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-white/30" />
                      <textarea rows={4} placeholder="Your Message" value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} className={`w-full pl-10 pr-4 py-4 bg-white/[0.08] border rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-all resize-none ${errors.message ? 'border-red-400' : 'border-white/[0.15]'}`} />
                    </div>
                    {errors.message && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">{errors.message}</motion.p>}
                  </div>

                  <motion.button type="submit" disabled={isSubmitting} className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.5 }} />
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                  <motion.div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center mx-auto mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                  <p className="text-white/60 text-lg mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <motion.button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', company: '', message: '' }); }} className="px-6 py-3 bg-white/[0.08] border border-white/[0.15] rounded-xl text-white hover:bg-white/[0.12] transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Send Another Message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Methods */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">Other ways to reach us</h3>
              <p className="text-white/60 text-lg">Choose the method that works best for you.</p>
            </div>

            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.a key={index} href={method.link} className="block p-6 bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/[0.15] hover:bg-white/[0.08] transition-all group" variants={fadeInUp} whileHover={{ scale: 1.02, y: -2 }}>
                  <div className="flex items-center gap-4">
                    <motion.div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.gradient} border border-white/20 flex items-center justify-center`} whileHover={{ scale: 1.1, rotateY: 180 }} transition={{ duration: 0.6 }}>
                      <method.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-1">{method.title}</h4>
                      <p className="text-white/60 text-sm mb-2">{method.description}</p>
                      <p className="text-white font-medium">{method.value}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div className="p-6 bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.08] backdrop-blur-xl rounded-2xl border border-indigo-400/30" variants={fadeInUp}>
              <h4 className="text-lg font-semibold text-white mb-3">Quick Response Guarantee</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                We pride ourselves on rapid response times. All inquiries are typically answered within 2 hours during business hours, 
                and we'll schedule a call within 24 hours to discuss your project in detail.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full" style={{ left: `${10 + (i * 12)}%`, top: `${20 + (i * 10)}%` }} animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 2, 1] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }} />
        ))}
      </motion.div>
    </section>
  );
}