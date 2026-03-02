---
stepsCompleted: []
inputDocuments: []
workflowType: 'prd'
---

# Documento de Requisitos del Producto — Creación Guiada de PRD

**Autor:** Automated Bot
**Fecha:** 2026-03-02

## Resumen ejecutivo

Este documento describe el feature "Creación Guiada de PRD": un flujo y herramientas que permiten a equipos generar, validar y versionar Product Requirements Documents (PRD) mediante plantillas y workflows guiados dentro del repositorio BMAD. El objetivo es estandarizar la calidad de los PRD, facilitar la trazabilidad hacia épicas e historias y automatizar comprobaciones básicas de completitud.

## Objetivos

- Facilitar la creación de PRD coherentes y con frontmatter válido mediante un workflow guiado.
- Habilitar validación automática de cobertura (FRs/NFRs) y enlaces a épicas.
- Generar artefactos trazables que se integren con la planificación (epics.md, stories).

## Diferenciadores

- Integración directa con los workflows BMAD existentes.
- Plantillas opinionadas y validaciones automáticas que evitan errores de referencia.

## Alcance

- Incluye: interfaz de workflow para crear PRD, plantilla con frontmatter, validación básica (presencia de FR/NFR/criterios de aceptación), generación de artefactos de planificación mínimos (epics/stories referencia).
- No incluye: editor UI avanzado, integración con sistemas externos de gestión de incidencias (Jira/GitHub Issues) ni despliegue automático de pipelines.

## Requisitos funcionales (FR)

FR1: El sistema deberá generar un archivo `docs/prd.md` a partir de la plantilla, incluyendo `stepsCompleted`, `inputDocuments` y `workflowType: 'prd'` en el frontmatter.

FR2: El workflow deberá solicitar (o aceptar) metadatos clave: `project_name`, `user_name`, `date`, `planning_artifacts` y guardar estos valores en el PRD.

FR3: El sistema deberá extraer y listar en un informe las FRs y NFRs encontradas en el PRD.

FR4: El workflow deberá actualizar o crear una referencia en `planning/epics.md` cuando el PRD define épicas o historias.

FR5: El sistema deberá admitir ejecución no interactiva (modo batch) cuando se le proveen metadatos y archivos de entrada.

## Requisitos no funcionales (NFR)

NFR1: Las validaciones iniciales deberán completarse en menos de 60 segundos para repositorios pequeños (<500 archivos).

NFR2: Todos los archivos generados deberán seguir la convención de file-refs del repositorio (rutas relativas, frontmatter consistente).

NFR3: Las acciones sobre el repositorio deben ser idempotentes: re-ejecutar la creación no debe duplicar secciones.

NFR4: El workflow deberá producir mensajes de log claros y retornar códigos de salida apropiados (0 éxito, !=0 fallo).

## Criterios de aceptación

- Al ejecutar el workflow de creación con metadatos válidos se crea `docs/prd.md` con frontmatter requerido.
- El informe de implementación (`planning/implementation-readiness-report-*.md`) contiene la lista completa de FRs y NFRs extraídas.
- `planning/epics.md` contiene al menos una referencia al PRD o épica principal cuando aplica.
- Las pruebas unitarias cubren generación de frontmatter y extracción básica de requisitos.

## Casos límite (Casos límite / Edge cases)

- Entrada incompleta: si faltan metadatos críticos, el workflow debe fallar con mensaje claro y no escribir archivos corruptos.
- PRD fragmentado (sharded): cuando el PRD está dividido en varios archivos, el flujo debe poder procesar todas las partes y consolidarlas.
- Conflicto de archivo existente: si `docs/prd.md` ya existe, el workflow debe crear una copia con timestamp o requerir confirmación en modo interactivo.
- Repositorio grande: cuando la repo excede límites de rendimiento, el workflow debe degradar a validaciones parciales y advertir al usuario.

## Fuera de alcance

- Sincronización automática con herramientas externas de gestión de proyectos (Jira, Trello, etc.).
- Análisis profundo de dependencias técnicas (esto se delega a workflows de arquitectura/implementación).
- UI gráfica para edición de PRD (solo CLI / workflows textuales en esta fase).

## Riesgos

- Riesgo de adopción: los equipos pueden ignorar el workflow si la integración con sus procesos actuales es limitada.
- Falsos positivos/negativos en la validación automática si las FR/NFR no siguen convención esperada.
- Sobrescritura accidental de PRD existente sin control de versiones adecuado.

## Dependencias

- Plantilla base: `src/bmm/workflows/2-plan-workflows/create-prd/templates/prd-template.md`.
- Scripts de validación y utilidades en `tools/` para comprobaciones de file-refs.
- Archivo de épicas: `planning/epics.md` para vinculación de trazabilidad.

## Trazabilidad

- Epic de referencia (ejemplo): `planning/epics.md` → Epic 1: PRD Creation and Validation
- Historia de desarrollo: `planning/stories/1-1-guided-prd-creation.md`

## Notas

- Recomendado: añadir una sección de métricas de éxito (time-to-first-prd, % PRD validados) en próximas iteraciones.
