import { Metadata } from 'next'
import { UnitPageClient } from '@/components/unit/UnitPageClient'

export const metadata: Metadata = {
  title: 'Unit Content - Maia',
  description: 'Interactive unit content with AI tutor support',
}

interface UnitPageProps {
  params: Promise<{
    unitId: string
  }>
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { unitId } = await params
  
  return <UnitPageClient unitId={unitId} />
}