import { BeanBagBackground } from '@/components/ui/BeanBagBackground'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <BeanBagBackground />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
