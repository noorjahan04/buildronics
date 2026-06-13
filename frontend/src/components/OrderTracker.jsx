import './OrderTracker.css';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'packed', label: 'Packed', icon: '📦' },
  { key: 'shipped', label: 'Shipped', icon: '🚚' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

const CANCELLED_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'cancelled', label: 'Cancelled', icon: '❌' },
];

export default function OrderTracker({ order }) {
  const steps = order.orderStatus === 'cancelled' ? CANCELLED_STEPS : STATUS_STEPS;
  const currentIdx = steps.findIndex(s => s.key === order.orderStatus);

  return (
    <div className="order-tracker">
      <div className="tracker-steps">
        {steps.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={step.key} className={`tracker-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <div className="step-icon-wrap">
                <span className="step-icon">{step.icon}</span>
                {idx < steps.length - 1 && (
                  <div className={`step-line ${done ? 'done' : ''}`} />
                )}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Tracking events timeline */}
      {order.trackingEvents?.length > 0 && (
        <div className="tracking-events">
          <h4>Tracking History</h4>
          <div className="events-list">
            {[...order.trackingEvents].reverse().map((event, idx) => (
              <div key={idx} className="event-item">
                <div className="event-dot" />
                <div className="event-content">
                  <div className="event-status">{event.description}</div>
                  <div className="event-meta">
                    <span>{event.location}</span>
                    <span>{new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
