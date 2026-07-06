import type {
  DirectorCategoryResult,
  DirectorRecommendation,
  RecommendationFilter,
} from "./types";

export function collectRecommendations(
  categories: DirectorCategoryResult[],
): DirectorRecommendation[] {
  return categories.flatMap((category) => category.recommendations);
}

export function filterRecommendations(
  recommendations: DirectorRecommendation[],
  filter: RecommendationFilter,
) {
  if (filter === "All") {
    return recommendations;
  }

  const severity =
    filter === "Warnings"
      ? "warning"
      : filter === "Suggestions"
        ? "suggestion"
        : "passed";

  return recommendations.filter(
    (recommendation) => recommendation.severity === severity,
  );
}
