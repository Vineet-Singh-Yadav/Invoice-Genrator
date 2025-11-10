import React from "react";
import "../css/learnMore.css";

export default function LearnMore() {
  return (
    <div className="learnMore">
      <section className="intro">
        <h1>Discover Invonex</h1>
        <p>
          Invonex is your intelligent invoicing partner — built to simplify billing,
          automate reminders, and give you control over your business finances
          with AI-powered accuracy.
        </p>
      </section>

      <section className="features">
        <h2>Powerful Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>💡 Smart Invoice Creation</h3>
            <p>
              Generate invoices in seconds with auto-filled details and customizable templates.
            </p>
          </div>
          <div className="feature-card">
            <h3>⏰ Automated Reminders</h3>
            <p>
              Never chase payments again. Set reminders that automatically notify your clients.
            </p>
          </div>
          <div className="feature-card">
            <h3>📊 Real-Time Insights</h3>
            <p>
              Get AI-powered analytics about your income, pending payments, and business trends.
            </p>
          </div>
          <div className="feature-card">
            <h3>🔒 Secure Cloud Storage</h3>
            <p>
              All your invoices and data are encrypted and safely stored in the cloud.
            </p>
          </div>
        </div>
      </section>

      <section className="howItWorks">
        <h2>How It Works</h2>
        <ol>
          <li>Sign up and set up your business profile.</li>
          <li>Add your products, clients, and payment details.</li>
          <li>Create invoices instantly using AI suggestions.</li>
          <li>Send, track, and manage payments from one dashboard.</li>
        </ol>
      </section>

      <section className="whyChoose">
        <h2>Why Choose Invonex?</h2>
        <ul>
          <li>✅ Saves hours of manual work every week.</li>
          <li>✅ Reduces late payments with auto-reminders.</li>
          <li>✅ Gives you professional, branded invoices instantly.</li>
          <li>✅ AI-driven reports help you make smarter business decisions.</li>
        </ul>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of businesses who simplified invoicing with Invonex.</p>
        <button onClick={() => window.location.href = "/signup"}>Get Started Now</button>
      </section>
    </div>
  );
}
