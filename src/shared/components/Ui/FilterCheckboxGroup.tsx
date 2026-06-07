interface Props {
    title: string;

    options: string[];

    selected: string[];

    onChange: (
        values: string[]
    ) => void;
}

export default function FilterCheckboxGroup({
    title,
    options,
    selected,
    onChange,
}: Props) {
    const toggleValue = (value: string) => {
        if (selected.includes(value)) {
            onChange(
                selected.filter(
                    (item) =>
                        item !== value
                )
            );
            return;
        }
        onChange([
            ...selected,
            value,
        ]);
    };

    return (
        <div>
            <h4
                className="
                    mb-3
                    text-sm
                    font-medium
                    text-zinc-400
                "
            >
                {title}
            </h4>

            <div className="space-y-2">
                {options.map((option) => (
                    <label
                        key={option}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 cursor-pointer hover:bg-zinc-900 transition"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => toggleValue(option)}
                            className="h-4 w-4 rounded border-white/20 bg-black accent-white"
                        />
                        <span className="text-white">
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}