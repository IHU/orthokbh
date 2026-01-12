import { HeroSectionPropertiesModel } from "@ihu/umbraco-components/dist/api/umbraco";
import { HeroSectionData } from "@ihu/umbraco-components";
import { HeroVariantTwo } from "../organisms/HeroVariants/HeroVariantTwo";
import { HeroVariantOne } from "../organisms/HeroVariants/HeroVariantOne";
import { HeroVariantThree } from "../organisms/HeroVariants/HeroVariantThree";

/**
 * Component registry mapping content type aliases to React components
 */
const blockVariantMap: Record<string, React.FC<any>> = {
  simple: HeroVariantOne,
  imageLeft: HeroVariantTwo,
  imageRight: HeroVariantThree,
};
export default function HeroBlockRender({
  content,
}: {
  content: HeroSectionData;
}) {
  const DynamicComponent =
    content.heroVariant && blockVariantMap[content.heroVariant]
      ? blockVariantMap[content.heroVariant]
      : undefined;

  if (!DynamicComponent) {
    return <div>Unknown hero variant</div>;
  }

  // Defensive: check for data before rendering component
  if (!content) {
    console.warn("HeroBlockRender: content is undefined");
    return null;
  }

  return <DynamicComponent content={content} />;
}
