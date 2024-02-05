import { z } from "zod";

const NoteDataSchema = z.object({
  noteId: z.number(),
  referenceId: z.number().nullable(),
  note: z.string().default(""),
  createdBy: z.number().nullable(),
  createdDate: z.string().nullable(),
  isAdmin: z.boolean().default(false),
  userName: z.string().nullable(),
  editAvailable: z.boolean().default(false),
  deleteAvailable: z.boolean().default(false),
  isAlert: z.boolean().default(false),
  type: z.string().or(z.number()).nullable(),
  noteType: z.string().nullable(),
});

export const NotesDataListSchema = z.array(NoteDataSchema);
export type TNoteDataParsed = z.infer<typeof NoteDataSchema>;
