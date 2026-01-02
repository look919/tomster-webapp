import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Flag } from 'lucide-react'

import type { ReportCategory } from '@/api/game'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { reportSong } from '@/api/game'

interface ReportSongDialogProps {
  songId: string
  isRevealed?: boolean
}

const REPORT_OPTIONS: Array<{
  value: ReportCategory
  label: string
  requiresReveal?: boolean
}> = [
  {
    value: 'WRONG_SONG_DATA',
    label: 'Wrong information about the song',
    requiresReveal: true,
  },
  { value: 'SONG_ISSUE', label: 'Problem with the song' },
  { value: 'OTHER', label: 'Something different' },
]

export const ReportSongDialog = ({
  songId,
  isRevealed = false,
}: ReportSongDialogProps) => {
  const [open, setOpen] = useState(false)

  const reportMutation = useMutation({
    mutationFn: reportSong,
    onSuccess: () => {
      setOpen(false)
      form.reset()
    },
    onError: (error) => {
      console.error('Failed to report song:', error)
    },
  })

  const form = useForm({
    defaultValues: {
      category: '' as ReportCategory | '',
      message: '',
    },
    onSubmit: ({ value }) => {
      if (!value.category) return
      reportMutation.mutate({
        songId,
        category: value.category,
        message: value.message,
      })
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-400 hover:text-destructive"
          title="Report song"
        >
          <Flag className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Song</DialogTitle>
          <DialogDescription>
            Let us know if there's an issue with this song. We'll review your
            report and take action if needed.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <form.Field name="category">
            {(field) => (
              <div className="flex flex-col gap-3">
                <Label>What's the issue?</Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as ReportCategory)
                  }
                >
                  {REPORT_OPTIONS.map((option) => {
                    const isDisabled = option.requiresReveal && !isRevealed
                    return (
                      <div
                        key={option.value}
                        className="flex items-center gap-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`report-${option.value}`}
                          disabled={isDisabled}
                        />
                        <Label
                          htmlFor={`report-${option.value}`}
                          className={`cursor-pointer font-normal ${isDisabled ? 'text-muted-foreground cursor-not-allowed' : ''}`}
                        >
                          {option.label}
                          {isDisabled && ' (reveal song first)'}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>
            )}
          </form.Field>

          <form.Field name="message">
            {(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="report-message">
                  Additional details (optional)
                </Label>
                <Textarea
                  id="report-message"
                  placeholder="Provide more information about the issue..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe selector={(state) => state.values.category}>
              {(category) => (
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={!category || reportMutation.isPending}
                >
                  {reportMutation.isPending ? 'Reporting...' : 'Submit Report'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
