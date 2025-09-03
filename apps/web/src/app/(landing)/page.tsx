import Faq from "./_components/faq";
import Features from "./_components/features";
import Footer from "./_components/footer";
import HeroSection from "./_components/hero";
import Navbar from "./_components/navbar";
import Pricing from "./_components/pricing";

export default function Index() {
	return (
		<div className="min-h-screen bg-gray-900">
			{/* Navigation */}
			<Navbar />

			{/* Hero Section */}
			<HeroSection />

			{/* Features Section */}
			<Features />

			{/* Pricing Section */}
			<Pricing />

			{/* FAQ Section */}
			<Faq />

			{/* Footer */}
			<Footer />
		</div>
	);
}
