import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
} from "react-icons/fa";

const phoneNumbers = [
  {
    label: "Primary Phone",
    display: "+90 506 527 49 30",
    href: "tel:+905065274930",
  },
  {
    label: "Second Phone",
    display: "+90 531 921 45 75",
    href: "tel:+905319214575",
  },
];

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61580349339271#",
    icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/keramethali/",
    icon: FaInstagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@keramet.hali",
    icon: FaTiktok,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-[#e7ddd6] bg-custom-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-gray-600">
            Get in Touch
          </h3>

          <h2 className="mt-3 text-3xl font-extrabold text-custom-accent md:text-4xl">
            Contact Us
          </h2>


        </div>

        <div className="overflow-hidden rounded-[30px] border border-[#eadfd8] bg-white/60 shadow-[0_18px_60px_rgba(0,0,0,0.06)] backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left content inside same block */}
            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#9b8f80]">
                Keramet Rugs
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6e665d] sm:text-base">
                Reach out for product inquiries, showroom guidance, or help
                choosing the right handmade rug for your home or project.
              </p>

              <div className="mt-8 space-y-4 sm:mt-10">
                {phoneNumbers.map((phone) => (
                  <div
                    key={phone.label}
                    className="flex items-start gap-4 rounded-2xl border border-[#eee5df] bg-[#ffffffb8] p-4 shadow-[0_8px_22px_rgba(0,0,0,0.035)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_14px_28px_rgba(0,0,0,0.05)] sm:gap-5 sm:p-5"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f8f2ed] text-custom-accent sm:h-16 sm:w-16">
                      <FaPhoneAlt className="text-xl sm:text-2xl" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9b8f80] sm:text-xs">
                        {phone.label}
                      </p>

                      <a
                        href={phone.href}
                        className="mt-2 inline-block break-words text-xl font-extrabold leading-snug text-custom-accent transition hover:text-custom-accent-light sm:text-2xl"
                      >
                        {phone.display}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-[#eee4de] pt-8">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-gray-700">
                  Follow Us
                </p>

                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {socials.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.name}
                        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eadfd8] bg-white text-custom-accent shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:bg-custom-accent hover:text-white sm:h-16 sm:w-16"
                      >
                        <Icon className="text-2xl sm:text-[28px]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right content inside same block */}
            <div className="border-t border-[#eee4de] lg:border-l lg:border-t-0">
              <div className="px-6 py-5 sm:px-8 lg:px-10 lg:py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9b8f80]">
                  Store Location
                </p>

             <h3 className="mt-2 text-2xl font-bold leading-tight text-custom-accent sm:text-[30px]">
                  Keramet Halı Handmade Rugs & Kilims
                </h3>
              </div>

              <div className="h-[320px] w-full sm:h-[400px] md:h-[460px] lg:h-full lg:min-h-[100%]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24084.40256752193!2d28.93900487910156!3d41.01321460000001!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab95778da3059%3A0x4c6bef2481ac35df!2sKeramet%20Hal%C4%B1%20Handmade%20Rugs%20%26%20Kilims!5e0!3m2!1sen!2s!4v1766616159896!5m2!1sen!2s"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Keramet Rugs Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
