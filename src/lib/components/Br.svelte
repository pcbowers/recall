<script lang="ts">
  import type { MarkProps } from '@portabletext/svelte'

  type BrProps = {}

  export let mark: BrProps = {}
  export let portableText: MarkProps<BrProps>

  $: mark = portableText.mark
</script>

<br /><slot />
