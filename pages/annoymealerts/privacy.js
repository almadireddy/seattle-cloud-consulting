import Head from 'next/head'

export default function PrivacyPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. This Privacy Policy explains how the
        AnnoyMeAlerts app collects, uses, and protects your information.
      </p>

      <h2>Information We Collect</h2>
      <p>
        AnnoyMeAlerts does not collect personally identifiable information. All
        routines and step data remain stored locally on your device or iCloud
      </p>

      <h2>How We Use Information</h2>
      <p>
        Information is only used to operate the app&rsquo;s features, such as displaying your routines and sending step-by-step reminders.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        The app does not share data with any third-party analytics or
        advertising partners.
      </p>

      <h2>Contact</h2>
      <p>If you have questions, email us at: annoymealertscontact@gmail.com</p>
    </div>
  );
}
