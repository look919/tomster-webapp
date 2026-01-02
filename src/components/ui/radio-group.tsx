import * as React from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps extends React.ComponentProps<'div'> {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  name: string
} | null>(null)

function RadioGroup({
  className,
  value,
  onValueChange,
  name,
  children,
  ...props
}: RadioGroupProps) {
  const generatedName = React.useId()
  const groupName = name ?? generatedName

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange, name: groupName }}
    >
      <div
        data-slot="radio-group"
        role="radiogroup"
        className={cn('grid gap-3', className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps extends Omit<
  React.ComponentProps<'input'>,
  'type'
> {
  value: string
}

function RadioGroupItem({
  className,
  value,
  id,
  ...props
}: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext)

  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup')
  }

  return (
    <input
      data-slot="radio-group-item"
      type="radio"
      id={id}
      name={context.name}
      value={value}
      checked={context.value === value}
      onChange={() => context.onValueChange?.(value)}
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
