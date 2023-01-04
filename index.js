const MarkdownIt = require('markdown-it')

const repeat = (string, times) => {
  if (times < 0) {
    return ''
  }
  if (times === 1) {
    return string
  }
  return string + repeat(string, times - 1)
}

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

const recursion = (node, slugify) => {
  const children = [...node.children]
  if (children.filter(v => v.nodeType === 1).length) {
    const title = (node.firstChild.nodeValue || '').trim()
    return {
      title,
      key: slugify(title),
      children: (node.firstElementChild.tagName === 'UL' ? [...node.firstElementChild.children] : children).map(v => {
        return recursion(v, slugify)
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

/**
 * getTocData
 * @param  {String} content           字符串, markdown 或者 html
 * @param  {String} options.type      'html' 或 'markdown'
 * @param  {Function} options.slugify slugify函数
 * @param  {Number} options.space     空格的数量, 默认 2
 * @return {}
 */
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
      return [repeat(repeat(' ', space), level - 1), '*', title].join(' ')
    })
    .join('\n')

  const toc = MarkdownIt().render(headersMd)

  const fragment = stringToFragment(toc)

  return {
    markdown: headersMd,
    html: toc,
    list: headers,
    treeData: recursion(fragment.firstChild, slugify).children
  }
}
