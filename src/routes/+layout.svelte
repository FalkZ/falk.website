<script lang="ts">
    import "./layout.css";
    import raw1 from "$lib/assets/favicon-1col.svg?raw";
    import raw2 from "$lib/assets/favicon-2col.svg?raw";
    import raw3 from "$lib/assets/favicon-3col.svg?raw";
    import raw4 from "$lib/assets/favicon-4col.svg?raw";
    import raw5 from "$lib/assets/favicon-5col.svg?raw";

    import { MediaQuery } from "svelte/reactivity";

    const lightMode = new MediaQuery("prefers-color-scheme: light");

    let fill = $derived(lightMode ? "#000000" : "#ffffff");

    let { children } = $props();

    const toDataUri = (svg: string, fill: string) =>
        `data:image/svg+xml,${encodeURIComponent(svg.replaceAll("#011635", fill))}`;

    const favicons = $derived([
        { minWidth: 1856, svg: toDataUri(raw5, fill) },
        { minWidth: 1394, svg: toDataUri(raw4, fill) },
        { minWidth: 960, svg: toDataUri(raw3, fill) },
        { minWidth: 608, svg: toDataUri(raw2, fill) },
        { minWidth: 0, svg: toDataUri(raw1, fill) },
    ]);

    let width = $state(0);

    let favicon = $derived(favicons.find((f) => width >= f.minWidth)!.svg);
</script>

<svelte:window bind:innerWidth={width} />

<svelte:head>
    <link rel="icon" href={favicon} />
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

{@render children()}
