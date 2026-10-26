import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Sun, Zap, BatteryCharging, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'Solar Energy',
    question: 'How does Net-Metering work in Bangladesh (DESCO, DPDC, BREB)?',
    answer: 'Under Bangladesh SREDA Net-Metering Guidelines, three-phase grid-tied solar systems export surplus daytime solar electricity to the utility grid. A bidirectional bi-directional smart meter tracks imported vs exported electricity, crediting your monthly bill and slashing factory or residential expenses by up to 70-80%.'
  },
  {
    category: 'Inverters',
    question: 'What is the difference between On-Grid, Off-Grid, and Hybrid Inverters?',
    answer: 'On-Grid inverters shut down during grid blackout for linemen safety (anti-islanding) and do not use batteries. Off-Grid inverters work strictly with battery banks in locations without utility electricity. Hybrid inverters provide the best of both worlds: they export excess power during the day and automatically switch to lithium battery backup within 10 milliseconds during load-shedding.'
  },
  {
    category: 'Batteries',
    question: 'Why choose LiFePO4 (Lithium Iron Phosphate) over Traditional Tubular Batteries?',
    answer: 'LiFePO4 batteries offer over 6,000 charge cycles (10-15 years life) compared to 1,200 cycles (3-4 years) for tubular lead-acid batteries. They allow 90-95% Depth of Discharge without degradation, require zero water topping, produce no corrosive acid fumes, and occupy 70% less floor space.'
  },
  {
    category: 'Electrical Wiring',
    question: 'Can I use regular domestic PVC wire for solar panel connections?',
    answer: 'No. Rooftop solar panels output high DC voltages (up to 1000V DC) and endure intense UV sunlight and rain. Regular domestic AC wires degrade rapidly outdoors, leading to insulation breakdown and fire hazards. Certified Solar DC cables (such as BRB 4mm² or 6mm² XLPO) are halogen-free, UV-resistant, and rated for 25+ years of direct outdoor exposure.'
  },
  {
    category: 'Protection',
    question: 'Do I need Surge Protection (SPD) for my solar installation?',
    answer: 'Yes! Solar panels mounted on rooftops are prime targets for lightning-induced electrical surges during Bangladesh thunderstorm seasons. Installing Class II DC Surge Protection Devices (SPD) on the DC side and AC SPD on the output protects inverters from destructive transient voltage spikes.'
  },
  {
    category: 'Orders & Shipping',
    question: 'How are heavy solar panels and glass modules safely transported nationwide?',
    answer: 'We pack solar panels and lithium storage racks in reinforced industrial wooden crating with foam corner guards. We ship via specialized heavy transport couriers across all 64 districts in Bangladesh with 100% transit insurance against breakage.'
  },
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">
          Solar Knowledge Base
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Clear, verified technical answers to help you select the ideal solar panels, hybrid inverters, cables, and circuit breakers.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        {FAQ_DATA.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 text-left font-semibold text-xs sm:text-sm text-gray-900 hover:text-[#16A34A] bg-gray-50/50 hover:bg-green-50/40 flex items-center justify-between gap-4 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 sm:p-5 text-xs sm:text-sm text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
