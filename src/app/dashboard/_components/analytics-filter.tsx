'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PERIODS } from '@/lib/constants'

export const AnalyticsFilter = ({ id, period }: { id: string, period: string }) => {
  const router = useRouter();

  const handlePeriodChange = (newPeriod: string) => {
    router.push(`/dashboard/${id}?period=${newPeriod}`);
  }

  return (
    <div className="mb-6 flex gap-2">
      {Object.keys(PERIODS).map((p) => (
        <Button
          key={p}
          variant={period === p ? "default" : "outline"}
          onClick={() => handlePeriodChange(p)}
        >
          {PERIODS[p as keyof typeof PERIODS]}
        </Button>
      ))}
    </div>
  )
}