<script lang="ts">
    import { registerMasonry } from "masonry-pf";
    import type { PageData } from "./$types";

    import Header from "./blocks/Header.svelte";
    import About from "./blocks/About.svelte";
    import CurrentWork from "./blocks/CurrentWork.svelte";
    import Education from "./blocks/Education.svelte";
    import RecentProjects from "./blocks/RecentProjects.svelte";
    import Contact from "./blocks/Contact.svelte";

    export let data: PageData;

    // Wrapper to fix type compatibility with Svelte 5 actions
    function masonryAction(node: HTMLElement) {
        registerMasonry(node);
        return {
            destroy() {},
        };
    }
</script>

<svelte:head>
    <title>falk.website</title>
    <meta
        name="description"
        content="falk.website - Personal portfolio and projects"
    />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="falk.website" />
    <meta
        property="og:description"
        content="falk.website - Personal portfolio and projects"
    />
    <meta property="og:type" content="website" />
</svelte:head>

<div
    class="flex flex-col justify-center items-center min-w-full w-fit min-h-full py-12"
>
    <div use:masonryAction class="masonry gap-9 py-0 -mt-6 p-6">
        <Header />
    </div>

    <div use:masonryAction class="masonry gap-9 p-6">
        <About />
        <CurrentWork />
        <Education />
        <RecentProjects pinnedRepos={data.pinnedRepos} error={data.error} />
        <Contact />
    </div>
</div>

<style>
    .masonry {
        display: grid;
        justify-content: center;

        --width: 250px;
        --gap: 1.5rem;

        grid-template-columns: repeat(1, var(--width));
        grid-template-rows: masonry;
    }

    /* 2 * 250px + 1 * 36px + 2 * 24px = 608px */
    @media (min-width: 608px) {
        .masonry {
            grid-template-columns: repeat(2, var(--width));
        }
    }

    /* 3 * 250px + 2 * 36px + 2 * 24px = 960px */
    @media (min-width: 960px) {
        .masonry {
            grid-template-columns: repeat(3, var(--width));
        }
    }

    /* 4 * 250px + 3 * 36px + 2 * 24px = 1394px */
    @media (min-width: 1394px) {
        .masonry {
            grid-template-columns: repeat(4, var(--width));
        }
    }

    /* 5 * 250px + 4 * 36px + 2 * 24px = 1856px */
    @media (min-width: 1856px) {
        .masonry {
            grid-template-columns: repeat(5, var(--width));
        }
    }
</style>
