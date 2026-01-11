To implement the Radix UI Inset card layouts shown in your screenshot, you need to:

Use a card container with rounded corners and border.
Use the Inset component to control padding and image/text placement.
Support different image/text arrangements (left, right, top, bottom).
Here’s a reusable example for one card (you can adjust for each layout):
import { Inset } from "@/components/atoms/ui/inset";
import { Box } from "@/components/atoms/ui/box";

export function InsetCardLeft() {
return (
<Box className="rounded-xl border bg-background p-0 flex overflow-hidden max-w-md">
<Inset side="left" size="0">
<img
          src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80"
          alt="Typography"
          className="object-cover w-40 h-full rounded-l-xl"
        />
</Inset>
<div className="p-6 flex-1">
<span className="font-bold">Typography</span> is the art and technique of arranging type to make written language legible, readable and appealing when displayed.
</div>
</Box>
);
}

export function InsetCardRight() {
return (
<Box className="rounded-xl border bg-background p-0 flex overflow-hidden max-w-md">
<div className="p-6 flex-1">
<span className="font-bold">Typography</span> is the art and technique of arranging type to make written language legible, readable and appealing when displayed.
</div>
<Inset side="right" size="0">
<img
          src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80"
          alt="Typography"
          className="object-cover w-40 h-full rounded-r-xl"
        />
</Inset>
</Box>
);
}

export function InsetCardTop() {
return (
<Box className="rounded-xl border bg-background p-0 overflow-hidden max-w-md">
<Inset side="top" size="0">
<img
          src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80"
          alt="Typography"
          className="object-cover w-full h-32 rounded-t-xl"
        />
</Inset>
<div className="p-6">
<span className="font-bold">Typography</span> is the art and technique of arranging type to make written language legible, readable and appealing when displayed.
</div>
</Box>
);
}

export function InsetCardBottom() {
return (
<Box className="rounded-xl border bg-background p-0 overflow-hidden max-w-md">
<div className="p-6">
<span className="font-bold">Typography</span> is the art and technique of arranging type to make written language legible, readable and appealing when displayed.
</div>
<Inset side="bottom" size="0">
<img
          src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80"
          alt="Typography"
          className="object-cover w-full h-32 rounded-b-xl"
        />
</Inset>
</Box>
);
}
