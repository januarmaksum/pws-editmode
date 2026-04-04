import { z } from 'zod';

import type { ComponentConfig } from '@/types/schema';

export const ComponentConfigSchema: z.ZodType<ComponentConfig> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.string(), z.unknown()),
    children: z.array(ComponentConfigSchema).optional(),
  })
);

export const SlotConfigSchema = z.object({
  slotId: z.string(),
  components: z.array(ComponentConfigSchema),
});

export const PageConfigSchema = z.object({
  templateId: z.string(),
  slots: z.array(SlotConfigSchema),
  meta: z
    .object({
      title: z.string().optional(),
      theme: z.string().optional(),
    })
    .optional(),
});
