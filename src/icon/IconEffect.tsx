export function IconEffect({ effect }: { effect: number }) {
    return (
        <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg font-black"
            aria-label={effect > 0 ? "positive effect" : "negative effect"}
            style={
                effect > 0
                    ? {
                        color: `rgb(${Math.round(255 - (effect / 300) * 155)}, 185, 125)`,
                        borderColor: `rgb(${Math.round(230 - (effect / 300) * 110)}, 220, 175)`,
                        backgroundColor: `rgb(${Math.round(255 - (effect / 300) * 35)}, ${Math.round(255 - (effect / 300) * 25)}, ${Math.round(255 - (effect / 300) * 75)})`,
                    }
                    : {
                        color: `rgb(220, ${Math.round(185 - (Math.abs(effect) / 300) * 125)}, ${Math.round(185 - (Math.abs(effect) / 300) * 125)})`,
                        borderColor: `rgb(245, ${Math.round(220 - (Math.abs(effect) / 300) * 110)}, ${Math.round(220 - (Math.abs(effect) / 300) * 110)})`,
                        backgroundColor: `rgb(255, ${Math.round(255 - (Math.abs(effect) / 300) * 35)}, ${Math.round(255 - (Math.abs(effect) / 300) * 35)})`,
                    }
            }
        >
            {effect > 0 ? "+" : "-"}
        </span>
    );
}