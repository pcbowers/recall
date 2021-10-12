<script lang="ts">
  import type { BlockProps } from '@portabletext/svelte'

  export let portableText: BlockProps

  $: block = portableText.block
  $: style = block.style
</script>

<p class="indent"><slot /></p>

<style>
  .indent {
    margin-left: 1.5em;
  }
</style>
