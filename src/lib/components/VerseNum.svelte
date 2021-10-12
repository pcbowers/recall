<script lang="ts">
  import type { MarkProps } from '@portabletext/svelte'

  type VerseNumProps = {}

  export let mark: VerseNumProps = {}
  export let portableText: MarkProps<VerseNumProps>

  $: mark = portableText.mark
</script>

<sup><slot /></sup>
