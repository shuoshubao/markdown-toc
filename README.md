# mdx-toc

> Table of contents

# Usage

```js
import getTocData from 'mdx-toc'

const content = '# Title one'

const tocData = getTocData(content, options)

const {
  markdown: '',
  html: '',
  list: [],
  treeData: []
} = tocData
```

# Options

| Name    | Type                      | Description    | Default    |
| ------- | ------------------------- | -------------- | ---------- |
| type    | oneOf['html', 'markdown'] | content 的类型 | 'markdown' |
| slugify | Function                  | slugify 函数   | s => s     |
| space   | Number                    | 空格的数量     | 2          |

# Examples

- https://shuoshubao.github.io/#tool/Markdown

# Others

- doctoc
- markdown-it-toc
- markdown-toc
- markdown-it-table-of-contents
