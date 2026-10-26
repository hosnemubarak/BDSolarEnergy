import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('residential');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please fill in your name, contact phone, and message.', 'error');
      return;
    }
    setIsSent(true);
    showToast('Your inquiry has been submitted! Our solar engineer will call you shortly.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Contact BD Solar Energy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have questions regarding inverter sizing, battery cycle endurance, or net-metering approvals in Bangladesh? Our team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
              Corporate Headquarters & Showroom
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5 border border-green-200">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Head Office & Live Showroom</div>
                  <div className="text-gray-600 mt-0.5">
                    Level 7, Solar Bhaban, 42 Motijheel Commercial Area, Dhaka-1000, Bangladesh
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5 border border-green-200">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Hotline & WhatsApp Support</div>
                  <div className="text-gray-600 mt-0.5">
                    +880 1700-SOLAR (76527) / +880 2-9568900
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Available 9:00 AM – 10:00 PM Daily
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5 border border-green-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Engineering & Orders Email</div>
                  <div className="text-gray-600 mt-0.5">
                    support@bdsolarenergy.com.bd
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Warehouses */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-6 space-y-2 text-xs text-gray-900">
            <h4 className="font-extrabold text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#16A34A]" />
              <span>Chittagong Distribution Hub</span>
            </h4>
            <p className="text-gray-600">
              Plot 18, Block B, Pahartali Industrial Zone, Chittagong. Direct pickup available for industrial cables & transformers.
            </p>
          </div>
        </div>

        {/* Right: Technical Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          <h3 className="font-extrabold text-lg text-gray-900 mb-1">
            Send an Engineering Inquiry / Request a Quote
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Fill out your requirements below and an electrical engineer will reach out to you within 2 hours.
          </p>

          {isSent ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-base text-emerald-950">
                Inquiry Submitted Successfully!
              </h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Thank you for contacting BD Solar Energy. Our technical engineer has received your inquiry and will contact your phone number.
              </p>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="mt-2 text-xs font-bold text-emerald-700 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Engr. Tanvir Ahmed"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Inquiry Purpose</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white cursor-pointer"
                >
                  <option value="residential">Residential Rooftop Solar System (1.5kW – 5kW)</option>
                  <option value="commercial">Commercial / Factory Net-Metering Package (10kW+)</option>
                  <option value="equipment">Wires, Cables & Circuit Breakers Bulk Supply</option>
                  <option value="support">Technical Support & Warranty Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Message or Project Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your rooftop area, current electricity bill, or equipment specifications required..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#16A34A] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Technical Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
