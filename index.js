const MarkdownIt = require('markdown-it')

const HeaderList = [1, 2, 3, 4, 5, 6]

const defaultSlugify = s => s

const empty = {
  markdown: '',
  html: '',
  list: [],
  treeData: []
}

const stringToFragment = string => {
  const renderer = document.createElement('template')
  renderer.innerHTML = string
  return renderer.content
}

const getHeaders = ({ content, type, slugify }) => {
  const html = type === 'html' ? content : MarkdownIt().render(content)

  const fragment = stringToFragment(html)

  return [...fragment.children]
    .filter(v => {
      return HeaderList.map(v2 => ['H', v2].join('')).indexOf(v.tagName) !== -1
    })
    .map(v => {
      const { tagName, innerText } = v
      const level = Number(tagName.slice(1))
      return {
        level,
        title: innerText,
        slug: slugify(innerText)
      }
    })
}

module.exports = (content = '', { type = 'markdown', slugify = defaultSlugify, space = 2 }) => {
  if (!(content || '').trim()) {
    return empty
  }

  const headers = getHeaders({ content, type, slugify })

  if (!headers.length) {
    return empty
  }

  const headersMd = headers
    .map(v => {
      const { level, title } = v
      return [' '.repeat(space).repeat(level - 1), '*', title].join(' ')
    })
    .join('\n')

  const toc = MarkdownIt().render(headersMd)

  const fragment = stringToFragment(toc)

  const recursion = node => {
    const children = [...node.children]
    if (children.filter(v => v.nodeType === 1).length) {
      const title = (node.firstChild.nodeValue || '').trim()
      return {
        title,
        key: slugify(title),
        children: (node.firstElementChild.tagName === 'UL' ? [...node.firstElementChild.children] : children).map(v => {
          return recursion(v)
        })
      }
    }
    const { innerText } = node
    return {
      title: innerText,
      key: slugify(innerText),
      children: []
    }
  }

  return {
    markdown: headersMd,
    html: toc,
    list: headers,
    treeData: recursion(fragment.firstChild).children
  }
}
