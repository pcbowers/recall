<script lang="ts">
  import type { MarkProps } from '@portabletext/svelte'

  type ChapterNumProps = {}

  export let mark: ChapterNumProps = {}
  export let portableText: MarkProps<ChapterNumProps>

  $: mark = portableText.mark
</script>

<span><slot /></span>

<style>
  span {
    float: left;
    font-size: 3em;
    line-height: 1;
    padding-top: 5px;
    padding-left: 10px;
  }
</style>
