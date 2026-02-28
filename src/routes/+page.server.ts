import { GITHUB_TOKEN } from "$env/static/private";
import type { PageServerLoad } from "./$types";

interface PinnedRepo {
    name: string;
    description: string;
    url: string;
    stargazerCount: number;
    forkCount: number;
    primaryLanguage?: {
        name: string;
        color: string;
    };
}

export const load: PageServerLoad = async () => {
    const query = `
    query {
      user(login: "FalkZ") {
        pinnedItems(first: 3, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    // Optional: Add GitHub token from environment variable for higher rate limits
    const token = GITHUB_TOKEN;
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers,
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        // Handle API errors gracefully
        if (data.errors) {
            console.error("GitHub API errors:", data.errors);
            return {
                pinnedRepos: [] as PinnedRepo[],
                error:
                    data.errors[0]?.message ||
                    "Failed to fetch pinned repositories",
            };
        }

        const pinnedRepos: PinnedRepo[] =
            data.data?.user?.pinnedItems?.nodes || [];

        return {
            pinnedRepos,
        };
    } catch (error) {
        console.error("Error fetching pinned repos:", error);
        return {
            pinnedRepos: [] as PinnedRepo[],
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
};
