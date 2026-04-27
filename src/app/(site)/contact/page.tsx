"use client";

import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Get In Touch"
        subtitle="Let's discuss your next project"
        height="medium"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <div className="bg-gray-50 rounded-lg">
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready to start your dream home project? Get in touch with us
                today and let&apos;s bring your vision to life.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-dark/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-brand-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@ironhousebuilders.com"
                      className="text-gray-600 hover:text-brand-dark transition-colors"
                    >
                      info@ironhousebuilders.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-dark/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-brand-dark"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <a
                      href="tel:+15551234567"
                      className="text-gray-600 hover:text-brand-dark transition-colors"
                    >
                      (773) 547-6502
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
