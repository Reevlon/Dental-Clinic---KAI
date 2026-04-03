import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  CheckCircle2, 
  Star, 
  Clock, 
  MapPin, 
  Mail, 
  Shield, 
  HeartPulse, 
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Plus,
  Minus,
  Award,
  Users,
  Camera,
  ArrowRight,
  AlertCircle,
  Wallet,
  Newspaper,
  Send,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink,
  Map as MapIcon,
  MessageSquare,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'bookings'), {
        ...bookingForm,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Notify via Facebook (Backend API)
      try {
        const response = await axios.post('/api/notify-booking', bookingForm);
        if (response.data.detectedPsid) {
          console.log('%c[Facebook Notification] Auto-detected your correct PSID: ' + response.data.detectedPsid, 'color: #0084ff; font-weight: bold;');
          console.log('%cPlease update your FB_RECIPIENT_ID in Settings to this value to avoid fallback delays.', 'color: #0084ff;');
        }
      } catch (fbError) {
        console.warn('Facebook notification failed, but booking was saved:', fbError);
      }

      setSubmitStatus('success');
      setBookingForm({ name: '', phone: '', email: '', date: '', reason: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Do you accept my insurance?",
      a: "We accept most major PPO insurance plans including Delta Dental, Cigna, MetLife, Aetna, and many others. Our team will handle all the paperwork for you to maximize your benefits."
    },
    {
      q: "I have severe dental anxiety. How can you help?",
      a: "You're not alone! We specialize in anxiety-free dentistry. We offer a calming environment, noise-canceling headphones, weighted blankets, and various sedation options to ensure your complete comfort."
    },
    {
      q: "What should I expect at my first visit?",
      a: "Your first visit includes a comprehensive exam, digital X-rays, a professional cleaning, and a personalized consultation with the doctor to discuss your goals and any concerns."
    },
    {
      q: "Do you offer financing for larger procedures?",
      a: "Yes! We believe everyone deserves a beautiful smile. We offer flexible, interest-free financing through CareCredit and Sunbit, as well as in-house payment plans."
    }
  ];

  const team = [
    {
      name: "Dr. Elena Rose",
      role: "Lead Cosmetic Dentist",
      bio: "15+ years experience in aesthetic restorations and smile design.",
      image: "https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Marcus Thorne",
      role: "Orthodontic Specialist",
      bio: "Expert in Invisalign and advanced corrective procedures.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Sarah Miller",
      role: "Patient Care Coordinator",
      bio: "Dedicated to making your visit seamless and stress-free.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen font-sans text-text-main bg-background">
      {/* Top Bar */}
      <div className="bg-primary text-white py-3 px-6 text-xs uppercase tracking-widest font-bold hidden md:block border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-8">
            <span className="flex items-center opacity-80 hover:opacity-100 transition-opacity cursor-default"><MapPin className="w-3.5 h-3.5 mr-2 text-accent" /> 2228 Nakar St., San Andres, Bukid, Manila</span>
            <span className="flex items-center opacity-80 hover:opacity-100 transition-opacity cursor-default"><Clock className="w-3.5 h-3.5 mr-2 text-accent" /> Mon-Fri: 8am - 6pm</span>
          </div>
          <div className="flex items-center">
            <a href="tel:09165184025" className="flex items-center hover:text-accent transition-colors">
              <Phone className="w-3.5 h-3.5 mr-2 text-accent" /> 09165184025 / 09176880050
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <span className="font-serif text-3xl font-black tracking-tighter text-primary">PREMIUM<span className="text-accent">DENTAL</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#services" className="text-sm uppercase tracking-widest font-bold text-text-main hover:text-accent transition-all">Services</a>
              <a href="#why-us" className="text-sm uppercase tracking-widest font-bold text-text-main hover:text-accent transition-all">Why Us</a>
              <a href="#testimonials" className="text-sm uppercase tracking-widest font-bold text-text-main hover:text-accent transition-all">Stories</a>
              <a href="#book-now" className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-black transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5">
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-main">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t shadow-xl"
          >
            <div className="px-4 pt-4 pb-8 space-y-4">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-text-main hover:text-primary border-b border-gray-50 pb-2">Services</a>
              <a href="#why-us" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-text-main hover:text-primary border-b border-gray-50 pb-2">Why Us</a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-text-main hover:text-primary border-b border-gray-50 pb-2">Patient Stories</a>
              <a href="#book-now" onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold text-accent pt-2">Book Appointment</a>
              <a href="tel:09165184025" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-primary pt-2">Call Us</a>
              
              <div className="pt-6 flex space-x-6 justify-center border-t border-gray-100">
                <Facebook className="w-6 h-6 text-primary" />
                <Instagram className="w-6 h-6 text-primary" />
                <Twitter className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden pt-12 pb-20 sm:pb-32">
        {/* Luxury Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-secondary rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-[400px] h-[400px] bg-primary/5 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Floating Phone Number - Upper Right Corner */}
          <div className="absolute top-0 right-6 lg:right-8 hidden md:block">
            <a href="tel:09165184025" className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-secondary hover:border-accent transition-all group">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-text-muted leading-none mb-1">Direct Line</p>
                <p className="text-sm font-black text-primary tracking-tight">09165184025</p>
              </div>
            </a>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="inline-block text-xs uppercase tracking-[0.3em] font-black text-accent mb-6 bg-accent/5 px-4 py-2 rounded-full">
                  Excellence in Aesthetic Dentistry
                </span>
                <h1 className="text-6xl md:text-8xl font-serif font-black text-primary leading-[0.9] tracking-tighter mb-8">
                  The Art of <br/>
                  <span className="text-accent italic font-light">Perfect</span> Smiles.
                </h1>
                <p className="text-xl text-text-muted mb-12 max-w-xl leading-relaxed font-medium">
                  Where advanced clinical precision meets artistic vision. We don't just treat teeth; we curate confidence in a sanctuary of modern luxury.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <a href="#book-now" className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white text-center px-10 py-5 rounded-full text-sm uppercase tracking-widest font-black transition-all shadow-2xl shadow-primary/20 hover:-translate-y-1">
                    Book Appointment
                  </a>
                  <a href="tel:09165184025" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-sm uppercase tracking-widest font-black text-primary">Call Us</span>
                  </a>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-2/5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                {/* Oval Masked Image - Luxury Recipe */}
                <div className="relative aspect-[3/4] rounded-[100px] overflow-hidden shadow-2xl border-[12px] border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop" 
                    alt="Luxury Dental Experience" 
                    className="w-full h-full object-cover scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-4 left-2 sm:-bottom-10 sm:-left-10 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 max-w-[180px] sm:max-w-[200px] z-20">
                  <div className="flex text-accent mb-2 sm:mb-3">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />)}
                  </div>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary leading-tight">
                    Beverly Hills' Top Rated Clinic 2026
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section id="services" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Our Expertise
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Comprehensive Care for Your Best Smile</h2>
            <p className="text-lg text-text-muted">From routine cleanings to complete smile makeovers, we offer everything you need under one roof with a gentle, personalized touch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* General */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Shield className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">General</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Dental Consultation</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Oral Prophylaxis (Cleaning)</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Tooth Filling</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Tooth Extraction</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Root Canal Therapy</li>
              </ul>
            </motion.div>

            {/* Orthodontic */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Sparkles className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Orthodontic</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Orthodontic Treatment (Braces)</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Orthodontic Appliances</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Retainers</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Aligners</li>
              </ul>
            </motion.div>

            {/* Oral Surgery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <AlertCircle className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Oral Surgery</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Odontectomy (Wisdom Tooth Removal)</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Gingivectomy</li>
              </ul>
            </motion.div>

            {/* Cosmetic Dentistry */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Star className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Cosmetic Dentistry</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Teeth Whitening</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Veneers</li>
              </ul>
            </motion.div>

            {/* Prosthodontic */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Award className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Prosthodontic</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Removable Complete/Partial Denture</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Jacket Crown/ Fixed Bridge</li>
              </ul>
            </motion.div>

            {/* Pediatric */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <HeartPulse className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Pediatric</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Fluoride Treatment</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Sealant Application</li>
              </ul>
            </motion.div>

            {/* Other Services */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Plus className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Other Services</h3>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Mouthguard/Nightguard</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Periapical Xray</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop" 
                  alt="Modern dental equipment" 
                  className="rounded-3xl shadow-2xl border-8 border-white/10"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent rounded-full blur-3xl opacity-20 -z-0"></div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">The Premium Difference</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">Why Choose Premium Dental?</h2>
              <p className="text-lg text-white mb-12 leading-relaxed font-medium">
                We've completely reimagined the dental experience. No more clinical coldness or anxiety. We combine a luxury spa-like atmosphere with the world's most advanced dental technology.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-lg shadow-black/5">
                    <HeartPulse className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">Anxiety-Free</h4>
                  <p className="text-white/90 text-sm font-medium">Noise-canceling headphones, weighted blankets, and gentle sedation options.</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-lg shadow-black/5">
                    <Sparkles className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">3D Technology</h4>
                  <p className="text-white/90 text-sm font-medium">No messy impressions. We use high-precision 3D digital scanning for everything.</p>
                </div>

                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-lg shadow-black/5">
                    <Shield className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">Expert Team</h4>
                  <p className="text-white/90 text-sm font-medium">Our specialists are leaders in cosmetic and restorative dentistry.</p>
                </div>

                <div className="flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-lg shadow-black/5">
                    <Award className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">Top Rated</h4>
                  <p className="text-white/90 text-sm font-medium">Voted #1 Dental Clinic in Beverly Hills for 3 consecutive years.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Our Specialists</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Meet the Experts Behind Your Smile</h2>
            <p className="text-lg text-text-muted">Our team combines decades of experience with a passion for artistic dental excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-accent rounded-full rotate-6 group-hover:rotate-12 transition-transform duration-300 -z-0"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-64 h-64 rounded-full object-cover relative z-10 border-4 border-white shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-2xl font-serif font-bold text-primary mb-1">{member.name}</h4>
                <p className="text-accent font-bold text-sm uppercase tracking-widest mb-4">{member.role}</p>
                <p className="text-text-muted text-sm px-4">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Patient Stories</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Real Stories from Real Patients</h2>
            <p className="text-lg text-text-muted">Don't just take our word for it. See why hundreds of patients trust us with their smiles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-pink-100 relative"
            >
              <div className="flex text-accent mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-text-main text-lg italic mb-8 leading-relaxed">"I've always been terrified of the dentist, but Dr. Rose and the team completely changed my perspective. The procedure was entirely pain-free, and the staff was incredibly comforting."</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg shadow-primary/20">
                  SJ
                </div>
                <div>
                  <h4 className="font-bold text-primary">Sarah Jenkins</h4>
                  <p className="text-sm text-text-muted">Cosmetic Patient</p>
                </div>
              </div>
            </motion.div>

            {/* Review 2 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-pink-100 relative"
            >
              <div className="flex text-accent mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-text-main text-lg italic mb-8 leading-relaxed">"I had a dental emergency on a Friday afternoon. They got me in immediately and fixed my broken tooth. The facility is beautiful and state-of-the-art. I've found my new permanent dentist."</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg shadow-primary/20">
                  MR
                </div>
                <div>
                  <h4 className="font-bold text-primary">Michael Rodriguez</h4>
                  <p className="text-sm text-text-muted">Emergency Patient</p>
                </div>
              </div>
            </motion.div>

            {/* Review 3 */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-10 rounded-3xl shadow-sm border border-pink-100 relative"
            >
              <div className="flex text-accent mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-text-main text-lg italic mb-8 leading-relaxed">"The Invisalign process here was seamless. They used a 3D scanner so I didn't have to do those awful goop impressions. My teeth look amazing and the pricing was very transparent."</p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mr-4 shadow-lg shadow-primary/20">
                  EL
                </div>
                <div>
                  <h4 className="font-bold text-primary">Emily Chen</h4>
                  <p className="text-sm text-text-muted">Orthodontic Patient</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Booking Form Section */}
      <section id="book-now" className="py-24 bg-secondary/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Online Booking</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Schedule Your Visit Today</h2>
              <p className="text-lg text-text-muted mb-8">Take the first step towards your perfect smile. Fill out the form and our team will contact you shortly to confirm your appointment.</p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <span className="font-bold text-primary">Fast & Easy Scheduling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <span className="font-bold text-primary">Personalized Consultations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <span className="font-bold text-primary">Expert Dental Team</span>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-pink-100"
            >
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Juan Dela Cruz"
                      className="w-full px-6 py-4 rounded-xl bg-background border-none focus:ring-2 focus:ring-accent transition-all font-medium"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="0912 345 6789"
                      className="w-full px-6 py-4 rounded-xl bg-background border-none focus:ring-2 focus:ring-accent transition-all font-medium"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="juan@example.com"
                    className="w-full px-6 py-4 rounded-xl bg-background border-none focus:ring-2 focus:ring-accent transition-all font-medium"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Preferred Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-6 py-4 rounded-xl bg-background border-none focus:ring-2 focus:ring-accent transition-all font-medium"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Reason for Visit</label>
                    <select 
                      required
                      className="w-full px-6 py-4 rounded-xl bg-background border-none focus:ring-2 focus:ring-accent transition-all font-medium appearance-none"
                      value={bookingForm.reason}
                      onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
                    >
                      <option value="">Select a service</option>
                      <option value="Consultation">Dental Consultation</option>
                      <option value="Cleaning">Oral Prophylaxis (Cleaning)</option>
                      <option value="Filling">Tooth Filling</option>
                      <option value="Braces">Orthodontic Treatment (Braces)</option>
                      <option value="Whitening">Teeth Whitening</option>
                      <option value="Other">Other Services</option>
                    </select>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full py-5 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center"><Sparkles className="w-5 h-5 mr-2 animate-pulse" /> Processing...</span>
                  ) : 'Confirm Booking'}
                </button>

                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold text-sm"
                  >
                    Booking request sent successfully! We'll contact you soon.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-bold text-sm"
                  >
                    Something went wrong. Please try again or call us directly.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Common Questions</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-pink-100 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left bg-background hover:bg-secondary/20 transition-colors"
                >
                  <span className="text-lg font-bold text-primary">{faq.q}</span>
                  {activeFaq === idx ? <Minus className="w-5 h-5 text-accent" /> : <Plus className="w-5 h-5 text-accent" />}
                </button>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-6 bg-white text-text-muted leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background pt-32 pb-16 border-t border-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-24">
            <div className="col-span-1">
              <span className="font-serif text-3xl font-black tracking-tighter text-primary block mb-8">PREMIUM<span className="text-accent">DENTAL</span></span>
              <p className="text-text-muted mb-10 leading-relaxed font-medium">Redefining the dental experience through artistic vision, clinical excellence, and uncompromising luxury in the heart of Beverly Hills.</p>
              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm group">
                  <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm group">
                  <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-serif font-bold text-primary mb-8">Expertise</h4>
              <ul className="space-y-4">
                <li><a href="#services" className="text-sm font-bold text-text-muted hover:text-accent transition-colors">General Dentistry</a></li>
                <li><a href="#services" className="text-sm font-bold text-text-muted hover:text-accent transition-colors">Orthodontics</a></li>
                <li><a href="#services" className="text-sm font-bold text-text-muted hover:text-accent transition-colors">Oral Surgery</a></li>
                <li><a href="#services" className="text-sm font-bold text-text-muted hover:text-accent transition-colors">Cosmetic Dentistry</a></li>
                <li><a href="#services" className="text-sm font-bold text-text-muted hover:text-accent transition-colors">Prosthodontics</a></li>
                <li><a href="#services" className="text-sm font-bold text-text-muted hover:text-accent transition-colors">Pediatric Care</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-serif font-bold text-primary mb-8">Sanctuary</h4>
              <ul className="space-y-8">
                <li className="flex items-start group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-accent transition-colors">
                    <MapPin className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-text-muted leading-relaxed">2228 Nakar St.,<br/>San Andres, Bukid, Manila</span>
                </li>
                <li className="flex items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-accent transition-colors">
                    <Phone className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-text-muted">09165184025 / 09176880050</span>
                </li>
                <li className="flex items-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-accent transition-colors">
                    <Mail className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-text-muted">hello@premiumdental.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-16 border-t border-secondary flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-text-muted/40">© 2026 PREMIUM DENTAL CLINIC. ARTISTRY IN EVERY SMILE.</p>
            <div className="flex space-x-10 text-[10px] uppercase tracking-[0.2em] font-black text-text-muted/40">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

