import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Zap, 
  ShieldCheck, 
  Award, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Truck
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-10">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0B1E13] via-[#166534] to-[#15803D] rounded-3xl p-8 sm:p-14 text-white shadow-xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/20">
          <Sun className="w-3.5 h-3.5" />
          <span>About BD Solar Energy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
          Pioneering Clean Solar Energy & Reliable Electrical Solutions
        </h1>
        <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed">
          Founded by certified electrical engineers in Dhaka, BD Solar Energy is on a mission to deliver tier-1 solar technology, certified cables, and safe electrical protection to homes, businesses, and industrial factories across Bangladesh.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#15803D] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-gray-900">Genuine Tier 1 Hardware</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            We partner directly with world-leading PV manufacturers (Trina, Jinko, Growatt, Deye, Huawei) and Bangladesh’s premier cable makers (BRB, BBS) to guarantee 100% genuine equipment with verified barcode traceability.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-gray-900">Certified Solar Engineers</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our engineering team conducts technical string calculations, shadow azimuth studies, and net-metering approvals under Bangladesh SREDA guidelines to ensure peak generation and electrical safety.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-gray-900">Nationwide Safe Logistics</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Solar glass panels and high-capacity lithium batteries require specialized handling. We build reinforced wooden crates and deliver safely to residential rooftops and remote rural locations in all 64 districts.
          </p>
        </div>
      </div>

      {/* Showroom & Operations */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
            Dhaka Experience Showroom
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Visit Our Live Testing & Demonstration Center
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Experience working hybrid solar setups, observe live MPPT telemetric graphs, test Schneider breakers on our live circuit simulator, and consult with our technical specialists in person.
          </p>
          <div className="space-y-2 text-xs text-gray-700 pt-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#15803D]" />
              <span>Level 7, Solar Bhaban, 42 Motijheel C/A, Dhaka-1000, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Open Saturday through Thursday: 9:00 AM – 7:00 PM</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-emerald-950">
          <img
            src="/images/solar-panel.svg"
            alt="BD Solar Experience Showroom"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
