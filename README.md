# Tailwind 101

## The goal of this repo is to get used to use tailwind css

### nvim integration

To use tailwind with neovim - install tailwindcss lsp
```
npm install -g @tailwindcss/language-server
```

Then add this line to the configuration

```
require'lspconfig'.tailwindcss.setup{}
```
