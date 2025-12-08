<script lang="ts">
    import Block from "$lib/block.svelte";
    import { IconBrandGithub, IconMail } from "@tabler/icons-svelte";
</script>

<Block lines={3}>
    <h1>Contact Information</h1>

    <p class="flex gap-2">
        <IconBrandGithub stroke={1.55} />
        <a href="https://github.com/FalkZ">github.com/FalkZ</a>
    </p>
    <p class="flex gap-2">
        <IconMail stroke={1.55} />
        <a href="mailto:hi@falk.contact">hi@falk.contact</a>
    </p>
</Block>
