#!/bin/bash
# Lanzador de doble clic del instalador del motor de Idealas (macOS).
# Sólo busca Node y corre instalar.mjs, que vive en esta misma carpeta.
# Si macOS no lo deja abrir: clic derecho → Abrir, o en la terminal:
#   bash Instalar-Idealas.command
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo
  echo "  Falta Node.js 24. Instálalo con:"
  echo
  echo "      brew install node@24"
  echo
  echo "  y vuelve a abrir este instalador."
  echo
  read -r -p "  Enter para cerrar…" _
  exit 1
fi
node instalar.mjs "$@" || true
echo
read -r -p "  Enter para cerrar…" _
