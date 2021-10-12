<script lang="ts">
  import type { BlockProps } from '@portabletext/svelte'

  export let portableText: BlockProps

  $: block = portableText.block
  $: style = block.style
</script>

<p class="poetry"><slot /></p>

<style>
  .poetry {
    margin-left: 3em;
  }
</style>
