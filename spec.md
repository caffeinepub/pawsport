# Pawsport

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Pet profile management: create/edit pets with name, species, breed, age, photo
- Health timeline: log vet visits, vaccinations, medications, and health events per pet
- Symptom analyzer: upload a photo and describe symptoms to get an AI-style assessment
- Care reminders: set recurring reminders for medications, grooming, vaccinations
- Sitter share: generate a shareable link with a read-only view of a pet's health summary
- Document storage: upload and view vet bills, vaccination records, and medical documents
- Authorization: user login to protect personal pet data

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan
1. Backend: pet profile CRUD, health record CRUD, reminder CRUD, sitter share token generation, blob storage for photos/documents, authorization
2. Frontend: dashboard with pet list, pet detail page with timeline, symptom analyzer UI (photo upload + text input + mock AI response), reminders section, sitter share modal, document upload viewer
3. Components: authorization, blob-storage, http-outcalls (for AI symptom analysis)
