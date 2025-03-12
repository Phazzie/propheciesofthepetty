import React, { useState } from 'react';

/**
 * Represents a subscription tier's information.
 */
export interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  features: string[];
}

// Dummy subscription data - in a real app, this might be fetched from an API
const mockTiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99/mo',
    features: ['Access to basic readings', 'Limited daily quotes']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99/mo',
    features: ['Unlimited readings', 'Daily personalized insights', 'Priority support']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29.99/mo',
    features: ['All Premium features', 'Exclusive monthly webinars', 'Advanced analytics']
  }
];

/**
 * SubscriptionTiers component displays available subscription tiers and allows selection.
 * 
 * Inline comments mark key sections:
 * - Data mapping using mock tiers
 * - UI rendering with inline commentary for dynamic data
 * 
 * @returns {JSX.Element} The rendered subscription tiers interface
 */
const SubscriptionTiers: React.FC = () => {
  // State to hold the currently selected tier
  const [selectedTier, setSelectedTier] = useState<string>('');

  /**
   * Handler to update the selected subscription tier.
   * @param tierId The id of the selected tier
   */
  const selectTier = (tierId: string) => {
    setSelectedTier(tierId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Choose Your Subscription Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTiers.map((tier) => (
          <div
            key={tier.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-100 ${
              selectedTier === tier.id ? 'border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => selectTier(tier.id)}
          >
            {/* Inline comment: Display tier name and pricing */}
            <h2 className="text-xl font-semibold mb-2">{tier.name}</h2>
            <p className="text-lg mb-2">{tier.price}</p>
            {/* Inline comment: List the features of the subscription tier */}
            <ul className="list-disc list-inside mb-2">
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            {/* Inline comment: Indicate if this tier is selected */}
            {selectedTier === tier.id && (
              <p className="text-green-600 font-bold">Selected</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTiers;
