<script lang="ts">
    import "./layout.css";
    import raw1 from "$lib/assets/favicon-1col.svg?raw";
    import raw2 from "$lib/assets/favicon-2col.svg?raw";
    import raw3 from "$lib/assets/favicon-3col.svg?raw";
    import raw4 from "$lib/assets/favicon-4col.svg?raw";
    import raw5 from "$lib/assets/favicon-5col.svg?raw";
    import { browser } from "$app/environment";
    import IconSun from "@tabler/icons-svelte/icons/sun";
    import IconMoon from "@tabler/icons-svelte/icons/moon";

    let isDark = $state(
        browser && document.documentElement.classList.contains("dark"),
    );

    let fill = $derived(isDark ? "#ffffff" : "#000000");

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

    const applyTheme = (dark: boolean) => {
        document.documentElement.classList.toggle("dark", dark);
        isDark = dark;
        localStorage.setItem("theme", dark ? "dark" : "light");
    };

    const toggleTheme = (e: MouseEvent) => {
        const btn = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = btn.left + btn.width / 2;
        const y = btn.top + btn.height / 2;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        );

        if (!document.startViewTransition) {
            applyTheme(!isDark);
            return;
        }

        const goingDark = !isDark;
        const transition = document.startViewTransition(() => {
            applyTheme(goingDark);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 750,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    pseudoElement: "::view-transition-new(root)",
                },
            );
        });
    };

    $effect(() => {
        const mql = matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                document.documentElement.classList.toggle("dark", e.matches);
                isDark = e.matches;
            }
        };
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    });
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

<button
    onclick={toggleTheme}
    aria-label="Toggle dark mode"
    class="absolute top-2.5 right-2.5 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full"
>
    {#if isDark}
        <IconSun size={20} />
    {:else}
        <IconMoon size={20} />
    {/if}
</button>
