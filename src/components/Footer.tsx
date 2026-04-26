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
              <li>Email: info@ironhousebuilders.com</li>
              <li>Phone: (555) 123-4567</li>
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
