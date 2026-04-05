import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, FileText, Accessibility as AccessibilityIcon, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KaiLogo } from './Logo';

const LegalLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-text-main">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center text-primary hover:text-accent transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
          <Link to="/" className="flex items-center group">
            <KaiLogo className="w-10 h-10 mr-2 text-accent" />
            <div className="font-serif text-2xl font-black tracking-tighter text-primary">
              K.A.I <span className="text-accent">DENTAL CLINIC</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-accent">
              {icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-primary tracking-tight">{title}</h1>
          </div>
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:text-text-muted prose-strong:text-primary prose-li:text-text-muted">
            {children}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-text-muted/40">
            © 2026 K.A.I DENTAL CLINIC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy" icon={<Shield className="w-8 h-8" />}>
    <p className="mb-8">
      At K.A.I Dental Clinic, we are committed to protecting your personal and sensitive personal information in accordance with <strong>Republic Act No. 10173</strong>, also known as the <strong>Data Privacy Act of 2012 (DPA)</strong> of the Philippines.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">1. Information We Collect</h2>
    <p>We collect personal data necessary for providing dental care and related services, including but not limited to:</p>
    <ul className="list-disc pl-6 mb-8 space-y-2">
      <li>Full name, address, and contact details (phone, email).</li>
      <li>Date of birth, gender, and civil status.</li>
      <li>Medical and dental history, including X-rays and treatment records.</li>
      <li>Insurance information and billing details.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-12 mb-6">2. Purpose of Collection</h2>
    <p>Your information is collected and processed for the following purposes:</p>
    <ul className="list-disc pl-6 mb-8 space-y-2">
      <li>Diagnosis and provision of dental treatments.</li>
      <li>Managing appointments and sending reminders.</li>
      <li>Processing payments and insurance claims.</li>
      <li>Compliance with legal and regulatory requirements (e.g., Department of Health).</li>
    </ul>

    <h2 className="text-2xl font-bold mt-12 mb-6">3. Data Storage and Retention</h2>
    <p>
      We implement strict security measures to protect your data from unauthorized access, alteration, or disclosure. In compliance with Philippine medical record laws, dental records are typically retained for at least <strong>15 years</strong> from the date of the last visit.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">4. Your Rights</h2>
    <p>Under the DPA, you have the right to:</p>
    <ul className="list-disc pl-6 mb-8 space-y-2">
      <li>Be informed of the processing of your data.</li>
      <li>Access and correct your personal information.</li>
      <li>Object to processing or request erasure (subject to legal retention requirements).</li>
      <li>File a complaint with the National Privacy Commission (NPC).</li>
    </ul>

    <h2 className="text-2xl font-bold mt-12 mb-6">5. Contact Us</h2>
    <p>For any privacy-related concerns, please contact our Data Protection Officer:</p>
    <div className="bg-secondary/20 p-6 rounded-2xl mt-6">
      <p className="flex items-center gap-3 mb-2 font-bold text-primary">K.A.I Dental Clinic</p>
      <p className="flex items-center gap-3 mb-2"><Mail className="w-4 h-4 text-accent" /> kaidentalph@gmail.com</p>
      <p className="flex items-center gap-3 mb-2"><Phone className="w-4 h-4 text-accent" /> 09165184025</p>
      <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-accent" /> 2228 Nakar St., San Andres, Bukid, Manila</p>
    </div>
  </LegalLayout>
);

export const TermsOfService = () => (
  <LegalLayout title="Terms of Service" icon={<FileText className="w-8 h-8" />}>
    <p className="mb-8">
      Welcome to the K.A.I Dental Clinic website. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">1. Use of Website</h2>
    <p>
      The content on this website is for general informational purposes only and does not constitute professional dental or medical advice. Always seek the advice of a qualified dental professional for any questions regarding a dental condition.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">2. Appointment Booking</h2>
    <p>
      Online bookings are subject to confirmation by our staff. We reserve the right to reschedule or cancel appointments due to unforeseen circumstances. Please provide at least <strong>24 hours notice</strong> for cancellations.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">3. Payment Terms</h2>
    <p>
      Fees for services are due at the time of treatment unless otherwise arranged. We accept cash, major credit cards, and select insurance providers. Patients are responsible for any costs not covered by insurance.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">4. Intellectual Property</h2>
    <p>
      All content on this website, including text, graphics, logos, and images, is the property of K.A.I Dental Clinic and is protected by Philippine and international copyright laws.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">5. Limitation of Liability</h2>
    <p>
      K.A.I Dental Clinic shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website or its services.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">6. Governing Law</h2>
    <p>
      These terms are governed by and construed in accordance with the laws of the <strong>Republic of the Philippines</strong>.
    </p>
  </LegalLayout>
);

export const Accessibility = () => (
  <LegalLayout title="Accessibility" icon={<AccessibilityIcon className="w-8 h-8" />}>
    <p className="mb-8">
      K.A.I Dental Clinic is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">1. Standards Followed</h2>
    <p>
      We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These guidelines explain how to make web content more accessible for people with a wide array of disabilities.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">2. Accessibility Features</h2>
    <p>Our website includes features such as:</p>
    <ul className="list-disc pl-6 mb-8 space-y-2">
      <li>High-contrast color schemes for better readability.</li>
      <li>Alt text for all meaningful images.</li>
      <li>Keyboard navigation support.</li>
      <li>Responsive design for various screen sizes and assistive devices.</li>
    </ul>

    <h2 className="text-2xl font-bold mt-12 mb-6">3. Ongoing Efforts</h2>
    <p>
      We recognize that accessibility is an ongoing process. We regularly review our website to identify and fix potential accessibility barriers.
    </p>

    <h2 className="text-2xl font-bold mt-12 mb-6">4. Feedback and Contact</h2>
    <p>
      If you encounter any accessibility barriers on our website or need assistance with our services, please let us know:
    </p>
    <div className="bg-secondary/20 p-6 rounded-2xl mt-6">
      <p className="flex items-center gap-3 mb-2 font-bold text-primary">K.A.I Dental Clinic</p>
      <p className="flex items-center gap-3 mb-2"><Mail className="w-4 h-4 text-accent" /> kaidentalph@gmail.com</p>
      <p className="flex items-center gap-3 mb-2"><Phone className="w-4 h-4 text-accent" /> 09165184025</p>
    </div>
  </LegalLayout>
);
