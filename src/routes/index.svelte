<script lang="ts">
  let theme = 'dark'
  let hover = false
  let byVerses = false
  let aborter = null
  let version = 'niv'
  let ref = 'Genesis 1, rom 1-5, john 3:16, john 1:12-7:14'
  let data:
    | {
        searchRef: string
        searchVersion: string
        passages: {
          refID: string
          ref: string
          versionID: string
          version: string
          passageFormatted: string
          passage: string
          verses: {
            refID: string
            ref: string
            bookID: string
            book: string
            chapter: number
            verse: number
            toVerse?: number
            textFormatted: string
            text: string
          }[]
        }[]
      }
    | string = 'Press Get Data to begin!'

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
      `./api/search?ref=${encodeURIComponent(ref)}&version=${encodeURIComponent(
        version
      )}&IGNORE_DEV`,
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
    <button class="btn btn-accent" on:click={toggleVerses}>Toggle Verses</button>
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
        {#if !byVerses}
          {#each data.passages as passage}
            <h1>{passage.ref} ({passage.refID}) ({passage.verses.length} verses)</h1>
            <h3>{passage.version} ({passage.versionID})</h3>
            {@html passage.passageFormatted}
          {/each}
        {:else}
          {#each data.passages as passage}
            <h1>{passage.ref} ({passage.refID}) ({passage.verses.length} verses)</h1>
            {#each passage.verses as verse}
              <h3>{verse.ref} ({verse.refID})</h3>
              {@html verse.textFormatted}
            {/each}
          {/each}
        {/if}
      {/if}
    </div>
  </div>
</div>
