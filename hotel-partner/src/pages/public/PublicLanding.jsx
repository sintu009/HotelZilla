import HeroSearchSection from './sections/HeroSearchSection'
import NearbyHotelsSection from './sections/NearbyHotelsSection'
import PropertyTypeBrowseSection from './sections/PropertyTypeBrowseSection'
import NewsletterAndTrendingSection from './sections/NewsletterAndTrendingSection'
import FooterNavigationSection from './sections/FooterNavigationSection'

export default function PublicLanding() {
  return (
    <main className="w-full overflow-hidden bg-white">
      <HeroSearchSection />
      <NearbyHotelsSection />
      <PropertyTypeBrowseSection />
      <NewsletterAndTrendingSection />
      <FooterNavigationSection />
    </main>
  )
}
