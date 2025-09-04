import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import AvatarMenu from "@/components/Avatar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-black" />
      <div className="relative">
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold">AWS Quiz</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </div>

              <AvatarMenu />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24 space-y-12">
          <div className="space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-balance !leading-[1.2]  ">
                Pass the AWS Developer Associate Exam —
                <span className="bg-red-700 text-white">
                  Or Get Your Money Back
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 leading-relaxed text-pretty">
                Gamified learning that actually works. Complete all levels,
                master AWS concepts, and pass with confidence.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-white text-black font-semibold px-8 py-4 text-xl rounded-xl transition-all duration-200 hover:scale-105"
              >
                Start Learning - $30
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center w-full h-[800px] rounded-2xl overflow-hidden bg-gray-800">
            <video
              src="demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
