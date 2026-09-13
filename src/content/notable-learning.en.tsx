/**
 * Caso de estudio Notable Learning — contenido en inglés. El tipo vive en
 * notable-learning.es.tsx.
 */

import { FootnoteRef } from "@/components/FootnoteRef";
import { Link } from "@/i18n/navigation";
import type { CaseStudy } from "./notable-learning.es";
import { sectionIds } from "./site";

export type { CaseStudy } from "./notable-learning.es";

export const caseStudy: CaseStudy = {
  meta: {
    description:
      "K-12 LMS for 500+ schools: a content editor designed around its failure modes and a four-layer PDF bug that ended in a streaming proxy.",
  },
  kicker: "Case study · Primary contributor · Feb – Jun 2026",
  pathSegments: ["projects", "notable-learning"],
  lead: (
    <>
      Institutional K-12 LMS for 500+ schools in the US and 10 countries, built by
      Junto AI. Full frontend and API layer: content editor, video, 5-role RBAC
      <FootnoteRef n={1} aria="Note 1" /> and FERPA compliance
      <FootnoteRef n={2} aria="Note 2" /> over a 29-entity schema.
    </>
  ),
  chips: [
    { value: "380+ commits", source: "100+ tickets" },
    { value: "delivered on time", source: "Jun 12, 2026" },
    { value: "WCAG 2.1 AA", source: "jest-axe" },
  ],
  tldr: {
    heading: "summary",
    rows: [
      {
        term: "problem",
        text: "Content editor and file pipeline for a K-12 LMS holding minors' data.",
      },
      {
        term: "role",
        text: "Primary contributor: full frontend and API layer, with weekly deliverables reviewed by the CTO.",
      },
      {
        term: "scale",
        text: "500+ schools in 10 countries · 29-entity schema · 5-role RBAC · FERPA.",
      },
    ],
    resultTerm: "result",
  },
  context: {
    id: "context",
    heading: "Context and role",
    body: [
      <>
        I was the primary contributor by volume of work in Phase 1: 380+ commits
        across 100+ tickets, with weekly deliverables reviewed by the CTO and
        production deploys with manual approval. My contract scope covered the UI
        component library, the content editor for teachers, the student and
        teacher dashboards, the multi-institution admin panel, and the video
        (Mux) and storage (Google Cloud Storage) integrations.
      </>,
      <>
        Two conditions defined the whole project: the data belonged to underage
        students — FERPA compliance: multi-tenant isolation in every query, zero
        PII in logs, action auditing — and quality was contractual, not
        aspirational: WCAG 2.1 AA with automated accessibility tests on every
        component, an 80% coverage target and Playwright E2E for the critical
        flows.
      </>,
    ],
  },
  decision: {
    id: "decision",
    heading: "The decision: designing the editor around its failure modes",
    intro: (
      <>
        The central piece of the product was the course editor for teachers:
        blocks of rich text, video, PDF and downloadable files, reorderable inside
        each lesson. I had built editors before — campaign modules and email
        templates in a financial system — and I knew where they break: not in the
        happy path, but at the edges. Before writing code, I presented to the team
        the three failure modes I had seen sink editors, and how I planned to
        design against them.
      </>
    ),
    principles: [
      {
        title: "Perceived saving matters as much as actual saving",
        text: "A teacher who loses twenty minutes of work to an accidental reload or a dropped connection never trusts the product again. The save state had to be visible and honest: a discreet but always-present signal confirms when changes are safe, and toasts explain what happened when something fails — unexpected errors as part of the design, not as a patch added later.",
      },
      {
        title: "Uploading files early creates orphans",
        text: "If every image is uploaded to the bucket at the moment the teacher inserts it, every abandoned draft leaves objects taking up storage forever. An explicit confirmation and cleanup strategy was needed.",
      },
      {
        title: "An uploaded file is untrusted input",
        text: "Even if it comes from an authenticated user. Validation had to happen on the server and against the real content of the file, not against what the client says it is.",
      },
    ],
    outro: (
      <>
        The team approved the approach and I implemented it. The final version of
        the file upload became a three-step flow that solves the three problems at
        once: an <em>initiate</em> route that issues a signed upload URL with the
        type and maximum size fixed cryptographically in the signature (enforced
        by GCS, not by the client), a direct upload from the browser to the bucket
        (the bytes never pass through the application server), and a{" "}
        <em>finalize</em> route that re-reads the first bytes of the object to
        validate on the server that the content is really a PDF, and deletes the
        object if validation fails — closing the door on orphans and on forged
        content at the same time.
      </>
    ),
  },
  war: {
    id: "war",
    heading: "The war: the PDF that would not render",
    intro: (
      <>
        The bug that cost me the most time on the project looked trivial: PDFs uploaded
        by teachers did not show in the viewer. Blank screen. The confusing part
        was that images and videos, served by the same architecture — private
        bucket, authorized route, redirect to a signed URL — worked perfectly. The
        diagnosis turned out to be a chain of four stacked layers, where each fix
        uncovered the next one.
      </>
    ),
    layers: [
      {
        label: "layer 1",
        title: "Object metadata",
        text: "When a server delivers a file, the Content-Disposition header tells the browser what to do with it: inline means “display it in the page” and attachment means “download it”. GCS kept the attachment recorded at upload time, so the browser downloaded the PDF or navigated to it instead of showing it inside the lesson. The fix was to force inline when generating the signed URL, with filename sanitization so a malicious filename could not inject content into the header.",
      },
      {
        label: "layer 2",
        title: "CSP",
        text: "The Content Security Policy is an allowlist that declares which domains the application may communicate with; anything not on the list, the browser blocks. The little-known detail: when a request is redirected, the browser evaluates that list again against the final destination of the redirect, not only against the original URL. Our route redirected to the Google Cloud Storage domain, which was not on the list. It was a real and necessary fix — but it only moved the failure one step: from blocked by CSP to blocked by CORS.",
      },
      {
        label: "layer 3",
        title: "A hypothesis of mine that made things worse",
        text: "In an earlier attempt I had enabled withCredentials in the viewer — an option that tells the browser “include the cookies in this request” — with the theory that the viewer arrived without the session cookie. The theory was false, and the option had a hidden cost: when a request travels with cookies, the browser demands that every server in the chain respond with an explicit permission for credentialed requests, including GCS, which never sends it. My fix introduced a new blocker while trying to solve the original one. I had to undo my own change and verify it live against a real signed URL, watching the full negotiation pass in green. It looked solved. It wasn't.",
      },
      {
        label: "layer 4",
        title: "The root cause",
        text: "CORS is the mechanism the browser uses to decide whether a page may read data from another domain; every request carries an Origin header that identifies who makes it. The trap: react-pdf downloads the document with a fetch subject to CORS, and when that fetch is redirected to another domain, the specification forces the browser to replace the Origin with the word “null” — a deliberate mark of “this origin is no longer trustworthy after the redirect”. And no server can safely grant permission to “null”, because that same value is used by pages opened from local files and by sandboxed iframes. The request against the signed URL always died, no matter how correct the bucket configuration was. That is why images and videos never failed: img and video download their content in a relaxed mode (no-cors) where that rule does not apply.",
      },
    ],
    figure: {
      title: "The four layers of the PDF that would not render",
      desc: "Each fix uncovered the next layer: object metadata, CSP, a reverted hypothesis of my own, and the root cause in CORS. The way out: a streaming proxy.",
      resolution: "streaming proxy",
    },
    after: [
      <>
        The conclusion of layer 4 was that the problem could not be fixed by
        &ldquo;adjusting the request&rdquo;: the cross-origin hop had to be
        removed. I rewrote the PDF route from redirect to streaming proxy: the
        server obtains the signed URL, performs the fetch itself and streams the
        content to the client, forwarding the range and conditional headers
        upstream and propagating the cache headers downstream
        <FootnoteRef n={3} aria="Note 3" />, with <em>Content-Disposition</em>{" "}
        overwritten to <em>inline</em>. The browser never leaves the application
        origin; CORS disappears from the equation.
      </>,
      <>
        A sibling problem remained: the upload was also broken for large files,
        because the 4.5 MB body limit of Vercel functions is non-negotiable and
        made the advertised 50 MB limit unreachable. The solution was the
        three-step direct-to-GCS flow described above — the same pattern that was
        later replicated for the file attachment blocks.
      </>,
      <>
        Two details made this bug harder than normal. First, I had no access to
        the bucket configuration: CORS changes were applied by the infrastructure
        owners. My job was to diagnose without being able to touch anything, and to hand
        them exact instructions — what to change, in which environment and why —
        documented in the PR itself next to the reproducible command. Second, I
        used Claude as a research tool to explore the Fetch and CORS
        specifications and contrast hypotheses; the direction of the
        investigation, the live verifications and the discarded paths were mine —
        as shown by the fact that one of my hypotheses was convincing enough to
        reach production and have to be reverted.
      </>,
    ],
  },
  guards: {
    id: "guards",
    heading: "Guards against regression",
    body: (
      <>
        What remained is a test that explicitly asserts the <em>absence</em> of{" "}
        <em>withCredentials</em> — the most direct guard against repeating the
        failed attempt — a suite of 13 tests over the proxy route (ranges,
        conditionals, 304 responses without overwritten headers), server-side
        validation of the real file content, and upload limits enforced by the
        cryptographic signature instead of by the client.
      </>
    ),
    quote:
      "Each failed attempt discarded a plausible hypothesis. The correct diagnosis was not visible until the upper layers were cleared.",
  },
  better: {
    id: "better",
    heading: "What I'd improve",
    body: (
      <>
        The bucket CORS configuration lives outside the repository and is applied
        by hand per environment. A deploy to a new environment with an
        unconfigured bucket breaks the upload without any test detecting it.
        Today I would solve it with configuration as code from day one.
      </>
    ),
  },
  close: {
    id: "closing",
    heading: "Closing",
    body: (
      <>
        The project was delivered on time — June 12 — and the contract ended with
        the delivery. This project also produced the automated PR reviewer I built
        on Claude Code:{" "}
        <Link
          href={{ pathname: "/", hash: sectionIds.method }}
          className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
        >
          the other half of this story
        </Link>
        .
      </>
    ),
    backLabel: "See all projects",
  },
  notesLabel: "notes",
  backToRefAria: (n) => `Back to reference ${n}`,
  notes: [
    "RBAC — role-based access control: five roles with permissions defined by enums, not by free strings.",
    "FERPA — Family Educational Rights and Privacy Act: the US law that regulates the educational data of minors.",
    "Range allows requesting only a fragment of the file (the viewer loads a large PDF page by page); ETag is a fingerprint of the version and If-None-Match is the way to say “send it only if it changed”; Content-Range indicates which fragment is returned and Last-Modified supports caching. A proxy that does not propagate them silently breaks partial loading and caching: it would work, but slowly.",
  ],
};
