"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { CheckoutSteps, CheckoutSummary, StateCard } from "@/components/checkout/CheckoutParts";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { fetchProductsByIds } from "@/lib/products-client";
import { getCart, type CartItem } from "@/lib/cart";

type ProductDoc = {
  id: string;
  title?: string;
  coverUrl?: string;
  price?: number;
  category?: string;
  size?: string;
};

type CheckoutForm = {
  country: string;
  fullName: string;
  streetAddress: string;
  apartment: string;
  city: string;
  postalCode: string;
  countryCode: string;
  phoneNumber: string;
};

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const COUNTRY_CODES = [
  { label: "Afghanistan (+93)", value: "+93" },
  { label: "Albania (+355)", value: "+355" },
  { label: "Algeria (+213)", value: "+213" },
  { label: "Andorra (+376)", value: "+376" },
  { label: "Angola (+244)", value: "+244" },
  { label: "Antigua and Barbuda (+1-268)", value: "+1268" },
  { label: "Argentina (+54)", value: "+54" },
  { label: "Armenia (+374)", value: "+374" },
  { label: "Australia (+61)", value: "+61" },
  { label: "Austria (+43)", value: "+43" },
  { label: "Azerbaijan (+994)", value: "+994" },
  { label: "Bahamas (+1-242)", value: "+1242" },
  { label: "Bahrain (+973)", value: "+973" },
  { label: "Bangladesh (+880)", value: "+880" },
  { label: "Barbados (+1-246)", value: "+1246" },
  { label: "Belarus (+375)", value: "+375" },
  { label: "Belgium (+32)", value: "+32" },
  { label: "Belize (+501)", value: "+501" },
  { label: "Benin (+229)", value: "+229" },
  { label: "Bhutan (+975)", value: "+975" },
  { label: "Bolivia (+591)", value: "+591" },
  { label: "Bosnia and Herzegovina (+387)", value: "+387" },
  { label: "Botswana (+267)", value: "+267" },
  { label: "Brazil (+55)", value: "+55" },
  { label: "Brunei (+673)", value: "+673" },
  { label: "Bulgaria (+359)", value: "+359" },
  { label: "Burkina Faso (+226)", value: "+226" },
  { label: "Burundi (+257)", value: "+257" },
  { label: "Cambodia (+855)", value: "+855" },
  { label: "Cameroon (+237)", value: "+237" },
  { label: "Canada (+1)", value: "+1" },
  { label: "Cape Verde (+238)", value: "+238" },
  { label: "Central African Republic (+236)", value: "+236" },
  { label: "Chad (+235)", value: "+235" },
  { label: "Chile (+56)", value: "+56" },
  { label: "China (+86)", value: "+86" },
  { label: "Colombia (+57)", value: "+57" },
  { label: "Comoros (+269)", value: "+269" },
  { label: "Congo (+242)", value: "+242" },
  { label: "Costa Rica (+506)", value: "+506" },
  { label: "Croatia (+385)", value: "+385" },
  { label: "Cuba (+53)", value: "+53" },
  { label: "Cyprus (+357)", value: "+357" },
  { label: "Czech Republic (+420)", value: "+420" },
  { label: "Democratic Republic of the Congo (+243)", value: "+243" },
  { label: "Denmark (+45)", value: "+45" },
  { label: "Djibouti (+253)", value: "+253" },
  { label: "Dominica (+1-767)", value: "+1767" },
  { label: "Dominican Republic (+1-809)", value: "+1809" },
  { label: "Ecuador (+593)", value: "+593" },
  { label: "Egypt (+20)", value: "+20" },
  { label: "El Salvador (+503)", value: "+503" },
  { label: "Equatorial Guinea (+240)", value: "+240" },
  { label: "Eritrea (+291)", value: "+291" },
  { label: "Estonia (+372)", value: "+372" },
  { label: "Eswatini (+268)", value: "+268" },
  { label: "Ethiopia (+251)", value: "+251" },
  { label: "Fiji (+679)", value: "+679" },
  { label: "Finland (+358)", value: "+358" },
  { label: "France (+33)", value: "+33" },
  { label: "Gabon (+241)", value: "+241" },
  { label: "Gambia (+220)", value: "+220" },
  { label: "Georgia (+995)", value: "+995" },
  { label: "Germany (+49)", value: "+49" },
  { label: "Ghana (+233)", value: "+233" },
  { label: "Greece (+30)", value: "+30" },
  { label: "Grenada (+1-473)", value: "+1473" },
  { label: "Guatemala (+502)", value: "+502" },
  { label: "Guinea (+224)", value: "+224" },
  { label: "Guinea-Bissau (+245)", value: "+245" },
  { label: "Guyana (+592)", value: "+592" },
  { label: "Haiti (+509)", value: "+509" },
  { label: "Honduras (+504)", value: "+504" },
  { label: "Hong Kong (+852)", value: "+852" },
  { label: "Hungary (+36)", value: "+36" },
  { label: "Iceland (+354)", value: "+354" },
  { label: "India (+91)", value: "+91" },
  { label: "Indonesia (+62)", value: "+62" },
  { label: "Iran (+98)", value: "+98" },
  { label: "Iraq (+964)", value: "+964" },
  { label: "Ireland (+353)", value: "+353" },
  { label: "Italy (+39)", value: "+39" },
  { label: "Ivory Coast (+225)", value: "+225" },
  { label: "Jamaica (+1-876)", value: "+1876" },
  { label: "Japan (+81)", value: "+81" },
  { label: "Jordan (+962)", value: "+962" },
  { label: "Kazakhstan (+7)", value: "+7" },
  { label: "Kenya (+254)", value: "+254" },
  { label: "Kiribati (+686)", value: "+686" },
  { label: "Kuwait (+965)", value: "+965" },
  { label: "Kyrgyzstan (+996)", value: "+996" },
  { label: "Laos (+856)", value: "+856" },
  { label: "Latvia (+371)", value: "+371" },
  { label: "Lebanon (+961)", value: "+961" },
  { label: "Lesotho (+266)", value: "+266" },
  { label: "Liberia (+231)", value: "+231" },
  { label: "Libya (+218)", value: "+218" },
  { label: "Liechtenstein (+423)", value: "+423" },
  { label: "Lithuania (+370)", value: "+370" },
  { label: "Luxembourg (+352)", value: "+352" },
  { label: "Macau (+853)", value: "+853" },
  { label: "Madagascar (+261)", value: "+261" },
  { label: "Malawi (+265)", value: "+265" },
  { label: "Malaysia (+60)", value: "+60" },
  { label: "Maldives (+960)", value: "+960" },
  { label: "Mali (+223)", value: "+223" },
  { label: "Malta (+356)", value: "+356" },
  { label: "Marshall Islands (+692)", value: "+692" },
  { label: "Mauritania (+222)", value: "+222" },
  { label: "Mauritius (+230)", value: "+230" },
  { label: "Mexico (+52)", value: "+52" },
  { label: "Micronesia (+691)", value: "+691" },
  { label: "Moldova (+373)", value: "+373" },
  { label: "Monaco (+377)", value: "+377" },
  { label: "Mongolia (+976)", value: "+976" },
  { label: "Montenegro (+382)", value: "+382" },
  { label: "Morocco (+212)", value: "+212" },
  { label: "Mozambique (+258)", value: "+258" },
  { label: "Myanmar (+95)", value: "+95" },
  { label: "Namibia (+264)", value: "+264" },
  { label: "Nauru (+674)", value: "+674" },
  { label: "Nepal (+977)", value: "+977" },
  { label: "Netherlands (+31)", value: "+31" },
  { label: "New Zealand (+64)", value: "+64" },
  { label: "Nicaragua (+505)", value: "+505" },
  { label: "Niger (+227)", value: "+227" },
  { label: "Nigeria (+234)", value: "+234" },
  { label: "North Korea (+850)", value: "+850" },
  { label: "North Macedonia (+389)", value: "+389" },
  { label: "Norway (+47)", value: "+47" },
  { label: "Oman (+968)", value: "+968" },
  { label: "Pakistan (+92)", value: "+92" },
  { label: "Palau (+680)", value: "+680" },
  { label: "Palestine (+970)", value: "+970" },
  { label: "Panama (+507)", value: "+507" },
  { label: "Papua New Guinea (+675)", value: "+675" },
  { label: "Paraguay (+595)", value: "+595" },
  { label: "Peru (+51)", value: "+51" },
  { label: "Philippines (+63)", value: "+63" },
  { label: "Poland (+48)", value: "+48" },
  { label: "Portugal (+351)", value: "+351" },
  { label: "Qatar (+974)", value: "+974" },
  { label: "Romania (+40)", value: "+40" },
  { label: "Russia (+7)", value: "+7" },
  { label: "Rwanda (+250)", value: "+250" },
  { label: "Saint Kitts and Nevis (+1-869)", value: "+1869" },
  { label: "Saint Lucia (+1-758)", value: "+1758" },
  { label: "Saint Vincent and the Grenadines (+1-784)", value: "+1784" },
  { label: "Samoa (+685)", value: "+685" },
  { label: "San Marino (+378)", value: "+378" },
  { label: "Sao Tome and Principe (+239)", value: "+239" },
  { label: "Saudi Arabia (+966)", value: "+966" },
  { label: "Senegal (+221)", value: "+221" },
  { label: "Serbia (+381)", value: "+381" },
  { label: "Seychelles (+248)", value: "+248" },
  { label: "Sierra Leone (+232)", value: "+232" },
  { label: "Singapore (+65)", value: "+65" },
  { label: "Slovakia (+421)", value: "+421" },
  { label: "Slovenia (+386)", value: "+386" },
  { label: "Solomon Islands (+677)", value: "+677" },
  { label: "Somalia (+252)", value: "+252" },
  { label: "South Africa (+27)", value: "+27" },
  { label: "South Korea (+82)", value: "+82" },
  { label: "South Sudan (+211)", value: "+211" },
  { label: "Spain (+34)", value: "+34" },
  { label: "Sri Lanka (+94)", value: "+94" },
  { label: "Sudan (+249)", value: "+249" },
  { label: "Suriname (+597)", value: "+597" },
  { label: "Sweden (+46)", value: "+46" },
  { label: "Switzerland (+41)", value: "+41" },
  { label: "Syria (+963)", value: "+963" },
  { label: "Taiwan (+886)", value: "+886" },
  { label: "Tajikistan (+992)", value: "+992" },
  { label: "Tanzania (+255)", value: "+255" },
  { label: "Thailand (+66)", value: "+66" },
  { label: "Timor-Leste (+670)", value: "+670" },
  { label: "Togo (+228)", value: "+228" },
  { label: "Tonga (+676)", value: "+676" },
  { label: "Trinidad and Tobago (+1-868)", value: "+1868" },
  { label: "Tunisia (+216)", value: "+216" },
  { label: "Turkey (+90)", value: "+90" },
  { label: "Turkmenistan (+993)", value: "+993" },
  { label: "Tuvalu (+688)", value: "+688" },
  { label: "Uganda (+256)", value: "+256" },
  { label: "Ukraine (+380)", value: "+380" },
  { label: "United Arab Emirates (+971)", value: "+971" },
  { label: "United Kingdom (+44)", value: "+44" },
  { label: "United States (+1)", value: "+1" },
  { label: "Uruguay (+598)", value: "+598" },
  { label: "Uzbekistan (+998)", value: "+998" },
  { label: "Vanuatu (+678)", value: "+678" },
  { label: "Vatican City (+379)", value: "+379" },
  { label: "Venezuela (+58)", value: "+58" },
  { label: "Vietnam (+84)", value: "+84" },
  { label: "Yemen (+967)", value: "+967" },
  { label: "Zambia (+260)", value: "+260" },
  { label: "Zimbabwe (+263)", value: "+263" },
];

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

