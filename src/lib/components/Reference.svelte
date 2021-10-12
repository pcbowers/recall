<script lang="ts">
  import type { MarkProps } from '@portabletext/svelte'

  type ReferenceProps = {
    ref?: string
    bookID?: string
    book?: string
    chapter?: number
    verse?: number
    toVerse?: number
  }

  export let mark: ReferenceProps = {}
  export let portableText: MarkProps<ReferenceProps>

  $: mark = portableText.mark
</script>

<span><slot /></span>
