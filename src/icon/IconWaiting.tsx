export function IconWaiting() {
    return (
        <span
            className="inline-flex h-8 w-8 shrink-0 animate-pulse items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400"
            aria-label="waiting"
        >
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v5l3 2" />
            </svg>
        </span>
    );
}