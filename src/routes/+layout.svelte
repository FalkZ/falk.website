<script lang="ts">
    import "./layout.css";
    import favicon1 from "$lib/assets/favicon-1col.svg";
    import favicon2 from "$lib/assets/favicon-2col.svg";
    import favicon3 from "$lib/assets/favicon-3col.svg";
    import favicon4 from "$lib/assets/favicon-4col.svg";
    import favicon5 from "$lib/assets/favicon-5col.svg";

    let { children } = $props();

    const favicons = [
        { minWidth: 1856, href: favicon5 },
        { minWidth: 1394, href: favicon4 },
        { minWidth: 960, href: favicon3 },
        { minWidth: 608, href: favicon2 },
        { minWidth: 0, href: favicon1 },
    ];

    let faviconHref = $state(favicon1);

    $effect(() => {
        const update = () => {
            const match = favicons.find((f) => window.innerWidth >= f.minWidth);
            if (match) faviconHref = match.href;
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    });
</script>

<svelte:head>
    <link rel="icon" href={faviconHref} />
</svelte:head>

{@render children()}
