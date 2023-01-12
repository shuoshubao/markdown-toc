# mdx-toc

> Table of contents

# Usage

```js
import MarkdownIt from 'markdown-it'
import getTocData from 'mdx-toc'

const content = '<h1>title one</h1>'

// const tocData = getTocData(content, options)
const tocData = getTocData(content, {
  parser: md => MarkdownIt().render(md)
})

const {
  markdown = '',
  html = '',
  list = [],
  treeData: []
} = tocData
```

# Options

| Name    | Type     | Description                          | Default          |
| ------- | -------- | ------------------------------------ | ---------------- |
| parser  | Function | function to convert markdown to html | `null`, required |
| slugify | Function | slug function                        | s => s           |
| space   | Number   | number of spaces                     | 2                |

# Examples

- https://shuoshubao.github.io/#tool/Markdown

# Others

- doctoc
- markdown-it-toc
- markdown-toc
- markdown-it-table-of-contents
