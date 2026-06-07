import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import Button from "./Button";

interface Props {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;

    onClose: () => void;

    onSubmit?: () => void;

    submitText?: string;

    size?: "sm" | "md" | "lg";

    loading?: boolean;
}

export default function Modal({
    isOpen,
    title,
    children,

    onClose,
    onSubmit,

    submitText = "Save",

    size = "md",

    loading = false,
}: Props) {
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            {/* Backdrop */}
            <DialogBackdrop
                transition
                className="
                    fixed inset-0
                    bg-black/70
                    backdrop-blur-sm

                    duration-300
                    data-closed:opacity-0
                "
            />

            {/* Container */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className={`
                            w-full
                            ${sizeClasses[size]}

                            rounded-[32px]
                            border border-white/10
                            bg-zinc-950

                            shadow-2xl

                            duration-300

                            data-closed:scale-95
                            data-closed:opacity-0
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
                            <DialogTitle className="text-xl font-semibold text-white">
                                {title}
                            </DialogTitle>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={onClose}
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {children}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t border-white/5 px-8 py-5">

                            {onSubmit && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={onSubmit}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Loading..."
                                        : submitText}
                                </Button>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}