<script lang="ts">
  import type { BlockProps } from '@portabletext/svelte'

  export let portableText: BlockProps

  $: block = portableText.block
  $: style = block.style
</script>

<p class="hang"><slot /></p>

<style>
  .hang {
    margin-left: 1em;
    text-indent: -1em;
  }
</style>
