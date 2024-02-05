import { z } from "zod";

/**
[
    {
        "messageId": 20381,
        "clientId": 1962,
        "clientName": null,
        "title": "Hello world",
        "description": "Check it out",
        "sentDate": "2023-07-14T00:00:00",
        "expiryDate": "2023-11-30T00:00:00",
        "active": true,
        "link": "https://rentallsoftware.com"
    }
]
 */

export const ServerMessageSchema = z.object({
  messageId: z.preprocess((val) => String(val), z.string()),
  title: z.preprocess((val) => String(val), z.string()),
  description: z.string().nullable(),
  sentDate: z.string().nullable(),
  expiryDate: z.string().nullable(),
  link: z.string().nullable(),
  active: z.preprocess((val) => Boolean(val), z.boolean()),
});

export const ServerMessageListSchema = z.array(ServerMessageSchema);
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
