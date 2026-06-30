interface LoadingProps {
    size?: number;
    text?: string;
    fullScreen?: boolean;
}

export default function Loading({
    size = 40,
    text = "Loading...",
    fullScreen = false,
}: LoadingProps) {
    const content = (
        <div className="flex flex-col items-center gap-4">
            <div
                className="animate-spin rounded-full border-4 border-zinc-700 border-t-white"
                style={{
                    width: size,
                    height: size,
                }}
            />

            {text && (
                <p className="text-sm text-zinc-400">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
            {content}
        </div>
    );
}