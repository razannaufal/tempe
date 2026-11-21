# Tempe CLI

## Windows installation

Download `Tempe-Setup-vX.Y.Z-windows-x64.exe` from [GitHub Releases](https://github.com/razannnaufal/tempe-cli/releases/latest) and run it. The installer places Tempe in your user profile and adds it to your user `PATH`; no administrator access or separate Node.js installation is required.

Open a new PowerShell or VS Code terminal after installation, then run:

```powershell
tempe
tempe api
```

`tempe api` opens API provider and key configuration.

## Install with npm

After the package is published to npm, install it globally with Node.js 20 or newer:

```powershell
npm install -g tempe-cli
tempe
```

## Build from source

Requires Node.js 20 or newer:

```powershell
npm ci
npm run build
npm start
```