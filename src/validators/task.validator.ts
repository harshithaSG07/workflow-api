import { z } from "zod";

export const createTaskSchema = z.object({
title: z.string().trim().min(2).max(200),
description: z.string().trim().max(2000).optional(),
status: z.enum(["pending", "in_progress", "completed"]).optional(),
priority: z.enum(["low", "medium", "high"]).optional(),
due_date: z.iso.date().nullable().optional(),
});

export const updateTaskSchema = z.object({
title: z.string().trim().min(2).max(200).optional(),
description: z.string().trim().max(2000).nullable().optional(),
status: z.enum(["pending", "in_progress", "completed"]).optional(),
priority: z.enum(["low", "medium", "high"]).optional(),
due_date: z.iso.date().nullable().optional(),
});
