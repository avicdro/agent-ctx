# 📚 Documentación Externa (Vendorizing)

Esta carpeta contiene documentación de librerías y APIs externas para que los agentes AI puedan consultarla localmente sin depender de internet.

## 🎯 Propósito

Muchos LLMs tienen conocimiento desactualizado o limitado sobre librerías específicas. Al colocar la documentación aquí, el agente puede:

1. Consultar APIs actualizadas
2. Ver ejemplos de código recientes
3. Evitar sugerir código deprecado

## 📥 ¿Qué colocar aquí?

- **`llms.txt`**: Archivos especiales de documentación para LLMs (ej: `mui-llms.txt`, `vercel-llms.txt`)
- **API References**: Exportaciones de documentación de APIs que usas
- **Changelogs**: Notas de cambios importantes de dependencias críticas
- **Guías de migración**: Si estás migrando de una versión a otra

## 💡 Ejemplos de archivos útiles

```
docs/
├── mui-llms.txt           # Docs de Material UI para LLMs
├── nextjs-app-router.md   # Guía del App Router de Next.js
├── prisma-schema-guide.md # Referencia de schemas de Prisma
├── tailwind-v4-changes.md # Cambios de Tailwind v3 a v4
└── api-internal.md        # Documentación de tu API interna
```

## 🔍 Cómo obtener llms.txt

Muchas librerías modernas publican archivos `.txt` optimizados para LLMs:

- **Vercel**: `https://vercel.com/docs/llms.txt`
- **Material UI**: Buscar en su repositorio
- **Otros**: Revisar `/llms.txt` o `/docs/llms.txt` en el sitio oficial

## ⚠️ Notas

- Mantén solo lo esencial para no sobrecargar el contexto
- Actualiza periódicamente cuando actualices dependencias
- Prioriza las librerías que más usas en el proyecto
