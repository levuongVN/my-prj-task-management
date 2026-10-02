import type { ReactNode } from "react";

/**
 * Renderer Markdown tối giản cho câu trả lời của AI.
 * Hỗ trợ: heading, bold, italic, inline code, code fence, list, link.
 * Không dùng HTML thô nên an toàn với nội dung từ BE.
 */

const INLINE_PATTERN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let index = 0;
    let match: RegExpExecArray | null;

    while ((match = INLINE_PATTERN.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        const token = match[0];
        const key = `${keyPrefix}-${index++}`;

        if (token.startsWith("`")) {
            nodes.push(
                <code
                    key={key}
                    className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-200"
                >
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith("**")) {
            nodes.push(
                <strong key={key} className="font-semibold text-white">
                    {token.slice(2, -2)}
                </strong>
            );
        } else if (token.startsWith("[")) {
            const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (link) {
                nodes.push(
                    <a
                        key={key}
                        href={link[2]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
                    >
                        {link[1]}
                    </a>
                );
            } else {
                nodes.push(token);
            }
        } else {
            nodes.push(
                <em key={key} className="italic">
                    {token.slice(1, -1)}
                </em>
            );
        }

        lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes;
}

function renderLines(lines: string[], keyPrefix: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    lines.forEach((line, index) => {
        if (index > 0) nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
        nodes.push(...renderInline(line, `${keyPrefix}-${index}`));
    });
    return nodes;
}

const isFence = (line: string) => line.trimStart().startsWith("```");
const isHeading = (line: string) => /^#{1,4}\s+/.test(line);
const isUnordered = (line: string) => /^\s*[-*+]\s+/.test(line);
const isOrdered = (line: string) => /^\s*\d+\.\s+/.test(line);

const isBlockStart = (line: string) =>
    isFence(line) || isHeading(line) || isUnordered(line) || isOrdered(line);

const HEADING_CLASS: Record<number, string> = {
    1: "text-base font-semibold text-white",
    2: "text-[15px] font-semibold text-white",
    3: "text-sm font-semibold text-white",
    4: "text-sm font-semibold text-zinc-200",
};

export function MarkdownText({ content }: { content: string }) {
    const lines = content.split("\n");
    const blocks: ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (isFence(line)) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !isFence(lines[i])) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // bỏ dòng ``` đóng
            blocks.push(
                <pre
                    key={key++}
                    className="overflow-x-auto rounded-xl bg-black/60 p-3 text-xs leading-relaxed text-zinc-200"
                >
                    <code>{codeLines.join("\n")}</code>
                </pre>
            );
            continue;
        }

        if (isHeading(line)) {
            const level = Math.min(line.match(/^#+/)?.[0].length ?? 1, 4);
            const text = line.replace(/^#{1,4}\s+/, "");
            blocks.push(
                <p key={key++} className={HEADING_CLASS[level]}>
                    {renderInline(text, `h${key}`)}
                </p>
            );
            i++;
            continue;
        }

        if (isUnordered(line) || isOrdered(line)) {
            const ordered = isOrdered(line);
            const items: string[] = [];
            const itemPattern = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*+]\s+/;
            while (i < lines.length && (ordered ? isOrdered(lines[i]) : isUnordered(lines[i]))) {
                items.push(lines[i].replace(itemPattern, ""));
                i++;
            }
            const ListTag = ordered ? "ol" : "ul";
            blocks.push(
                <ListTag
                    key={key++}
                    className={`space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"}`}
                >
                    {items.map((item, index) => (
                        <li key={index}>{renderInline(item, `li${key}-${index}`)}</li>
                    ))}
                </ListTag>
            );
            continue;
        }

        if (!line.trim()) {
            i++;
            continue;
        }

        const paragraph: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() &&
            !isBlockStart(lines[i])
        ) {
            paragraph.push(lines[i]);
            i++;
        }
        blocks.push(
            <p key={key++}>{renderLines(paragraph, `p${key}`)}</p>
        );
    }

    return <div className="space-y-2">{blocks}</div>;
}