const [form, setForm] = useState<CheckoutForm>({
    country: "Turkey",
    fullName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    postalCode: "",
    countryCode: "+90",
    phoneNumber: "",
});

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutForm, string>>
  >({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/auth?redirect=/checkout");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const sync = () => setCart(getCart());
    sync();
    window.addEventListener("cartUpdated", sync);
    return () => window.removeEventListener("cartUpdated", sync);
  }, []);

  useEffect(() => {
    async function load() {
      const ids = cart.map((x) => x.id);

      if (!ids.length) {
        setProducts([]);
        setReady(true);
        return;
      }

      // Read only the products in the cart (1 read each), not the whole collection.
      const filtered = await fetchProductsByIds<ProductDoc>(ids);
      setProducts(filtered);
      setReady(true);
    }

    setReady(false);
    load();
  }, [cart]);

  const items = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));

    return cart
      .map((c) => {
        const p = map.get(c.id);
        if (!p) return null;

        return {
          ...p,
          price: Number(p.price || 0),
        };
      })
      .filter(Boolean) as Array<ProductDoc & { price: number }>;
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, x) => sum + x.price, 0);
  }, [items]);

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

const validate = () => {
    const nextErrors: Partial<Record<keyof CheckoutForm, string>> = {};

    if (!form.country.trim()) {
        nextErrors.country = "Please select a country.";
    }

    if (!form.fullName.trim()) {
        nextErrors.fullName = "Please enter your full name.";
    }

    if (!form.streetAddress.trim()) {
        nextErrors.streetAddress = "Please enter your street address.";
    }

    if (!form.city.trim()) {
        nextErrors.city = "Please enter your city.";
    }

    if (!form.countryCode.trim()) {
        nextErrors.countryCode = "Please select a country code.";
    }

    if (!form.phoneNumber.trim()) {
        nextErrors.phoneNumber = "Please enter your phone number.";
    } else if (form.phoneNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phoneNumber = "Please enter a valid phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
};

  const handleContinue = () => {
    if (!items.length) {
      router.push("/cart");
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

   const payload = {
  customer: form,
  items,
  subtotal,
  currency: "USD",
};

    sessionStorage.setItem("checkoutDetails", JSON.stringify(payload));
    router.push("/checkout/review");
  };

  const inputClass = (hasError?: string) =>
    `h-12 w-full rounded-sm border bg-paper px-4 text-sm text-ink outline-none transition focus:border-custom-accent ${
      hasError ? "border-custom-accent" : "border-line"
    }`;

  const labelClass = "mb-1.5 block text-xs font-semibold text-ink/80";

  const fieldError = (message?: string) =>
    message ? <p className="mt-1.5 text-xs text-custom-accent">{message}</p> : null;

  if (!ready) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-custom-bg">
          <PageHero title="Delivery" crumbs={[{ href: "/cart", label: "Cart" }, { label: "Delivery" }]} />
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              <div className="h-96 animate-pulse rounded-sm bg-paper" />
              <div className="h-72 animate-pulse rounded-sm bg-paper" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-custom-bg">
          <PageHero title="Delivery" crumbs={[{ href: "/cart", label: "Cart" }, { label: "Delivery" }]} />
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
            <StateCard title="Your cart is empty" text="Add a rug to your cart to continue.">
              <Link
                href="/products"
                className="mt-8 inline-flex items-center rounded-full bg-custom-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-custom-accent-light"
              >
                Browse Rugs
              </Link>
            </StateCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-custom-bg">
        <PageHero
          title="Delivery"
          label="Secure Checkout"
          crumbs={[{ href: "/cart", label: "Cart" }, { label: "Delivery" }]}
          subtitle="Enter your delivery and contact details to complete your order."
        >
          <CheckoutSteps current={1} />
        </PageHero>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
            <section className="rounded-sm border border-line bg-paper p-6 md:p-8">
              <h2 className="font-display text-3xl font-semibold text-ink">
                Delivery Details
              </h2>
              <p className="mt-1 text-xs text-muted">Fields marked * are required.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Country *</span>
                  <select
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    autoComplete="country-name"
                    className={inputClass(errors.country)}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {fieldError(errors.country)}
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClass}>Full Name *</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={inputClass(errors.fullName)}
                  />
                  {fieldError(errors.fullName)}
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClass}>Street Address *</span>
                  <input
                    type="text"
                    value={form.streetAddress}
                    onChange={(e) => handleChange("streetAddress", e.target.value)}
                    placeholder="Street and house number"
                    autoComplete="address-line1"
                    className={inputClass(errors.streetAddress)}
                  />
                  {fieldError(errors.streetAddress)}
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClass}>Flat / Other (Optional)</span>
                  <input
                    type="text"
                    value={form.apartment}
                    onChange={(e) => handleChange("apartment", e.target.value)}
                    placeholder="Apartment, suite, or other"
                    autoComplete="address-line2"
                    className={inputClass()}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>City *</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Enter your city"
                    autoComplete="address-level2"
                    className={inputClass(errors.city)}
                  />
                  {fieldError(errors.city)}
                </label>

                <label className="block">
                  <span className={labelClass}>Postal Code</span>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    placeholder="Enter postal code"
                    autoComplete="postal-code"
                    className={inputClass()}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelClass}>Phone Number *</span>
                  <span className="flex gap-2">
                    <select
                      value={form.countryCode}
                      onChange={(e) => handleChange("countryCode", e.target.value)}
                      aria-label="Country code"
                      className={`${inputClass(errors.countryCode).replace("w-full ", "")} w-36 shrink-0 sm:w-56`}
                    >
                      {COUNTRY_CODES.map((code) => (
                        <option key={code.label} value={code.value}>
                          {code.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={form.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      placeholder="Enter phone number"
                      autoComplete="tel-national"
                      className={inputClass(errors.phoneNumber)}
                    />
                  </span>
                  {fieldError(errors.countryCode || errors.phoneNumber)}
                </label>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/cart"
                  className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted hover:text-custom-accent"
                >
                  ← Back to Cart
                </Link>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={submitting}
                  className="rounded-full bg-custom-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_26px_rgba(96,25,21,0.22)] transition hover:-translate-y-0.5 hover:bg-custom-accent-light disabled:opacity-70"
                >
                  {submitting ? "Saving…" : "Continue to Payment"}
                </button>
              </div>
            </section>

            <CheckoutSummary items={items} subtotal={subtotal} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
