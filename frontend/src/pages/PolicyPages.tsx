import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Shipping & Delivery Policy' }]} />
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-3">
          Shipping & Delivery Policy
        </h1>
        <p>
          At BD Solar Energy, we understand that solar photovoltaic panels, heavy inverters, and lithium battery storage systems are fragile high-value assets requiring careful handling.
        </p>

        <h3 className="text-base font-bold text-gray-900 pt-2">1. Delivery Zones & Timelines</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Dhaka City Inside:</strong> Delivered within 24–48 hours via specialized vehicle.</li>
          <li><strong>Divisional Cities (Chittagong, Sylhet, Rajshahi, Khulna, etc.):</strong> Delivered within 48–72 hours via registered heavy freight courier.</li>
          <li><strong>Rural / Remote Upazilas:</strong> Delivered within 3–5 business days with direct phone coordination.</li>
        </ul>

        <h3 className="text-base font-bold text-gray-900 pt-2">2. Delivery Charges</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Orders ৳50,000 and above:</strong> 100% Free Nationwide Delivery.</li>
          <li><strong>Orders below ৳50,000 inside Dhaka:</strong> Flat ৳300 delivery fee.</li>
          <li><strong>Orders below ৳50,000 outside Dhaka:</strong> Flat ৳800 delivery fee.</li>
        </ul>

        <h3 className="text-base font-bold text-gray-900 pt-2">3. Wooden Crating & Transit Insurance</h3>
        <p>
          All solar panel consignments containing 2 or more panels are packed in custom wooden pallets. In the rare event of transit damage, customers must document photos upon delivery and our customer support hotline (+880 1700-SOLAR) will dispatch instant replacements.
        </p>
      </div>
    </div>
  );
};

export const WarrantyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Warranty & Returns' }]} />
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-3">
          Warranty & Return Policy
        </h1>
        <p>
          All equipment distributed by BD Solar Energy includes manufacturer warranty coverage and BSTI/IEC compliance.
        </p>

        <h3 className="text-base font-bold text-gray-900 pt-2">1. Standard Warranty Periods</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Solar Panels (Trina, Jinko, LONGi):</strong> 12-Year Product Warranty and 25 to 30-Year Linear Power Output Warranty (minimum 80% output at year 25).</li>
          <li><strong>Hybrid & Grid-Tied Inverters (Growatt, Deye, Huawei):</strong> 5-Year Replacement / Repair Warranty.</li>
          <li><strong>LiFePO4 Lithium Batteries (Pylontech, Felicity):</strong> 5 to 10-Year Factory Performance Warranty.</li>
          <li><strong>Circuit Breakers & Protection Gear (Schneider, ABB, Chint):</strong> 2-Year Replacement Warranty.</li>
        </ul>

        <h3 className="text-base font-bold text-gray-900 pt-2">2. 7-Day Return Policy</h3>
        <p>
          Uninstalled products in original unopened packaging can be returned within 7 days for exchange or credit. Installed electrical equipment or wires cut to custom lengths are non-returnable unless defective.
        </p>
      </div>
    </div>
  );
};
