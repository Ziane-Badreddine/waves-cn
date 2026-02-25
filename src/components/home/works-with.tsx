import {
  SiLucide,
  SiRadixui,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

export function WorksWith({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-6 text-3xl', className)}
      {...props}
    >
      <p className="sr-only">Works with</p>
      {/* <Vite /> */}
      <SiLucide />
      <SiRadixui />
      <SiReact />
      <SiTailwindcss />
      <SiTypescript />
    </div>
  )
}