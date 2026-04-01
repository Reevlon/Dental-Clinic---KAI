import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Calendar, 
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
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { getDocFromServer, doc } from 'firebase/firestore';
import { db } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    reason: 'General Checkup'
  });
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  const galleryItems = [
    {
      title: "Smile Makeover",
      desc: "Full porcelain veneers for a natural, radiant look.",
      image: "https://images.unsplash.com/photo-1594539829975-015de12217f1?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Invisalign Results",
      desc: "Perfectly aligned teeth in just 12 months.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Teeth Whitening",
      desc: "8 shades brighter in a single 60-minute session.",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const team = [
    {
      name: "Dr. Elena Rose",
      role: "Lead Cosmetic Dentist",
      bio: "15+ years experience in aesthetic restorations and smile design.",
      image: "https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?q=80&w=400&auto=format&fit=crop"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', message: 'Submitting your request...' });

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({ type: 'success', message: data.message });
        setFormData({ name: '', phone: '', email: '', date: '', reason: 'General Checkup' });
      } else {
        setFormStatus({ type: 'error', message: data.message || 'Failed to submit booking.' });
      }
    } catch (error) {
      console.error(error);
      setFormStatus({ type: 'error', message: 'Network error or validation failed. Please try calling us instead.' });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus({ type: 'loading', message: 'Subscribing...' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNewsletterStatus({ type: 'success', message: data.message });
        setNewsletterEmail('');
      } else {
        setNewsletterStatus({ type: 'error', message: data.message || 'Failed to subscribe.' });
      }
    } catch (error) {
      console.error(error);
      setNewsletterStatus({ type: 'error', message: 'Failed to connect. Please try again later.' });
    }
  };

  return (
    <div className="min-h-screen font-sans text-text-main bg-background">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> 123 Smile Avenue, Beverly Hills, CA</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Mon-Fri: 8am - 6pm</span>
          </div>
          <div className="flex items-center font-semibold">
            <Phone className="w-4 h-4 mr-2" /> Call us: (555) 019-8372
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span className="font-serif text-2xl font-bold text-primary">Premium Dental</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-text-main hover:text-primary transition-colors font-medium">Services</a>
              <a href="#emergency" className="text-text-main hover:text-primary transition-colors font-medium">Emergency</a>
              <a href="#why-us" className="text-text-main hover:text-primary transition-colors font-medium">Why Us</a>
              <a href="#testimonials" className="text-text-main hover:text-primary transition-colors font-medium">Patient Stories</a>
              <a href="#booking" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md">
                Book Online
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
              <a href="#emergency" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-text-main hover:text-primary border-b border-gray-50 pb-2">Emergency Care</a>
              <a href="#why-us" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-text-main hover:text-primary border-b border-gray-50 pb-2">Why Us</a>
              <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold text-text-main hover:text-primary border-b border-gray-50 pb-2">Patient Stories</a>
              <a href="#booking" onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold text-accent pt-2">Book Online</a>
              
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
      <section className="relative bg-secondary/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12 z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary leading-tight mb-6"
            >
              Experience Premium, <br/>
              <span className="text-accent">Pain-Free</span> Dentistry.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-text-muted mb-8 max-w-lg"
            >
              State-of-the-art technology meets compassionate care. Get the confident smile you deserve without the anxiety, at a price you can afford.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <a href="#booking" className="bg-accent hover:bg-accent-hover text-white text-center px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Book Your Free Consultation
              </a>
              <a href="tel:5550198372" className="bg-white border-2 border-primary text-primary hover:bg-primary/5 text-center px-8 py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" /> (555) 019-8372
              </a>
            </motion.div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop" 
                alt="Smiling patient with dentist" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center">
                <div className="flex -space-x-2 mr-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Patient" />
                  ))}
                </div>
                <div>
                  <div className="flex text-accent">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-semibold text-primary">500+ Happy Patients</p>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-secondary rounded-full opacity-50 blur-3xl -z-0"></div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-text-muted uppercase tracking-wider mb-6">Trusted By Major Insurance Providers & Accredited By</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Logos using text for demonstration, in reality these would be SVGs */}
            <div className="text-xl font-bold font-serif">Delta Dental</div>
            <div className="text-xl font-bold font-serif">Cigna</div>
            <div className="text-xl font-bold font-serif">MetLife</div>
            <div className="text-xl font-bold font-serif">Aetna</div>
            <div className="text-xl font-bold font-serif">ADA Accredited</div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Sparkles className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Cosmetic Dentistry</h3>
              <p className="text-text-muted mb-6">Transform your smile with professional whitening, porcelain veneers, and Invisalign clear aligners.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Teeth Whitening</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Porcelain Veneers</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Invisalign</li>
              </ul>
              <a href="#booking" className="text-primary font-bold hover:text-accent transition-colors flex items-center group/link">
                Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </a>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <Shield className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">General Dentistry</h3>
              <p className="text-text-muted mb-6">Preventative care to keep your teeth and gums healthy for a lifetime. Gentle cleanings and thorough exams.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Routine Cleanings</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Digital X-Rays</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Cavity Fillings</li>
              </ul>
              <a href="#booking" className="text-primary font-bold hover:text-accent transition-colors flex items-center group/link">
                Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </a>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-pink-100 group"
            >
              <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-6 transition-all duration-300">
                <HeartPulse className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-3">Emergency Care</h3>
              <p className="text-text-muted mb-6">Experiencing dental pain? We offer same-day emergency appointments to get you out of pain fast.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Toothaches</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Broken Teeth</li>
                <li className="flex items-center text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-accent mr-3" /> Root Canals</li>
              </ul>
              <a href="#booking" className="text-primary font-bold hover:text-accent transition-colors flex items-center group/link">
                Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section id="emergency" className="py-24 bg-red-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border-2 border-red-100 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Dental Emergency? <br/><span className="text-red-600">We've Got You Covered.</span></h2>
              <p className="text-lg text-text-muted mb-8">Dental pain can't wait. Whether it's a broken tooth, severe ache, or lost filling, we prioritize emergency cases and offer same-day relief.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-center p-4 bg-red-50/50 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-red-600 mr-3" />
                  <span className="font-bold text-primary">Same-Day Appointments</span>
                </div>
                <div className="flex items-center p-4 bg-red-50/50 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-red-600 mr-3" />
                  <span className="font-bold text-primary">Immediate Pain Relief</span>
                </div>
                <div className="flex items-center p-4 bg-red-50/50 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-red-600 mr-3" />
                  <span className="font-bold text-primary">Weekend Availability</span>
                </div>
                <div className="flex items-center p-4 bg-red-50/50 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-red-600 mr-3" />
                  <span className="font-bold text-primary">Expert Emergency Team</span>
                </div>
              </div>

              <a href="tel:5550198372" className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-lg shadow-red-200 hover:-translate-y-1">
                <Phone className="w-6 h-6 mr-3" /> Call (555) 019-8372 Now
              </a>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop" 
                alt="Emergency Dental Care" 
                className="rounded-[2rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Smile Gallery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Smile Gallery</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Transformations That Speak for Themselves</h2>
            </div>
            <a href="#booking" className="mt-6 md:mt-0 text-primary font-bold flex items-center hover:text-accent transition-colors">
              View All Results <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <h4 className="text-white text-2xl font-serif font-bold mb-2">{item.title}</h4>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
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
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop" 
                  alt="Modern dental equipment" 
                  className="rounded-3xl shadow-2xl border-8 border-white/10"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent rounded-full blur-3xl opacity-20 -z-0"></div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">The Premium Difference</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">Why Choose Premium Dental?</h2>
              <p className="text-lg text-white/80 mb-12 leading-relaxed">
                We've completely reimagined the dental experience. No more clinical coldness or anxiety. We combine a luxury spa-like atmosphere with the world's most advanced dental technology.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <HeartPulse className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">Anxiety-Free</h4>
                  <p className="text-white/60 text-sm">Noise-canceling headphones, weighted blankets, and gentle sedation options.</p>
                </div>
                
                <div className="flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">3D Technology</h4>
                  <p className="text-white/60 text-sm">No messy impressions. We use high-precision 3D digital scanning for everything.</p>
                </div>

                <div className="flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">Expert Team</h4>
                  <p className="text-white/60 text-sm">Our specialists are leaders in cosmetic and restorative dentistry.</p>
                </div>

                <div className="flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold font-serif mb-2">Top Rated</h4>
                  <p className="text-white/60 text-sm">Voted #1 Dental Clinic in Beverly Hills for 3 consecutive years.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Financing */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                  <Wallet className="w-10 h-10 text-primary mb-4" />
                  <h4 className="font-bold text-primary mb-2">0% Financing</h4>
                  <p className="text-xs text-text-muted">Available through CareCredit & Sunbit</p>
                </div>
                <div className="bg-secondary/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                  <Shield className="w-10 h-10 text-primary mb-4" />
                  <h4 className="font-bold text-primary mb-2">PPO Accepted</h4>
                  <p className="text-xs text-text-muted">We work with most major providers</p>
                </div>
                <div className="col-span-2 bg-primary p-8 rounded-3xl text-white">
                  <h4 className="text-xl font-serif font-bold mb-4">No Insurance? No Problem.</h4>
                  <p className="text-sm text-white/70 mb-6">Ask about our Premium Dental Membership Plan for exclusive savings on all treatments.</p>
                  <a href="#booking" className="inline-flex items-center text-accent font-bold hover:underline">
                    Learn About Membership <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Affordable Excellence</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">Premium Care That Fits Your Budget</h2>
              <p className="text-lg text-text-muted mb-8">We believe financial barriers should never stand between you and a healthy smile. Our patient coordinators work tirelessly to maximize your insurance benefits and find a payment plan that works for you.</p>
              <div className="flex flex-wrap gap-6 opacity-40 grayscale">
                <span className="text-xl font-bold font-serif">Delta Dental</span>
                <span className="text-xl font-bold font-serif">Cigna</span>
                <span className="text-xl font-bold font-serif">MetLife</span>
                <span className="text-xl font-bold font-serif">Aetna</span>
                <span className="text-xl font-bold font-serif">BlueCross</span>
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

      {/* Blog/News Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Dental Education</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Latest From Our Dental Blog</h2>
            </div>
            <a href="#" className="mt-6 md:mt-0 text-primary font-bold flex items-center hover:text-accent transition-colors">
              Read All Articles <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "5 Tips for a Brighter Smile at Home",
                category: "Oral Health",
                image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop",
                date: "March 28, 2026"
              },
              {
                title: "Is Invisalign Right for You? A Guide",
                category: "Orthodontics",
                image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop",
                date: "March 15, 2026"
              },
              {
                title: "The Truth About Dental Implants",
                category: "Restorative",
                image: "https://images.unsplash.com/photo-1594539829975-015de12217f1?q=80&w=600&auto=format&fit=crop",
                date: "March 02, 2026"
              }
            ].map((post, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-50"
              >
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-accent text-xs font-bold uppercase tracking-widest">{post.category}</span>
                    <span className="text-text-muted text-xs">{post.date}</span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-primary mb-4 leading-tight hover:text-accent cursor-pointer transition-colors">{post.title}</h4>
                  <a href="#" className="text-primary font-bold text-sm flex items-center group">
                    Read More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
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

      {/* Newsletter Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Join Our Smile Community</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">Subscribe to get exclusive dental tips, special offers, and clinic updates delivered straight to your inbox.</p>
          
          {newsletterStatus.type === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-white max-w-md mx-auto"
            >
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
              <p className="text-white/70">{newsletterStatus.message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <button 
                type="submit"
                disabled={newsletterStatus.type === 'loading'}
                className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center justify-center whitespace-nowrap"
              >
                {newsletterStatus.type === 'loading' ? 'Joining...' : (
                  <>
                    Subscribe <Send className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
          {newsletterStatus.type === 'error' && (
            <p className="text-red-300 mt-4 text-sm">{newsletterStatus.message}</p>
          )}
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-pink-100">
            {/* Form Side */}
            <div className="lg:w-3/5 p-8 md:p-16">
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Online Booking</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Request an Appointment</h2>
              <p className="text-text-muted mb-10 text-lg">Fill out the form below and our scheduling coordinator will contact you to confirm your appointment time.</p>
              
              {formStatus.type === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 text-green-800 rounded-3xl p-10 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Request Received!</h3>
                  <p className="text-lg mb-8">{formStatus.message}</p>
                  <button 
                    onClick={() => setFormStatus({ type: 'idle', message: '' })}
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors"
                  >
                    Book another appointment
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg"
                        placeholder="(555) 000-0000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider">Preferred Date *</label>
                      <input 
                        type="date" 
                        id="date" 
                        name="date" 
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider">Reason for Visit *</label>
                    <select 
                      id="reason" 
                      name="reason"
                      required
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-lg appearance-none"
                    >
                      <option value="General Checkup">General Checkup & Cleaning</option>
                      <option value="Tooth Pain / Emergency">Tooth Pain / Emergency</option>
                      <option value="Cosmetic Consultation">Cosmetic Consultation (Whitening, Veneers)</option>
                      <option value="Invisalign">Invisalign / Orthodontics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formStatus.type === 'error' && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                      {formStatus.message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={formStatus.type === 'loading'}
                    className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-1 flex justify-center items-center text-xl"
                  >
                    {formStatus.type === 'loading' ? (
                      <>
                        <Clock className="animate-spin w-6 h-6 mr-3" />
                        Processing...
                      </>
                    ) : 'Request Appointment'}
                  </button>
                  <p className="text-sm text-text-muted text-center mt-6">
                    By submitting this form, you agree to our <a href="#" className="underline hover:text-accent">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
            
            {/* Info Side */}
            <div className="lg:w-2/5 bg-primary p-8 md:p-16 flex flex-col justify-center text-white">
              <h3 className="text-3xl font-serif font-bold mb-10">Contact Information</h3>
              
              <div className="space-y-10">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Location</h4>
                    <p className="text-white/70 text-lg leading-relaxed">123 Smile Avenue<br/>Beverly Hills, CA 90210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Phone</h4>
                    <p className="text-white/70 text-lg">(555) 019-8372</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Email</h4>
                    <p className="text-white/70 text-lg">hello@premiumdental.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Hours</h4>
                    <div className="space-y-2 mt-3 text-white/70">
                      <div className="flex justify-between w-64"><span>Mon - Fri</span><span>8:00 AM - 6:00 PM</span></div>
                      <div className="flex justify-between w-64"><span>Saturday</span><span>9:00 AM - 2:00 PM</span></div>
                      <div className="flex justify-between w-64"><span>Sunday</span><span>Closed</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <span className="font-serif text-3xl font-bold text-primary block mb-6">Premium Dental</span>
              <p className="text-text-muted mb-8 leading-relaxed">Providing world-class dental care with a focus on comfort, technology, and artistic excellence in Beverly Hills.</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#services" className="text-text-muted hover:text-accent transition-colors">Our Services</a></li>
                <li><a href="#why-us" className="text-text-muted hover:text-accent transition-colors">Why Choose Us</a></li>
                <li><a href="#testimonials" className="text-text-muted hover:text-accent transition-colors">Patient Stories</a></li>
                <li><a href="#emergency" className="text-text-muted hover:text-accent transition-colors">Emergency Care</a></li>
                <li><a href="#booking" className="text-text-muted hover:text-accent transition-colors">Book Appointment</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-sm">Our Services</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-muted hover:text-accent transition-colors">Cosmetic Dentistry</a></li>
                <li><a href="#" className="text-text-muted hover:text-accent transition-colors">Teeth Whitening</a></li>
                <li><a href="#" className="text-text-muted hover:text-accent transition-colors">Invisalign</a></li>
                <li><a href="#" className="text-text-muted hover:text-accent transition-colors">Dental Implants</a></li>
                <li><a href="#" className="text-text-muted hover:text-accent transition-colors">General Checkups</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-primary mb-6 uppercase tracking-widest text-sm">Contact Us</h4>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-text-muted">123 Smile Avenue, Beverly Hills, CA 90210</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-text-muted">(555) 019-8372</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                  <span className="text-text-muted">hello@premiumdental.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-text-muted text-sm">© 2026 Premium Dental Clinic. All rights reserved.</p>
            <div className="flex space-x-8 text-sm text-text-muted">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile CTA */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <a 
          href="#booking" 
          className="flex items-center justify-center bg-accent text-white font-bold py-4 rounded-full shadow-2xl shadow-accent/40 text-lg"
        >
          <Calendar className="w-5 h-5 mr-2" /> Book Appointment
        </a>
      </div>

      {/* Final CTA / Lead Magnet */}
      <section className="bg-accent py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">New Patient Special: $99 Exam & X-Rays</h2>
          <p className="text-xl text-white/90 mb-8">Take the first step towards a healthier, more beautiful smile. Offer valid for new patients without insurance.</p>
          <a href="#booking" className="inline-block bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:-translate-y-1">
            Claim Offer & Book Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white/80 py-12 border-t border-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <span className="font-serif text-2xl font-bold text-white mb-4 block">Premium Dental</span>
              <p className="text-sm mb-4">Providing world-class, pain-free dentistry to the Beverly Hills community.</p>
              <div className="flex space-x-4">
                {/* Social Icons Placeholders */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent cursor-pointer transition-colors">
                  <span className="text-xs">FB</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent cursor-pointer transition-colors">
                  <span className="text-xs">IG</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-accent transition-colors">Our Services</a></li>
                <li><a href="#why-us" className="hover:text-accent transition-colors">Why Choose Us</a></li>
                <li><a href="#testimonials" className="hover:text-accent transition-colors">Patient Reviews</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Financing Options</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Cosmetic Dentistry</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">General Dentistry</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Emergency Care</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Invisalign</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Newsletter</h4>
              <p className="text-sm mb-4">Subscribe for dental tips and exclusive offers.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="px-4 py-2 w-full rounded-l-md text-text-main bg-white border border-white focus:ring-2 focus:ring-accent outline-none"
                />
                <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} Premium Dental Clinic. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

