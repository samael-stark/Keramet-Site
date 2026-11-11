import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function TermsPage() {
  return (
    <>
      <Header />

      <main className="bg-custom-bg min-h-screen">
        <PageHero title="Terms & Conditions" label="Policies" crumbs={[{ label: "Terms & Conditions" }]} />

        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">

          <div className="space-y-10 rounded-sm border border-line bg-paper p-6 text-[15px] leading-8 text-ink/80 md:p-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-ink [&_strong]:text-ink [&_a]:text-custom-accent [&_a]:underline">

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">General</h2>
              <p className="mt-3">
                By accessing and using this website and placing an order, you agree to be bound by these Terms & Conditions.
                If you do not agree, you should not use this website or make any purchases.
              </p>
              <p className="mt-3">
                This website operates internationally and products are sold in United States Dollars (USD) unless otherwise stated at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Product Information</h2>
              <p className="mt-3">
                We aim to present all products as accurately as possible. However, since our rugs are handmade,
                slight variations in color, texture, size, and design may naturally occur and are not considered defects.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Pricing</h2>
              <p className="mt-3">
                All prices are displayed in USD and may be updated at any time without prior notice.
                We reserve the right to correct any pricing errors, typographical mistakes, or listing inaccuracies,
                even after an order has been placed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Orders</h2>
              <p className="mt-3">
                We reserve the right to accept, refuse, or cancel any order at our discretion.
                This may include cases involving pricing errors, stock availability, payment issues,
                suspected fraud, or violation of these Terms.
              </p>
              <p className="mt-3">
                If an order is canceled after payment, a full refund will be issued to the original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Shipping & Delivery</h2>
              <p className="mt-3">
                Shipping is handled in accordance with our Shipping Policy.
                Delivery times are estimates only and may vary due to customs, carrier delays, or external factors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Force Majeure</h2>
              <p className="mt-3">
                We are not liable for delays or failure to perform obligations due to events beyond our reasonable control,
                including but not limited to natural disasters, wars, strikes, pandemics, customs delays, or carrier disruptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Liability</h2>
              <p className="mt-3">
                To the maximum extent permitted by law, we are not responsible for indirect, incidental, or consequential damages
                arising from the use of this website or purchase of products, except where such limitation is not allowed under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Governing Law</h2>
              <p className="mt-3">
                These Terms & Conditions are governed by the laws of the Republic of Türkiye.
                However, if you are a consumer residing outside Türkiye, mandatory consumer protection laws in your country of residence may also apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Changes</h2>
              <p className="mt-3">
                We may update these Terms & Conditions at any time.
                Continued use of the website after changes are published means you accept the updated version.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
