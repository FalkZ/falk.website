<script lang="ts">
    import Content from "./content.svx";
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<Content pinnedRepos={data.pinnedRepos} error={data.error} />
