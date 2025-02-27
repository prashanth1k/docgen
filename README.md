# Document Generator App

This project is a Nuxt 3 application that allows users to generate PDFs from a provided template and JSON data. The app has a user-friendly interface for creating and editing both the template (using a rich text editor) and the JSON data. The generated output is displayed in two formats: a downloadable PDF and a rich text preview.

- Tiptap is used for rich text editing.
- PDF is generated client-side. There are no specific server libraries needed.
- User can preview or save PDF.

Common use cases can be -

1. Generate mail merge documents from templates and data
1. Generate invoices
1. Generate filled application forms

This project is more of a demonstration rather than a library. Use the concepts here to generate PDFs for your own projects.

## Technology Stack

- Nuxt 3
- Vue 3 (Composition API)
- Tiptap
- jsPDF - PDF Generation
- html2canvas - HTML to Canvas for PDF
- vue3-json-editor - JSON Editor
- Tailwind CSS - Styling
- Pinia - State management

## Setup

Make sure to install dependencies:

```bash
# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
