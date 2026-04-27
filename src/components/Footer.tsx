import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <BrandLogo variant="footer" />
            </div>
            <p className="text-white/70">
              Building exceptional homes with quality craftsmanship and
              attention to detail.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                Email:{" "}
                <a
                  href="mailto:info@ironhousebuilders.com"
                  className="text-white/90 hover:text-white underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 rounded-sm"
                >
                  info@ironhousebuilders.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+17735476502"
                  className="text-white/90 hover:text-white underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 rounded-sm"
                >
                  (773) 547-6502
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-xs">
          <p>
            © {new Date().getFullYear()} Iron House Builders. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
