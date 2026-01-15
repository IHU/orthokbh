import { HeroVariantTwo } from "../organisms/HeroVariants/HeroVariantTwo";
import { HeroVariantOne } from "../organisms/HeroVariants/HeroVariantOne";
import { HeroVariantThree } from "../organisms/HeroVariants/HeroVariantThree";
import { FeatureBlockData } from "@ihu/umbraco-components";
import FeatureSimple from "../organisms/FeatureVariants/FeatureSimple";
import FeatureProcess from "../organisms/FeatureVariants/FeatureProcess";
import FeatureProfile from "../organisms/FeatureVariants/FeatureProfile";
import FeatureGuide from "../organisms/FeatureVariants/FeatureGuide";

/**
 * Component registry mapping content type aliases to React components
 */
const blockVariantMap: Record<string, React.FC<any>> = {
  simple: FeatureSimple,
  process: FeatureProcess,
  profile: FeatureProfile,
  guide: FeatureGuide,
};
export default function FeatureBlockRender({
  content,
}: {
  content: FeatureBlockData;
}) {
  const DynamicComponent =
    content.featureVariant && blockVariantMap[content.featureVariant]
      ? blockVariantMap[content.featureVariant]
      : undefined;

  if (!DynamicComponent) {
    return <div>Unknown feature variant</div>;
  }

  // Defensive: check for data before rendering component
  if (!content) {
    console.warn("FeatureBlockRender: content is undefined");
    return null;
  }

  return <DynamicComponent content={content} />;
}
