import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main className="bg-custom-bg min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <h1 className="text-4xl font-extrabold text-custom-accent">
            Privacy Policy
          </h1>

          <div className="mt-8 space-y-8 text-[#4e473f] leading-8">

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Overview</h2>
              <p className="mt-3">
                Keramet Rugs values your privacy and is committed to protecting your personal data.
                This Privacy Policy explains how we collect, use, store, and protect your information
                when you visit our website or make a purchase, in accordance with applicable data protection laws
                including international privacy standards such as GDPR principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Information We Collect</h2>
              <p className="mt-3">
                We may collect personal information including your name, surname, email address, phone number,
                billing and shipping address, payment details (processed securely by third-party providers),
                and order history when you use our website or place an order.
              </p>
              <p className="mt-3">
                We may also collect limited technical data such as IP address, browser type, and device information
                to improve website functionality and security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">How We Use Your Information</h2>
              <p className="mt-3">
                We use your personal information to process and deliver orders, provide customer support,
                communicate with you about your order, improve our services, prevent fraud, and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Legal Basis for Processing</h2>
              <p className="mt-3">
                We process your personal data based on contract performance (order processing),
                legal obligations (tax and accounting requirements), and legitimate interests
                (fraud prevention, service improvement, and customer communication).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Payment Security</h2>
              <p className="mt-3">
                All payments are processed securely through third-party payment providers.
                We do not store full credit card or debit card information on our servers.
              </p>
              <p className="mt-3">
                Payment processing is handled in compliance with industry security standards (such as PCI-DSS where applicable).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Cookies & Tracking Technologies</h2>
              <p className="mt-3">
                Our website may use cookies and similar tracking technologies to improve user experience,
                analyze traffic, and enhance website performance.
                You may disable cookies through your browser settings, but some features of the website may not function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Data Sharing</h2>
              <p className="mt-3">
                We do not sell your personal data.
              </p>
              <p className="mt-3">
                We may share limited data only with trusted third-party service providers such as payment processors,
                shipping companies, and IT service providers strictly for order fulfillment and operational purposes.
              </p>
              <p className="mt-3">
                Your data may be transferred internationally as part of order processing and delivery services,
                depending on your location and shipping destination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Data Retention</h2>
              <p className="mt-3">
                We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy,
                including legal, accounting, and tax obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Your Rights</h2>
              <p className="mt-3">
                Depending on your location, you may have rights to access, correct, update, or request deletion
                of your personal data. You may also object to or restrict certain processing activities,
                subject to legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Data Security</h2>
              <p className="mt-3">
                We implement reasonable technical and organizational measures to protect your personal data
                against unauthorized access, loss, misuse, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Contact</h2>
              <p className="mt-3">
                If you have any questions about this Privacy Policy or how your data is handled,
                you may contact Keramet Rugs through the contact information provided on our website.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
