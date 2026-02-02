import type { NextApiRequest, NextApiResponse } from "next";
import { searchMeals, getMealsByCategory, getMealsByArea } from "@/lib/api";
import type { MealSummary } from "@/types/meal";

type ResponseData = { meals: MealSummary[] } | { error: string };

function mergeById(arrays: MealSummary[][]): MealSummary[] {
  const byId = new Map<string, MealSummary>();
  for (const arr of arrays) {
    for (const m of arr) {
      if (!byId.has(m.idMeal)) byId.set(m.idMeal, m);
    }
  }
  return Array.from(byId.values());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const categories =
    typeof req.query.categories === "string"
      ? req.query.categories
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const areas =
    typeof req.query.areas === "string"
      ? req.query.areas
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  try {
    if (!search && categories.length === 0 && areas.length === 0) {
      return res.status(200).json({ meals: [] });
    }

    if (search) {
      const result = await searchMeals(search);
      if (!result.ok) {
        return res.status(500).json({ error: result.error.message });
      }
      return res.status(200).json({ meals: result.data });
    }

    if (categories.length > 0 && areas.length > 0) {
      const [byCategory, byArea] = await Promise.all([
        Promise.all(categories.map((c) => getMealsByCategory(c))).then((results) =>
          mergeById(results.filter((r) => r.ok).map((r) => r.data))
        ),
        Promise.all(areas.map((a) => getMealsByArea(a))).then((results) =>
          mergeById(results.filter((r) => r.ok).map((r) => r.data))
        ),
      ]);
      const categoryIds = new Set(byCategory.map((m) => m.idMeal));
      const intersection = byArea.filter((m) => categoryIds.has(m.idMeal));
      return res.status(200).json({ meals: intersection });
    }

    if (categories.length > 0) {
      const results = await Promise.all(categories.map((c) => getMealsByCategory(c)));
      const meals = mergeById(results.filter((r) => r.ok).map((r) => r.data));
      return res.status(200).json({ meals });
    }

    if (areas.length > 0) {
      const results = await Promise.all(areas.map((a) => getMealsByArea(a)));
      const meals = mergeById(results.filter((r) => r.ok).map((r) => r.data));
      return res.status(200).json({ meals });
    }

    return res.status(200).json({ meals: [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
