## Context

Markdown Preview Enhanced is a SUPER POWERFUL markdown extension for Visual Studio Code.

At the core of this extension is [MUME](https://github.com/shd101wyy/mume).

## Helpful links and info
- https://shd101wyy.github.io/markdown-preview-enhanced/#/customize-css
- https://shd101wyy.github.io/markdown-preview-enhanced/#/extend-parser
- https://shd101wyy.github.io/markdown-preview-enhanced/#/image-helper
- https://dev.to/supportic/markdown-badges-for-vscode-markdown-preview-enhanced-users-3e84

In VS Code you can open the Chrome DevTools from the help menu, the shortcut wasn't working for me.

## What is this repo?

This repo is a copy of my `.mume` directory with my own changes to the markdown parser and less styling.

My end goal is to essentially create my own personal replacement for web apps like Pinterset and MyMind.

I want to be able to designate the start of a card-grid in my markdown and then below that I'll be able to repeat the pattern

- img link
- title (optional)
- description (optional)
- url (optional – can link to site where I found the image)

The parser will pick each of these up and wrap them in a div with a class of `card` allowing me to create a grid of cards in my markdown preview.

In the end I still have future proof markdown files that can be used elsewhere they just won't display in a grid without the parser and styling.
