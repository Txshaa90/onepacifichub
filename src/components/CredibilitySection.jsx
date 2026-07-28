import { BadgeCheck, HeadphonesIcon, ShieldCheck, Truck } from 'lucide-react'

const credibilityItems = [
  {
    title: 'Free Shipping',
    copy: 'On orders over $75',
    icon: Truck
  },
  {
    title: 'Quality Guaranteed',
    copy: '30-day returns',
    icon: ShieldCheck
  },
  {
    title: 'Expert Support',
    copy: 'Call 1-800-AUTO-PARTS',
    icon: HeadphonesIcon
  },
  {
    title: 'Trusted by Thousands',
    copy: '4.8 average rating',
    icon: BadgeCheck
  }
]

const CredibilitySection = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-y border-slate-200 py-8 md:grid-cols-2 xl:grid-cols-4">
          {credibilityItems.map(({ title, copy, icon: Icon }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon size={24} className="text-slate-950" aria-hidden />
              <div>
                <p className="font-semibold text-slate-950">{title}</p>
                <p className="text-sm text-slate-500">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CredibilitySection
