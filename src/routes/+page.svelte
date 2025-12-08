<script lang="ts">
import { registerMasonry } from 'masonry-pf';
import type { PageData } from './$types';

import Header from './blocks/Header.svelte';
import About from './blocks/About.svelte';
import CurrentWork from './blocks/CurrentWork.svelte';
import Education from './blocks/Education.svelte';
import RecentProjects from './blocks/RecentProjects.svelte';
import Contact from './blocks/Contact.svelte';

export let data: PageData;

// Wrapper to fix type compatibility with Svelte 5 actions
function masonryAction(node: HTMLElement) {
  registerMasonry(node);
  return {
    destroy() {}
  };
}
</script>

<div class="flex flex-col justify-center items-center h-full">
  <div use:masonryAction class="masonry gap-6">
    <Header />
  </div>
  
  <div use:masonryAction class="masonry gap-6">
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

    padding: var(--gap);

    grid-template-columns: repeat(1, var(--width));
    grid-template-rows: masonry;
  }

  /* 2 * 250px + 3 * 24px = 500px + 72px = 572px */
  @media (min-width: 572px) {
    .masonry {
      grid-template-columns: repeat(2, var(--width));
    }
  }

  /* 3 * 250px + 4 * 24px = 750px + 96px = 846px */
  @media (min-width: 846px) {
    .masonry {
      grid-template-columns: repeat(3, var(--width));
    }
  }

  /* 4 * 250px + 5 * 24px = 1000px + 120px = 1120px */
  @media (min-width: 1120px) {
    .masonry {
      grid-template-columns: repeat(4, var(--width));
    }
  }

  /* 5 * 250px + 6 * 24px = 1250px + 144px = 1394px */
  @media (min-width: 1394px) {
    .masonry {
      grid-template-columns: repeat(5, var(--width));
    }
  }
</style>
