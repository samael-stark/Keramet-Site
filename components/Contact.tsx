import { FaFacebookF, FaInstagram, FaTiktok, FaPhoneAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-custom-bg border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-widest">
            Get in Touch
          </h3>
          <h2 className="text-4xl font-extrabold text-gray-800 mt-3">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Call us, follow us, or visit our store location.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* LEFT */}
          <div className="flex flex-col justify-center">
            <h3 className="text-4xl font-extrabold text-custom-accent">
              KERAMET HALI
            </h3>

            {/* Phone */}
            <div className="mt-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center">
                <FaPhoneAlt className="text-custom-accent text-2xl" />
              </div>

              <div>
                <p className="text-base text-gray-600 uppercase tracking-widest">
                  Phone
                </p>
                <a
                  href="tel:+905065274930"
                  className="text-2xl font-extrabold text-custom-accent hover:text-custom-accent-light transition"
                >
                  +90 506 527 49 30
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-14">
              <p className="text-base font-semibold text-gray-700 uppercase tracking-widest mb-5">
                Follow Us
              </p>

              <div className="flex items-center gap-6">
                <a
                  href="https://www.facebook.com/profile.php?id=61580349339271#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="group w-16 h-16 rounded-2xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center transition hover:bg-custom-accent"
                >
                  <FaFacebookF className="text-custom-accent text-3xl group-hover:text-white transition" />
                </a>

                <a
                  href="https://www.instagram.com/keramethali/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="group w-16 h-16 rounded-2xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center transition hover:bg-custom-accent"
                >
                  <FaInstagram className="text-custom-accent text-3xl group-hover:text-white transition" />
                </a>

                <a
                  href="https://www.tiktok.com/@keramet.hali"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="group w-16 h-16 rounded-2xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center transition hover:bg-custom-accent"
                >
                  <FaTiktok className="text-custom-accent text-3xl group-hover:text-white transition" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT — Map */}
          <div className="rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md border border-white/40 shadow-lg">
            <div className="h-full min-h-[520px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24084.40256752193!2d28.93900487910156!3d41.01321460000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab95778da3059%3A0x4c6bef2481ac35df!2sKeramet%20Hal%C4%B1%20Handmade%20Rugs%20%26%20Kilims!5e0!3m2!1sen!2s!4v1766616159896!5m2!1sen!2s"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Keramet Hali Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
