import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />

      <main className="bg-custom-bg min-h-screen">
        <PageHero title="Shipping Policy" label="Policies" crumbs={[{ label: "Shipping Policy" }]} />

        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">

          <div className="space-y-10 rounded-sm border border-line bg-paper p-6 text-[15px] leading-8 text-ink/80 md:p-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-ink [&_strong]:text-ink [&_a]:text-custom-accent [&_a]:underline">

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Processing Time</h2>
              <p className="mt-3">
                Orders are typically processed, shipped and delivered within 3–7 days unless otherwise stated.
                Processing time may be longer during peak seasons, holidays, or for handmade and custom-made rugs.
              </p>
              <p className="mt-3">
                Orders are only shipped after payment confirmation is completed successfully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Delivery</h2>
              <p className="mt-3">
                We offer worldwide shipping from Turkey. Most orders arrive within 3–7 days.
                Delivery times vary depending on the destination country, shipping carrier, and customs clearance procedures.
              </p>
              <p className="mt-3">
                Estimated delivery times are provided for reference only and are not guaranteed,
                as delays may occur due to external factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Tracking</h2>
              <p className="mt-3">
                Tracking information will be provided once your order has been shipped,
                allowing you to monitor your shipment through the carrier’s system when available.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Customs, Import Taxes & Duties</h2>
              <p className="mt-3">
                International orders may be subject to customs duties, import taxes, VAT, or other local charges
                imposed by the destination country.
              </p>
              <p className="mt-3">
                These charges are the sole responsibility of the customer and are not included in the product price or shipping fee.
              </p>
              <p className="mt-3">
                The SELLER is not responsible for delays, seizures, or additional charges caused by customs authorities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Delays & Force Majeure</h2>
              <p className="mt-3">
                We are not responsible for delays caused by shipping carriers, customs processing, weather conditions,
                strikes, wars, pandemics, or other events beyond our reasonable control.
              </p>
              <p className="mt-3">
                In such cases, delivery times may be extended without liability on the part of the SELLER.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Lost or Delayed Shipments</h2>
              <p className="mt-3">
                If a shipment is delayed or appears lost, we will cooperate with the shipping carrier to investigate the issue.
              </p>
              <p className="mt-3">
                However, final responsibility for delivery rests with the shipping carrier once the order has been dispatched.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Address Accuracy</h2>
              <p className="mt-3">
                Customers are responsible for providing complete and accurate shipping information.
                We are not responsible for delays or non-delivery caused by incorrect or incomplete addresses.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
