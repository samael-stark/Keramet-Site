import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />

      <main className="bg-custom-bg min-h-screen">
        <PageHero title="Return Policy" label="Policies" crumbs={[{ label: "Return Policy" }]} />

        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">

          <div className="space-y-10 rounded-sm border border-line bg-paper p-6 text-[15px] leading-8 text-ink/80 md:p-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-ink [&_strong]:text-ink [&_a]:text-custom-accent [&_a]:underline">

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Returns</h2>
              <p className="mt-3">
                We want you to be satisfied with your purchase. If you are not
                fully satisfied, you may contact us within 14 days of receiving
                your order to request a return, in accordance with applicable consumer protection laws.
              </p>
              <p className="mt-3">
                To initiate a return, you must contact us at support@keramethali.com before sending any items back.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Return Conditions</h2>
              <p className="mt-3">
                Returned items must be in their original condition, unused,
                unwashed, and returned with original packaging where possible.
                Items showing signs of damage, misuse, alteration, or wear may
                not qualify for a refund.
              </p>
              <p className="mt-3">
                Returned products must include all original accessories, tags, and packaging if available.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Return Shipping Costs</h2>
              <p className="mt-3">
                Return shipping costs are the responsibility of the customer unless the item is defective, damaged, or incorrect.
              </p>
              <p className="mt-3">
                For international orders, the customer is responsible for all return shipping arrangements, costs, and any customs duties,
                import/export fees, or local taxes that may apply during return shipment.
              </p>
              <p className="mt-3">
                The SELLER is not responsible for delays, loss, or retention of returned shipments by customs authorities or carriers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Refunds</h2>
              <p className="mt-3">
                Once the returned item is received and inspected, approved refunds will be issued to the original payment method.
              </p>
              <p className="mt-3">
                Refund processing time may vary depending on the customer’s bank or payment provider (typically 5–14 business days after approval).
              </p>
              <p className="mt-3">
                Original shipping costs are non-refundable unless the return is due to our error (wrong or defective item).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Non-Returnable Cases</h2>
              <p className="mt-3">
                Custom-made, altered, or specially requested items may not be eligible for return unless they arrive damaged or incorrect.
              </p>
              <p className="mt-3">
                For hygiene and safety reasons, certain items may also be excluded from return eligibility if applicable under law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">Proof of Return</h2>
              <p className="mt-3">
                Customers are advised to retain proof of shipment and tracking information for returned items.
                We are not responsible for items lost or delayed during return transit.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
