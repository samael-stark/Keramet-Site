import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaPhoneAlt,
} from "react-icons/fa";
import SectionHeading from "@/components/home/SectionHeading";

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
      className="scroll-mt-32 border-t border-line bg-paper py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          label="Get in Touch"
          title="Contact Us"
          intro="Reach out for product inquiries, showroom guidance, or help choosing the right handmade rug for your home or project."
        />

        <div className="mt-14 grid overflow-hidden rounded-sm border border-line lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left */}
          <div className="bg-custom-bg p-8 sm:p-10 lg:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
              Store
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink">
              Keramet Rugs Handmade Rugs &amp; Kilims
            </h3>

            <div className="mt-8 divide-y divide-line border-y border-line">
              {phoneNumbers.map((phone) => (
                <a
                  key={phone.label}
                  href={phone.href}
                  className="group flex items-center gap-5 py-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-custom-accent text-white transition group-hover:bg-custom-accent-light">
                    <FaPhoneAlt />
                  </span>

                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                      {phone.label}
                    </span>
                    <span className="mt-1 block text-xl font-semibold text-custom-accent sm:text-2xl">
                      {phone.display}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
              Follow Us
            </p>

            <div className="mt-4 flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-custom-accent/30 text-custom-accent transition hover:bg-custom-accent hover:text-white"
                  >
                    <Icon className="text-lg" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div className="h-[340px] border-t border-line sm:h-[420px] lg:h-auto lg:min-h-[480px] lg:border-l lg:border-t-0">
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
    </section>
  );
}
