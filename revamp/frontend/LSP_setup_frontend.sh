#!/bin/bash

# LSP Setup for Frontend Project
# This script configures language servers for the frontend development environment

echo "🚀 Setting up Language Servers for Frontend Development..."

# Navigate to the frontend project directory
cd "$(dirname "$0")"

# Function to check if npm package exists
check_npm_package() {
    if npm list -g "$1" > /dev/null 2>&1; then
        echo "✓ $1 is already installed globally"
        return 0
    else
        echo "✗ $1 is not installed globally"
        return 1
    fi
}

# Function to install npm package globally
install_npm_package() {
    echo "Installing $1 globally..."
    npm install -g "$1"
}

# Frontend-specific LSP servers
echo "📦 Checking frontend-specific Language Servers..."

# TypeScript/JavaScript language server
if ! check_npm_package "typescript-language-server"; then
    install_npm_package "typescript-language-server"
fi

# CSS language server
if ! check_npm_package "vscode-css-languageserver-bin"; then
    install_npm_package "vscode-css-languageserver-bin"
fi

# HTML language server
if ! check_npm_package "vscode-html-languageserver-bin"; then
    install_npm_package "vscode-html-languageserver-bin"
fi

# JSON language server
if ! check_npm_package "vscode-json-languageserver-bin"; then
    install_npm_package "vscode-json-languageserver-bin"
fi

# Astro language server (if project uses Astro)
if [ -f "astro.config.mjs" ] || [ -f "astro.config.js" ] || [ -f "astro.config.ts" ]; then
    echo "🪐 Astro project detected, checking for Astro language server..."
    if ! check_npm_package "@astrojs/language-server"; then
        install_npm_package "@astrojs/language-server"
    fi
fi

# Vue language server (if project uses Vue)
if [ -d "src/components" ] && grep -r "vue" src/components/ > /dev/null 2>&1; then
    echo "🟢 Vue project detected, checking for Vue language server..."
    if ! check_npm_package "vue-language-server"; then
        install_npm_package "vue-language-server"
    fi
fi

# Tailwind CSS language server (if applicable)
if [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ]; then
    echo "🎨 Tailwind CSS detected, checking for Tailwind language server..."
    if ! check_npm_package "@tailwindcss/language-server"; then
        install_npm_package "@tailwindcss/language-server"
    fi
fi

# Set up environment variables for LSP configuration
echo "🔧 Setting up LSP environment variables..."

export LSPSetupFile="/home/maarten/website-optimization/frontend/LSP_setup_frontend.sh"

# Additional frontend-specific environment variables
export NODE_ENV="development"
export ESLINT_USE_FLAT_CONFIG="false"

# Display LSP server status
echo "📊 LSP Server Status:"
echo "===================="

# Check TypeScript LSP
if check_npm_package "typescript-language-server"; then
    echo "✅ TypeScript Language Server: Available"
    echo "   Command: typescript-language-server --stdio"
else
    echo "❌ TypeScript Language Server: Not available"
fi

# Check CSS LSP
if check_npm_package "vscode-css-languageserver-bin"; then
    echo "✅ CSS Language Server: Available"
    echo "   Command: vscode-css-languageserver-bin --stdio"
else
    echo "❌ CSS Language Server: Not available"
fi

# Check HTML LSP
if check_npm_package "vscode-html-languageserver-bin"; then
    echo "✅ HTML Language Server: Available"
    echo "   Command: vscode-html-languageserver-bin --stdio"
else
    echo "❌ HTML Language Server: Not available"
fi

# Check JSON LSP
if check_npm_package "vscode-json-languageserver-bin"; then
    echo "✅ JSON Language Server: Available"
    echo "   Command: vscode-json-languageserver-bin --stdio"
else
    echo "❌ JSON Language Server: Not available"
fi

# Check Astro LSP (if applicable)
if check_npm_package "@astrojs/language-server"; then
    echo "✅ Astro Language Server: Available"
    echo "   Command: astro-ls --stdio"
fi

# Check Vue LSP (if applicable)
if check_npm_package "vue-language-server"; then
    echo "✅ Vue Language Server: Available"
    echo "   Command: vls --stdio"
fi

# Check Tailwind LSP (if applicable)
if check_npm_package "@tailwindcss/language-server"; then
    echo "✅ Tailwind CSS Language Server: Available"
    echo "   Command: tailwindcss-language-server --stdio"
fi

echo ""
echo "🎉 Frontend LSP Setup Complete!"
echo ""
echo "💡 To use these language servers in your editor:"
echo "   - VS Code: Install the corresponding LSP extensions"
echo "   - Neovim: Configure in nvim/lspconfig.lua"
echo "   - Emacs: Configure in lsp-mode"
echo ""
echo "📁 Project Type: Frontend (Astro/TypeScript/CSS/HTML)"
echo "🔧 Active LSPs: TypeScript, CSS, HTML, JSON + specialized servers"