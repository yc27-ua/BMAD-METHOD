---
story_key: 1-1-guided-prd-creation
title: Guided PRD Creation
epic: 1
status: ready-for-dev
assignee: unassigned
estimate: 5d
prerequisites:
  - docs/prd-draft.md
  - planning/epics.md
---

## Description

Implement the developer-facing story to build the guided PRD creation workflow and CLI integration so project maintainers can generate `prd` artifacts using the BMAD workflows.

## Acceptance Criteria

- A new `create-prd` workflow command generates a `docs/prd-draft.md` with proper frontmatter.
- Generated PRD includes `stepsCompleted` frontmatter and `workflowType: 'prd'`.
- Implementations update `planning/epics.md` with the created story reference.
- All outputs follow repository file-ref conventions.

## Tasks

- [ ] Implement story file template and generator `create-story` step
- [ ] Wire CLI mapping for `bmad-bmm-create-prd` to produce PRD
- [ ] Add unit tests for PRD generation and frontmatter
- [ ] Document usage in `docs/` and update tutorial references

## Notes

Link to source PRD draft: docs/prd-draft.md
