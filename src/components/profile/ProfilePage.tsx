import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

interface User {
  email: string;
  username?: string;
}

// Define subscription types
type SubscriptionAction = 'upgrade' | 'downgrade' | 'cancel' | 'subscribe';
interface Subscription {
  plan: string;
  status: string;
}
interface SubscriptionContextType {
  subscription: Subscription | null;
  updateSubscription: (action: SubscriptionAction) => void;
}

const SubscriptionContext = React.createContext<SubscriptionContextType | null>(null);

/**
 * ProfilePage component displays user information along with subscription management options.
 * 
 * This component integrates data from AuthContext and SubscriptionContext to show current user details and
 * subscription status. It provides options to upgrade, downgrade, or cancel the subscription.
 * 
 * @returns {JSX.Element} The rendered profile page.
 */
const ProfilePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const subscriptionCtx = useContext(SubscriptionContext);
  
  if (!auth?.user) {
    return <div>Loading user information...</div>;
  }

  const user = auth.user as User;
  const { subscription, updateSubscription } = subscriptionCtx || {};
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="mb-4">
        <p><strong>Username:</strong> {user.username || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Subscription Details</h2>
        {subscription ? (
          <div>
            <p><strong>Plan:</strong> {subscription.plan}</p>
            <p><strong>Status:</strong> {subscription.status}</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2" 
              onClick={() => updateSubscription?.('upgrade')}>
              Upgrade Plan
            </button>
            <button 
              className="px-4 py-2 bg-yellow-500 text-white rounded mr-2" 
              onClick={() => updateSubscription?.('downgrade')}>
              Downgrade Plan
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded" 
              onClick={() => updateSubscription?.('cancel')}>
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div>
            <p>No subscription found. Please subscribe to a plan.</p>
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => updateSubscription?.('subscribe')}>
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
