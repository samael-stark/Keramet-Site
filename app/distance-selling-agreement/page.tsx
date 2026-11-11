import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function DistanceSalesAgreementPage() {
  return (
    <>
      <Header />

      <main className="bg-custom-bg min-h-screen">
        <PageHero title="Distance Sales Agreement" label="Policies" crumbs={[{ label: "Distance Sales Agreement" }]} />

        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-14">

          <div className="space-y-10 rounded-sm border border-line bg-paper p-6 text-[15px] leading-8 text-ink/80 md:p-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-ink [&_strong]:text-ink [&_a]:text-custom-accent [&_a]:underline">

            {/* 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">1. PARTIES</h2>

              <p className="mt-3">
                This Agreement has been signed between the following parties.
              </p>

              <p className="mt-3">
                <strong>BUYER</strong> – Name/Surname & Address provided during checkout.
              </p>

              <p className="mt-3">
                <strong>SELLER</strong> – Keramet Halı Handmade Rugs & Kilims <br />
                Address: BÜYÜK MİLAS HAN, Hobyar, Cemal Nadir Sk. NO:24 İÇ KAPI NO:107, 34112 Fatih/İstanbul, Türkiye <br />
                Phone: +90 506 527 49 30 <br />
                Email: support@keramethali.com
              </p>

              <p className="mt-3">
                By accepting this contract, the BUYER agrees to pay all order-related costs including product price, shipping fees, customs duties (if applicable), bank charges, and all relevant taxes.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">2. DEFINITIONS</h2>

              <p className="mt-3">
                This Agreement is governed primarily by Turkish Consumer Protection Law No. 6502 and Distance Contracts Regulation.
              </p>

              <p className="mt-3">
                For international sales, mandatory consumer protection laws of the BUYER’s country may apply only where legally required. Otherwise, Turkish law shall remain the primary governing law.
              </p>

              <p className="mt-3">
                All prices on the website are displayed in United States Dollars (USD). The BUYER acknowledges that currency conversion rates, bank fees, and payment provider charges may vary and are not controlled by the SELLER.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">3. SUBJECT</h2>

              <p className="mt-3">
                This Agreement regulates the rights and obligations of the parties regarding the sale, payment, international shipment, and delivery of handmade carpet and kilim products ordered electronically.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">4. SELLER INFORMATION</h2>

              <p className="mt-3">
                Keramet Halı Handmade Rugs & Kilims <br />
                BÜYÜK MİLAS HAN, Hobyar, Cemal Nadir Sk. NO:24 İÇ KAPI NO:107, 34112 Fatih/İstanbul, Türkiye <br />
                Phone: +90 506 527 49 30 <br />
                Email: support@keramethali.com
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">5. BUYER INFORMATION</h2>

              <p className="mt-3">
                The delivery address, contact details, and identity information provided by the BUYER during checkout shall be used as official order information.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">
                6. INTERNATIONAL SHIPPING, CUSTOMS & DELIVERY
              </h2>

              <p className="mt-3">
                The SELLER ships products worldwide. Delivery times may vary depending on destination country, customs procedures, courier services, and local regulations.
              </p>

              <p className="mt-3">
                The BUYER acknowledges that international shipments may be subject to customs inspection, import restrictions, or delays beyond the SELLER’s control.
              </p>

              <p className="mt-3">
                All customs duties, import taxes, VAT, brokerage fees, and any local charges are the sole responsibility of the BUYER.
              </p>

              <p className="mt-3">
                The SELLER is not responsible for delays caused by customs authorities, courier companies, airline transport, or other third-party logistics providers.
              </p>

              <p className="mt-3">
                Delivery times are estimates only and not guaranteed exact dates.
              </p>

              <p className="mt-3">
                For international returns, all return shipping costs, customs return charges, and cross-border fees are the responsibility of the BUYER unless otherwise agreed in writing.
              </p>

              <p className="mt-3">
                The BUYER is responsible for ensuring that imported goods comply with the laws of their country.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">7. PAYMENT TERMS</h2>

              <p className="mt-3">
                All payments must be completed at the time of order via approved payment methods. Orders will not be processed until full payment is successfully received.
              </p>

              <p className="mt-3">
                The SELLER reserves the right to cancel, suspend, or verify any order in cases of payment failure, suspected fraud, or security concerns.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">8. FRAUD PREVENTION & SECURITY</h2>

              <p className="mt-3">
                The SELLER reserves the right to request identity verification, payment confirmation, or additional documentation in order to prevent fraud or unauthorized transactions.
              </p>

              <p className="mt-3">
                Failure to provide requested information may result in order cancellation without liability to the SELLER.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">9. GENERAL PROVISIONS</h2>

              <div className="mt-3 whitespace-pre-line">
{`9. GENERAL PROVISIONS

9.1. The BUYER accepts, declares and undertakes that he/she has read the basic characteristics, sales price and payment method of the product subject to the contract on the website of the SELLER, and the preliminary information regarding the delivery, and that he/she has been informed and has given the necessary confirmation electronically. BUYER; Confirming the Preliminary Information electronically, accepting, declaring and undertaking that he/she has obtained the address to be given to the BUYER by the SELLER before the establishment of the distance sales contract, the basic features of the ordered products, the price of the products including taxes, payment and delivery information accurately and completely.

9.2. Each product subject to the contract is delivered to the BUYER or the person and/or organization at the address indicated by the BUYER within the period specified in the preliminary information section on the website, depending on the distance of the BUYER's residence, provided that it does not exceed the legal period of 30 days.

9.3. The SELLER undertakes to deliver the product subject to the contract completely, in accordance with the order specifications and legal requirements.

9.4. The SELLER may supply a product of equal quality and price with BUYER approval.

9.5. If fulfillment becomes impossible, SELLER refunds within legal timeframes.

9.6. The BUYER accepts electronic confirmation as binding agreement.

9.7. Chargeback/fraud cases may require return of goods.

9.8. Force majeure includes customs delays, logistics interruptions, war, strikes, pandemics, and government actions.

9.9. Communication consent is granted by BUYER for order processing.

9.10. Goods must be inspected upon delivery.

9.11. SELLER may request identity verification in suspicious transactions.

9.12. BUYER is responsible for accuracy of provided information.

9.13. BUYER agrees to comply with applicable laws.

9.14. Misuse of website is prohibited.

9.15. External links are not under SELLER responsibility.

9.16. Legal enforcement applies in case of violation.`}
              </div>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">10. RIGHT OF WITHDRAWAL</h2>

              <div className="mt-3 whitespace-pre-line">
{`10.1. BUYER may withdraw within 14 days of delivery without justification, in accordance with applicable law. Return shipping costs belong to BUYER unless item is defective or incorrect.

10.2. Withdrawal requires written notice and return of unused product in original condition.`}
              </div>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">
                11. NON-RETURNABLE PRODUCTS
              </h2>

              <p className="mt-3">
                Products that are custom-made, altered, or specially requested by the BUYER may not be eligible for return unless defective or incorrectly delivered.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">
                12. DEFAULT AND LEGAL CONSEQUENCES
              </h2>

              <p className="mt-3">
                The BUYER accepts responsibility for payment defaults including interest, collection costs, and legal enforcement expenses.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">13. COMPETENT COURT</h2>

              <p className="mt-3">
                Turkish consumer arbitration boards and courts shall have jurisdiction, unless mandatory consumer protection laws of the BUYER’s country apply.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-2xl font-bold text-[#2d2823]">14. ENFORCEMENT</h2>

              <p className="mt-3">
                Completion of payment confirms acceptance of this Agreement.
              </p>

              <p className="mt-3">
                SELLER: Keramet Halı Handmade Rugs & Kilims
              </p>

              <p className="mt-3">BUYER:</p>
              <p className="mt-3">DATE:</p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
