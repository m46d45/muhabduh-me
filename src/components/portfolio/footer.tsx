export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-pad border-t border-border bg-bg-deep/50 py-10">
      <div className="container-narrow flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-sm italic text-muted">
            Don't be afraid to care.
          </p>
          <p className="mt-1 text-sm text-subtle">
            © {year} Prof. Ir. Muhamad Abduh, M.T., Ph.D. ·{" "}
            <a
              href="https://muhabduh.id"
              className="hover:text-accent"
            >
              muhabduh.id
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            href="https://www.itb.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-accent"
          >
            itb.ac.id
          </a>
          <a
            href="https://iamkri.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-accent"
          >
            iamkri.id
          </a>
          <a
            href="https://linktr.ee/muhabduh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-accent"
          >
            Linktree
          </a>
          <a
            href="#top"
            className="text-muted transition-colors hover:text-accent"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
