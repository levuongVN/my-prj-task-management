export function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>
    );
}
