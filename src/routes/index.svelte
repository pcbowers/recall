<script lang="ts">
  import type { Search } from 'src/types'
  import PortableText from '@portabletext/svelte'
  import ChapterNum from '$lib/components/ChapterNum.svelte'
  import VerseNum from '$lib/components/VerseNum.svelte'
  import Reference from '$lib/components/Reference.svelte'
  import Br from '$lib/components/Br.svelte'
  import Hang from '$lib/components/Hang.svelte'
  import Center from '$lib/components/Center.svelte'
  import Poetry from '$lib/components/Poetry.svelte'
  import Indent from '$lib/components/Indent.svelte'
  import ShortAside from '$lib/components/ShortAside.svelte'
  import LongAside from '$lib/components/LongAside.svelte'

  let theme = 'dark'
  let hover = false
  let byVerses = false
  let aborter = null
  let version = 'niv'
  let ref = 'Genesis 1, rom 1-5, john 3:16, john 1:12-7:14'
  let data: Search | string = 'Press Get Data to begin!'

  const toggleTheme = () => {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme
  }

  const toggleVersion = () => {
    version =
      version === 'niv' ? 'esv' : version === 'esv' ? 'msg' : version === 'msg' ? 'voice' : 'niv'
    getData()
  }

  const getData = async () => {
    if (aborter) aborter.abort()
    aborter = new window.AbortController()
    const res = await fetch(
      `./api/search?ref=${encodeURIComponent(ref)}&version=${encodeURIComponent(version)}`,
      { signal: aborter.signal }
    )
    aborter = null
    if (res.ok) data = await res.json()
  }

  const toggleVerses = () => {
    byVerses = !byVerses
  }
</script>

<svelte:head>
  <title>Recall</title>
</svelte:head>

<div class="flex flex-col items-center w-full h-full pt-5">
  <div class="prose">
    <h1>Welcome to Recall</h1>

    <button class="btn btn-primary" on:click={toggleVersion}>Toggle Version</button>
    <button class="btn btn-secondary" on:click={getData}>Get Data</button>
    {#if aborter}
      <button
        class="btn btn-secondary"
        on:click={() => {
          aborter.abort()
          aborter = null
        }}>Cancel Fetch</button
      >
    {/if}
    <button class="btn btn-accent" on:click={toggleVerses} disabled>Toggle Verses</button>
    <br />
    <br />
    <input
      type="text"
      class="input input-primary input-bordered w-full"
      bind:value={ref}
      placeholder="reference"
    />
    <br />
    <br />
    <button class="btn btn-info" on:click={toggleTheme}>Toggle Theme</button>
    <button class="btn btn-warning" on:click={toggleTheme}>Toggle Theme</button>
    <button class="btn btn-error" on:click={toggleTheme}>Toggle Theme</button>
    <button class="btn btn-success" on:click={toggleTheme}>Toggle Theme</button>
    <br />
    <br />
    <div
      class="bg-neutral text-neutral-content w-40 h-10 p-1"
      class:bg-neutral-focus={hover}
      on:mouseenter={() => (hover = true)}
      on:mouseleave={() => (hover = false)}
    >
      neutral
    </div>
    <div class="bg-base-100 text-base-content w-40 h-10 p-1">base 100</div>
    <div class="bg-base-200 text-base-content w-40 h-10 p-1">base 200</div>
    <div class="bg-base-300 text-base-content w-40 h-10 p-1">base 300</div>
    <div class="p-2">
      {#if data && typeof data === 'string'}
        {data}
      {:else if data && typeof data !== 'string'}
        {#each data.passages as passage}
          <h1>{passage.ref} ({passage.version})</h1>
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
                center: Center,
                'long-aside': LongAside,
                'short-aside': ShortAside
              }
            }}
          />
        {/each}
      {/if}
    </div>
  </div>
</div>
