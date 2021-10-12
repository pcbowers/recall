<script type="ts">
  import { onMount } from 'svelte'
  import type { Search } from 'src/types'
  import PortableText from '@portabletext/svelte'
  import ChapterNum from '$lib/components/ChapterNum.svelte'
  import VerseNum from '$lib/components/VerseNum.svelte'
  import Reference from '$lib/components/Reference.svelte'
  import Br from '$lib/components/Br.svelte'
  import Hang from '$lib/components/Hang.svelte'
  import Poetry from '$lib/components/Poetry.svelte'
  import Indent from '$lib/components/Indent.svelte'
  import ShortAside from '$lib/components/ShortAside.svelte'
  import LongAside from '$lib/components/LongAside.svelte'

  let data: Search

  onMount(async () => {
    const res = await fetch(`/api/search2?ref=gen1-3&version=voice`)
    data = await res.json()
  })
</script>

<div class="prose m-4">
  {#if data}
    {#each data.passages as passage}
      <PortableText
        blocks={passage.content}
        serializers={{
          marks: {
            chapternum: ChapterNum,
            versenum: VerseNum,
            reference: Reference,
            br: Br
          },
          blockStyles: {
            hang: Hang,
            poetry: Poetry,
            indent: Indent,
            'long-aside': LongAside,
            'short-aside': ShortAside
          }
        }}
      />
    {/each}
  {:else}
    Loading...
  {/if}
</div>
