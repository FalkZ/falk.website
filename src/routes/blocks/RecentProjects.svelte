<script lang="ts">
    import { IconBrandTypescript, IconBrandRust } from "@tabler/icons-svelte";

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

    export let pinnedRepos: PinnedRepo[] = [];
    export let error: string | undefined = undefined;

    const icons = {
        TypeScript: IconBrandTypescript,
        Rust: IconBrandRust,
    };
</script>

<div style="height: auto;">
    <h2>Recent Projects</h2>

    {#if error}
        <p>Error loading projects: {error}</p>
    {:else if pinnedRepos.length > 0}
        <ul>
            {#each pinnedRepos as repo}
                <li>
                    <p>
                        {#if repo.primaryLanguage}
                            <span style="color: {repo.primaryLanguage.color}">
                                ● {repo.primaryLanguage.name}
                            </span>
                            <IconBrandTypescript stroke={1.55} />
                        {/if}
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {repo.name}
                        </a>
                    </p>
                    {#if repo.description}
                        <p>{repo.description}</p>
                    {/if}
                </li>
            {/each}
        </ul>
    {:else}
        <p>No pinned repositories found.</p>
    {/if}
</div>
