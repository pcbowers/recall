<script lang="ts">
  import type { BlockProps } from '@portabletext/svelte'

  export let portableText: BlockProps

  $: block = portableText.block
  $: style = block.style
</script>

<p class="center"><slot /></p>

<style>
  .center {
    margin: auto;
    text-align: center;
  }
</style>
