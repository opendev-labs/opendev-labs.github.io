/**
 * RAZORPAY PAYMENT PROTOCOL
 * Handles subscription materialization and marketplace transactions.
 */

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    limits: {
      projects: 3,
      storage: '100MB',
      aiCalls: 50,
      agentInteractions: 100,
    }
  },
  PRO: {
    name: 'Pro',
    price: 999, // ₹999/month (~$12)
    priceId: 'pro_monthly',
    limits: {
      projects: 'unlimited',
      storage: '10GB',
      aiCalls: 5000,
      agentInteractions: 'unlimited',
      features: ['deployments', 'custom-domain', 'priority-support']
    }
  },
  TEAM: {
    name: 'Team',
    price: 4999, // ₹4,999/month (~$60)
    priceId: 'team_monthly',
    limits: {
      projects: 'unlimited',
      storage: '100GB',
      aiCalls: 50000,
      seats: 5,
      features: ['deployments', 'custom-domain', 'priority-support', 'analytics']
    }
  }
};

/**
 * Initiates the Razorpay subscription handshake.
 */
export async function createSubscription(tier: keyof typeof SUBSCRIPTION_TIERS): Promise<any> {
    console.log(`💳 PAY_BRIDGE: Initiating handshake for ${tier} tier...`);
    
    // Placeholder for actual API call to Vercel/Razorpay
    // In production, this would call /api/payment/create-order
    const mockOrder = {
        orderId: 'order_mesh_' + Math.random().toString(36).substring(7),
        keyId: 'rzp_test_placeholder',
        amount: SUBSCRIPTION_TIERS[tier].price * 100
    };

    return new Promise((resolve, reject) => {
        const options = {
            key: mockOrder.keyId,
            amount: mockOrder.amount,
            currency: 'INR',
            name: 'OpenDev-Labs',
            description: `${tier} Subscription`,
            order_id: mockOrder.orderId,
            handler: (response: any) => {
                console.log("✅ PAY_BRIDGE: Verification Received", response);
                resolve({ success: true, ...response });
            },
            modal: {
                ondismiss: () => {
                    console.warn("⚠️ PAY_BRIDGE: Handshake Aborted by User");
                    reject(new Error('Payment cancelled'));
                }
            },
            theme: {
                color: "#000000"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    });
}
