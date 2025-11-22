#!/bin/bash

# Script de diagnóstico para verificar el estado de las dependencias
# Ejecuta este script en la raíz de tu proyecto amalitica-frontend

echo "=========================================="
echo "DIAGNÓSTICO DE DEPENDENCIAS - AMALITICA"
echo "=========================================="
echo ""

# 1. Verificar versiones de Node y npm
echo "1. Versiones instaladas:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo ""

# 2. Verificar si existe node_modules
echo "2. Estado de node_modules:"
if [ -d "node_modules" ]; then
    echo "   ✓ La carpeta node_modules EXISTE"
    echo "   Tamaño: $(du -sh node_modules 2>/dev/null | cut -f1)"
else
    echo "   ✗ La carpeta node_modules NO EXISTE"
    echo "   → Necesitas ejecutar: npm install"
fi
echo ""

# 3. Verificar paquetes globales relacionados con el proyecto
echo "3. Paquetes globales instalados (potencialmente problemáticos):"
echo ""

# Lista de paquetes que deberían ser locales, no globales
PACKAGES=(
    "react"
    "react-dom"
    "react-router-dom"
    "axios"
    "vite"
    "tailwindcss"
    "lucide-react"
    "react-hook-form"
    "zod"
    "@radix-ui/react-avatar"
    "@radix-ui/react-dialog"
    "@radix-ui/react-label"
    "@radix-ui/react-select"
    "@radix-ui/react-slot"
)

FOUND_GLOBAL=0

for package in "${PACKAGES[@]}"; do
    if npm list -g "$package" 2>/dev/null | grep -q "$package@"; then
        echo "   ⚠️  ENCONTRADO: $package (instalado globalmente)"
        FOUND_GLOBAL=1
    fi
done

if [ $FOUND_GLOBAL -eq 0 ]; then
    echo "   ✓ No se encontraron paquetes del proyecto instalados globalmente"
fi
echo ""

# 4. Verificar package.json
echo "4. Verificación de package.json:"
if [ -f "package.json" ]; then
    echo "   ✓ package.json existe"
    echo "   Dependencias de producción: $(grep -c '"' package.json 2>/dev/null || echo "N/A")"
else
    echo "   ✗ package.json NO ENCONTRADO"
    echo "   → Asegúrate de estar en la raíz del proyecto"
fi
echo ""

# 5. Verificar .gitignore
echo "5. Verificación de .gitignore:"
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore; then
        echo "   ✓ .gitignore existe y contiene 'node_modules'"
    else
        echo "   ⚠️  .gitignore existe pero NO ignora 'node_modules'"
    fi
else
    echo "   ✗ .gitignore NO ENCONTRADO"
fi
echo ""

# Resumen y recomendaciones
echo "=========================================="
echo "RESUMEN Y RECOMENDACIONES"
echo "=========================================="
echo ""

if [ ! -d "node_modules" ]; then
    echo "⚠️  ACCIÓN REQUERIDA:"
    echo "   1. Ejecuta: npm install"
    echo "   2. Esto creará la carpeta node_modules con todas las dependencias locales"
    echo ""
fi

if [ $FOUND_GLOBAL -eq 1 ]; then
    echo "⚠️  LIMPIEZA RECOMENDADA:"
    echo "   Tienes paquetes del proyecto instalados globalmente."
    echo "   Ejecuta el script 'limpiar_dependencias_globales.sh' para eliminarlos."
    echo ""
fi

echo "✓ Diagnóstico completado"
echo ""
