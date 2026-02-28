<script lang="ts">
    import {
        IconBrandTypescript,
        IconBrandRust,
        IconBrandPython,
        IconBrandJavascript,
        IconBrandGolang,
        IconBrandPhp,
        IconBrandCpp,
        IconBrandCSharp,
        IconBrandSwift,
        IconBrandKotlin,
        IconBrandHtml5,
        IconBrandCss3,
        IconBrandVue,
        IconBrandReact,
        IconBrandSvelte,
        IconBrandAngular,
    } from "@tabler/icons-svelte";

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
        Python: IconBrandPython,
        JavaScript: IconBrandJavascript,
        Go: IconBrandGolang,
        PHP: IconBrandPhp,
        "C++": IconBrandCpp,
        "C#": IconBrandCSharp,
        Swift: IconBrandSwift,
        Kotlin: IconBrandKotlin,
        HTML: IconBrandHtml5,
        CSS: IconBrandCss3,
        Vue: IconBrandVue,
        React: IconBrandReact,
        Svelte: IconBrandSvelte,
        Angular: IconBrandAngular,
    };
</script>

<div>
    <div style="height: auto;">
        <h1>Recent Projects</h1>

        {#if error}
            <p>Error loading projects: {error}</p>
        {:else if pinnedRepos.length > 0}
            <ul class="flex flex-col gap-1.5">
                {#each pinnedRepos as repo}
                    <li>
                        <p class="flex">
                            <span class="block w-7.5">
                                {#if repo.primaryLanguage}
                                    {#if icons[repo.primaryLanguage.name]}
                                        <svelte:component
                                            this={icons[
                                                repo.primaryLanguage.name
                                            ]}
                                            stroke={1.55}
                                        />
                                    {/if}
                                {/if}
                            </span>
                            <a href={repo.url}>
                                {repo.name}
                            </a>
                        </p>
                        {#if repo.description}
                            <p class="pl-7.5">{repo.description}</p>
                        {/if}
                    </li>
                {/each}
            </ul>
        {:else}
            <p>No pinned repositories found.</p>
        {/if}
    </div>
</div>
