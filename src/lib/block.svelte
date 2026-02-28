<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        lines: number;
        children: Snippet;
    };

    let { children, lines }: Props = $props();
</script>

<div class="flex flex-col gap-3" style:height="{lines * 1.5 - 1.5}rem">
    <div>
        {@render children()}
    </div>
</div>
