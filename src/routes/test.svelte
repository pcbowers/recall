<script type="ts">
  import { onMount } from 'svelte'
  let data

  const toPlainText = (blocks = []) => {
    return blocks
      .map((block) => {
        if (block._type !== 'block' || !block.children || block.style.includes('aside')) return ''
        return `<p>${block.children
          .map((child) => {
            if (child.marks.includes('chapternum') || child.marks.includes('versenum')) return ''
            return child.text
          })
          .join('')}</p>`
      })
      .join('\n')
  }

  onMount(async () => {
    const res = await fetch(`/api/search2?ref=gen1-3&version=voice`)
    data = (await res.json()).passages.map((passage) => toPlainText(passage.content)).join('\n\n')
  })
</script>

<div class="prose">{@html data}</div>
