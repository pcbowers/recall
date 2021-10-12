<script lang="ts">
  import type { BlockProps } from '@portabletext/svelte'

  export let portableText: BlockProps

  $: block = portableText.block
  $: style = block.style
</script>

<aside><strong><slot /></strong></aside>
