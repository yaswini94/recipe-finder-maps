import type { NextApiRequest, NextApiResponse } from "next";
import { getMealById } from "@/lib/api";
import type { Meal } from "@/types/meal";

type ResponseData = { meal: Meal | null } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query.id;
  if (typeof id !== "string" || !id) {
    return res.status(400).json({ error: "Missing meal id" });
  }

  try {
    const result = await getMealById(id);
    if (!result.ok) {
      const status = result.error.code === "HTTP_404" ? 404 : 500;
      return res.status(status).json({ error: result.error.message });
    }
    return res.status(200).json({ meal: result.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
