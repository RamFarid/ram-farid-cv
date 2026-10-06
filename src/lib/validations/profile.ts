import { z } from 'zod'

// The kinds of work Ram is open to, in the order the site lists them. None picked means not taking new work.
// Shared by the console form and its Server Action. See docs/console.md#availability
export const workTypes = ['freelance', 'fullTime', 'partTime', 'contract'] as const
export type WorkType = (typeof workTypes)[number]

export const availabilityZSchema = z.object({
  workTypes: z
    .array(z.enum(workTypes))
    .max(workTypes.length, 'tooMany')
    // Stored in the canonical order with no repeats, whatever order they were ticked in.
    .transform((picked) => workTypes.filter((type) => picked.includes(type))),
})

export type AvailabilityInput = z.infer<typeof availabilityZSchema>
