<script lang="ts">
    import Block from "$lib/block.svelte";
    import { IconBrandGithub, IconMail } from "@tabler/icons-svelte";
</script>

<Block lines={4}>
    <h1>Contact</h1>

    <p class="flex mb-1.5">
        <span class="w-7.5"><IconBrandGithub stroke={1.55} /></span>
        <a href="https://github.com/FalkZ">github.com/FalkZ</a>
    </p>
    <p class="flex">
        <span class="w-7.5"> <IconMail stroke={1.55} /> </span>
        <a href="mailto:hi@falk.contact">hi@falk.contact</a>
    </p>
</Block>
