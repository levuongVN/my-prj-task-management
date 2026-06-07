export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
            <div className="text-center max-w-xl">

                <h1 className="text-8xl font-bold tracking-tight">
                    404
                </h1>

                <p className="mt-6 text-2xl font-semibold">
                    Page not found
                </p>

                <p className="mt-4 text-zinc-400 leading-7">
                    The page you are looking for does not exist or has been moved.
                </p>

            </div>
        </div>
    )
}