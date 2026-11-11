"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

    if (!form.country.trim()) nextErrors.country = "Please select a country.";
    if (!form.fullName.trim()) {
      nextErrors.fullName = "Please enter a full name.";
    }
    if (!form.streetAddress.trim()) {
      nextErrors.streetAddress = "Please enter a street address.";
    }
    if (!form.city.trim()) nextErrors.city = "Please enter a city.";
    if (!form.countryCode.trim()) {
      nextErrors.countryCode = "Please select a country code.";
    }
    if (!form.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Please enter a valid phone number.";
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
    };

    sessionStorage.setItem("checkoutDetails", JSON.stringify(payload));
    router.push("/checkout/review");
  };

  if (!ready) {
    return (
      <>
        <Header />
        <main className="page">
          <div className="wrap">
            <div className="loadingCard">Loading checkout…</div>
          </div>
        </main>
        <Footer />

        <style jsx>{`
          .page {
            background: #f5f5eb;
            min-height: 100vh;
          }

          .wrap {
            max-width: 1200px;
            margin: 0 auto;
            padding: 48px 20px 70px;
          }

          .loadingCard {
            background: rgba(255, 255, 255, 0.82);
            border: 1px solid rgba(122, 31, 31, 0.08);
            border-radius: 18px;
            padding: 28px;
            font-weight: 700;
            color: #1c1c1c;
          }
        `}</style>
      </>
    );
  }

  if (!items.length) {
    return (
      <>
        <Header />
        <main className="page">
          <div className="wrap">
            <div className="emptyCard">
              <h1>Your cart is empty.</h1>
              <p>Add a product before continuing to checkout.</p>
              <Link href="/products">
                <span className="filledBtn">Browse rugs</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />

        <style jsx>{`
          .page {
            background: #f5f5eb;
            min-height: 100vh;
          }

          .wrap {
            max-width: 1200px;
            margin: 0 auto;
            padding: 48px 20px 70px;
          }

          .emptyCard {
            background: rgba(255, 255, 255, 0.82);
            border: 1px solid rgba(122, 31, 31, 0.08);
            border-radius: 18px;
            padding: 32px;
            text-align: center;
          }

          .emptyCard h1 {
            font-size: 28px;
            font-weight: 900;
            color: #1c1c1c;
            margin-bottom: 10px;
          }

          .emptyCard p {
            color: rgba(0, 0, 0, 0.6);
            margin-bottom: 18px;
          }

          .filledBtn {
            display: inline-block;
            border: 1px solid #7a1f1f;
            background: #7a1f1f;
            color: #fff;
            padding: 10px 14px;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="page">
        <div className="wrap">
          <div className="topbar">
            <div>
              <h1 className="title">Checkout</h1>
              <p className="subtitle">
                Enter your delivery and contact details before reviewing and placing your order.
              </p>
            </div>

            <div className="steps">
              <span className="step active">1. Address</span>
              <span className="step">2. Review &amp; Payment</span>
            </div>
          </div>

          <div className="grid">
            <section className="formCard">
              <h2>Delivery details</h2>

              <div className="field">
                <label>Country *</label>
                <select
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country ? <p className="error">{errors.country}</p> : null}
              </div>

              <div className="field">
                <label>Full name *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                />
                {errors.fullName ? <p className="error">{errors.fullName}</p> : null}
              </div>

              <div className="field">
                <label>Street address *</label>
                <input
                  type="text"
                  value={form.streetAddress}
                  onChange={(e) => handleChange("streetAddress", e.target.value)}
                  placeholder="Enter street address"
                />
                {errors.streetAddress ? (
                  <p className="error">{errors.streetAddress}</p>
                ) : null}
              </div>

              <div className="field">
                <label>Flat / Other</label>
                <input
                  type="text"
                  value={form.apartment}
                  onChange={(e) => handleChange("apartment", e.target.value)}
                  placeholder="Apartment, suite, or other"
                />
              </div>

              <div className="field">
                <label>City *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Enter city"
                />
                {errors.city ? <p className="error">{errors.city}</p> : null}
              </div>

              <div className="field">
                <label>Postal code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder="Enter postal code"
                />
              </div>

              <div className="double">
                <div className="field">
                  <label>Country code *</label>
                  <select
                    value={form.countryCode}
                    onChange={(e) => handleChange("countryCode", e.target.value)}
                  >
                    {COUNTRY_CODES.map((code) => (
                      <option key={code.label} value={code.value}>
                        {code.label}
                      </option>
                    ))}
                  </select>
                  {errors.countryCode ? (
                    <p className="error">{errors.countryCode}</p>
                  ) : null}
                </div>

                <div className="field">
                  <label>Phone number *</label>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber ? (
                    <p className="error">{errors.phoneNumber}</p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                className="continueBtn"
                onClick={handleContinue}
                disabled={submitting}
              >
                {submitting ? "Saving Details..." : "Continue to Review & Payment"}
              </button>
            </section>

            <aside className="summaryCard">
              <h3>Order summary</h3>

              <div className="summaryItems">
                {items.map((item) => (
                  <div key={item.id} className="summaryRow">
                    <div className="left">
                      <img
                        src={item.coverUrl || ""}
                        alt={item.title || "Product"}
                      />
                      <div className="textWrap">
                        <p className="itemTitle">
                          {item.title || "Untitled product"}
                        </p>
                        <p className="itemMeta">
                          {item.category || "Rug"}
                          {item.size ? ` • ${item.size}` : ""}
                        </p>
                        <div className="priceWrap">USD {item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="totals">
                <div className="sumRow">
                  <span>Subtotal</span>
                  <strong>USD {subtotal.toFixed(2)}</strong>
                </div>
                <div className="sumRow">
                  <span>Delivery</span>
                  <strong>Free</strong>
                </div>
                <div className="sumRow total">
                  <span>Total</span>
                  <strong>USD {subtotal.toFixed(2)}</strong>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .page {
          background: #f5f5eb;
          min-height: 100vh;
        }

        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 20px 70px;
        }

        .topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .title {
          font-size: 42px;
          font-weight: 900;
          color: #7a1f1f;
          margin-bottom: 8px;
        }

        .subtitle {
          color: rgba(0, 0, 0, 0.6);
          line-height: 1.5;
          max-width: 560px;
        }

        .steps {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .step {
          font-size: 13px;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.48);
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(122, 31, 31, 0.08);
          white-space: nowrap;
        }

        .step.active {
          color: #7a1f1f;
          background: rgba(122, 31, 31, 0.08);
          border-color: rgba(122, 31, 31, 0.14);
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 390px;
          gap: 24px;
          align-items: start;
        }

        .formCard,
        .summaryCard {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(122, 31, 31, 0.08);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 10px 28px rgba(122, 31, 31, 0.05);
        }

        .formCard h2,
        .summaryCard h3 {
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 20px;
          color: #1c1c1c;
        }

        .field {
          margin-bottom: 16px;
        }

        .field label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 800;
          color: #4b1b1b;
        }

        .field input,
        .field select {
          width: 100%;
          border: 1px solid rgba(122, 31, 31, 0.16);
          background: #fff;
          border-radius: 12px;
          padding: 13px 14px;
          font-size: 14px;
          outline: none;
        }

        .field input:focus,
        .field select:focus {
          border-color: #7a1f1f;
          box-shadow: 0 0 0 3px rgba(122, 31, 31, 0.08);
        }

        .double {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 14px;
        }

        .error {
          margin-top: 6px;
          font-size: 13px;
          color: #b91c1c;
          font-weight: 700;
        }

        .continueBtn {
          width: 100%;
          border: none;
          background: #7a1f1f;
          color: #fff;
          font-weight: 900;
          padding: 14px 16px;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(122, 31, 31, 0.22);
          margin-top: 8px;
          transition: background 0.2s ease, opacity 0.2s ease;
        }

        .continueBtn:hover {
          background: #641919;
        }

        .continueBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .summaryItems {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 22px;
        }

        .summaryRow {
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(122, 31, 31, 0.08);
        }

        .left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }

        .left img {
          width: 58px;
          height: 78px;
          object-fit: cover;
          border-radius: 12px;
          background: #fff;
          flex-shrink: 0;
        }

        .textWrap {
          min-width: 0;
          flex: 1;
        }

        .itemTitle {
          font-size: 14px;
          font-weight: 800;
          color: #1c1c1c;
          line-height: 1.42;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          overflow-wrap: anywhere;
          max-width: 100%;
        }

        .itemMeta {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.58);
          margin-bottom: 10px;
        }

        .priceWrap {
          font-size: 15px;
          font-weight: 900;
          color: #7a1f1f;
        }

        .totals {
          padding-top: 4px;
        }

        .sumRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          margin-bottom: 12px;
          color: #1c1c1c;
        }

        .sumRow strong {
          color: #7a1f1f;
        }

        .sumRow.total {
          margin-top: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(122, 31, 31, 0.1);
          font-weight: 900;
          font-size: 17px;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .steps {
            justify-content: flex-start;
          }

          .title {
            font-size: 34px;
          }
        }

        @media (max-width: 640px) {
          .double {
            grid-template-columns: 1fr;
          }

          .wrap {
            padding: 32px 16px 70px;
          }

          .formCard,
          .summaryCard {
            padding: 20px;
          }

          .left img {
            width: 56px;
            height: 76px;
          }

          .itemTitle {
            font-size: 13px;
            line-height: 1.45;
          }

          .step {
            font-size: 12px;
            padding: 9px 12px;
          }
        }
      `}</style>
    </>
  );
}
