import Hero from '../components/Hero'
import FitmentSelector from '../components/FitmentSelector'
import Categories from '../components/Categories'
import CredibilitySection from '../components/CredibilitySection'
import FeaturedProducts from '../components/FeaturedProducts'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

const HomePage = () => {
  return (
    <>
      <Hero />
      <FitmentSelector compact />
      <Categories compact />
      <FeaturedProducts />
      <Testimonials />
      <CredibilitySection />
      <CTA />
    </>
  )
}

export default HomePage
