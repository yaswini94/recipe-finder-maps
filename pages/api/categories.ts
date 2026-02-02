import type { NextApiRequest, NextApiResponse } from "next";
import { getCategories } from "@/lib/api";
import type { Category } from "@/types/meal";

type ResponseData = { categories: Category[] } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await getCategories();
    if (!result.ok) {
      return res.status(500).json({ error: result.error.message });
    }
    return res.status(200).json({ categories: result.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
