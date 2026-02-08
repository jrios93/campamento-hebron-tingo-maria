# DEPLOYMENT GUIDE - CAMPAMENTO HEBRÓN 2026
# ======== SECURITY NOTICE ========
# ESTE ARCHIVO CONTENDRÁ INSTRUCCIONES PÚBLICAS
# ======== SECURITY NOTICE ========

## ✅ ANTES DE SUBIR A VERCEL

### 🚨 ARCHIVOS QUE ELIMINAR:
- [ ] Eliminar todos los archivos `.sql`
- [ ] Eliminar `.env.local` (contiene credenciales reales)
- [ ] Eliminar TROUBLESHOOTING.md (contiene información interna)
- [ ] Eliminar DATABASE_SETUP.md (contiene estructura de base de datos)
- [ ] Eliminar README.md si contiene información sensible

### 🔧 ARCHIVOS QUE CONSERVAR:
- [ ] Mantener `.env.example` (como plantilla)
- [ ] Mantener código fuente (sin credenciales reales)
- [ ] Mantener configuraciones públicas

## 🚀 PASOS PARA DEPLOY A VERCEL

### 1. Preparar Variables de Entorno en Vercel:
```
VITE_SUPABASE_URL=https://pffwcvykmwpybhbhltgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZndjdnlrbXdweWJoYmhsdGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTk0OTIsImV4cCI6MjA4NjA3NTQ5Mn0.to7vS5BVQh_bMRKSuytVYb6w-4FjkwtPPGbEIJmasTY
```

### 2. Archivos NECESARIOS para producción:
- [ ] `src/` (código fuente completo)
- [ ] `public/` (assets estáticos)
- [ ] `package.json` (dependencias)
- [ ] `vite.config.ts` (configuración de build)
- [ ] `vercel.json` (configuración de Vercel)

### 3. Configuración de Build:
```bash
npm run build
# o
pnpm build
```

## 🛡️ SEGURIDAD IMPLEMENTADA

### ✅ Variables de entorno:
- [ ] Las credenciales están en variables de Vercel (no en código)
- [ ] .env.local está en .gitignore
- [ ] Validación de variables requeridas

### ✅ Código seguro:
- [ ] No hay credenciales hardcodeadas
- [ ] Validación de datos del lado servidor
- [ ] CORS configurado para dominios específicos
- [ ] Sin información sensible en el cliente

### ✅ Optimización:
- [ ] Minificación de CSS y JS
- [ ] Optimización de imágenes
- [ ] Headers de seguridad configurados
- [ ] Build optimizado para producción

## 📋 CHECKLIST FINAL ANTES DE DEPLOY

### 🔍 Verificar:
- [ ] No hay credenciales en el código
- [ ] Variables de entorno configuradas en Vercel
- [ ] Build funciona localmente
- [ ] Dashboard funciona con producción
- [ ] Formularios envían datos a Supabase
- [ ] Validación de duplicados funciona

### 🧪 Testing final:
- [ ] Probar formularios en modo producción
- [ ] Verificar dashboard con datos reales
- [ ] Probar responsive en móviles
- [ ] Probar validación de edad
- [ ] Probar prevención de duplicados

## 🌐 ESTRUCTURA FINAL

```
campamento-hebron-tingo-maria/
├── src/                    # ✅ Código fuente completo
├── public/                  # ✅ Assets estáticos
├── package.json             # ✅ Dependencias
├── vite.config.ts           # ✅ Configuración de build
├── vercel.json             # ✅ Configuración Vercel
├── .env.example            # ✅ Plantilla (sin datos reales)
├── .gitignore              # ✅ Ignorar archivos sensibles
└── dist/                   # ✅ Build de producción
```

## 🔧 COMANDOS FINALES

```bash
# 1. Limpiar archivos sensibles
rm *.sql DATABASE_*.md TROUBLESHOOTING.md .env.local

# 2. Build para producción
pnpm build

# 3. Deploy a Vercel
vercel --prod

# 4. Configurar variables en dashboard de Vercel
```

## ✅ RESULTADO ESPERADO

- 🌐 Sitio funcional en Vercel
- 🔒 Sin información sensible expuesta
- 📊 Dashboard funcionando con datos reales
- 📝 Formularios conectados a Supabase
- 🛡️ Seguridad implementada
- 📱 Responsive y optimizado