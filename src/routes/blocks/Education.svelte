<script lang="ts">
    import Block from "$lib/block.svelte";
    import { IconDeviceDesktopAnalytics, IconTool } from "@tabler/icons-svelte";
</script>

<Block lines={4.25}>
    <h1>Education</h1>

    <ul class="flex flex-col gap-1.5">
        <li class="flex">
            <span class="w-7.5"
                ><IconDeviceDesktopAnalytics stroke={1.55} />
            </span>
            <span>Bachelor Computer Science</span>
        </li>
        <li class="flex">
            <span class="w-7.5"> <IconTool stroke={1.55} /></span>
            <span>Automation Technician</span>
        </li>
    </ul>
</Block>
