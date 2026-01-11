"use client";

// lib/BlockRenderer.tsx
import React from "react";
import {
  FeatureBlock,
  UpsBlock,
  TextWithImageBlock,
  ContainerBlock,
  ContactBlock,
  ContactFormBlock,
  RichTextBlock,
  TeaserCardWithIcon,
  IFrameBlock,
  HeroBlock,
  TestBlock,
  ServiceCard,
  PriceCard,
  NewsListBlock,
  FooterBlock,
  Seo,
  CtaActionBlock,
  HeroSection,
} from "@ihu/umbraco-components";
import {
  Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockItem,
  Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem,
} from "@ihu/umbraco-components/dist/api/umbraco";
import {
  Footer,
  Feature,
  Hero,
  TextWithImage,
  Container,
  CtaAction,
} from "@/components/organisms";
import Service from "@/components/organisms/Service";
import Contact from "@/components/organisms/Contact";
import ContactForm from "@/components/organisms/ContactForm";
import RichText from "@/components/organisms/RichText";
import TeaserCard from "@/components/organisms/TeaserCard";
import IFrameMap from "@/components/organisms/IFrameMap";
import Ups from "@/components/atoms/Ups";
import HeroBlockRender from "@/components/templates/HeroBlockRender";

const blockMap: Record<string, React.FC<any>> = {
  heroBlock: HeroBlock,
  footerBlock: FooterBlock,
  featureBlock: FeatureBlock,
  containerBlock: ContainerBlock,
  contactBlock: ContactBlock,
  contactFormBlock: ContactFormBlock,
  iFrameBlock: IFrameBlock,
  newsListBlock: NewsListBlock,
  priceCard: PriceCard,
  richTextBlock: RichTextBlock,
  seoBlock: Seo,
  serviceCard: ServiceCard,
  teaserCardWithIcon: TeaserCardWithIcon,
  testBlock: TestBlock,
  textWithImageBlock: TextWithImageBlock,
  upsBlock: UpsBlock,
  ctaActionBlock: CtaActionBlock,
  heroSection: HeroSection,
};
// Define all UI components in one place
const blockUIMap: Record<string, React.FC<any>> = {
  heroBlock: Hero,
  featureBlock: Feature,
  footerBlock: Footer,
  textWithImageBlock: TextWithImage,
  containerBlock: Container,
  serviceCard: Service,
  contactFormBlock: ContactForm,
  contactBlock: Contact,
  iFrameBlock: IFrameMap,
  richTextBlock: RichText,
  teaserCardWithIcon: TeaserCard,
  upsBlock: Ups,
  ctaActionBlock: CtaAction,
  heroSection: HeroBlockRender,
};

export const BlockRenderer = ({ block }: { block: any }) => {
  // Log the block prop received
  //console.log("BlockRenderer received block:", block);
  if (!block || !block.contentType) {
    /*console.error(
      "BlockRenderer: Invalid block or missing contentType:",
      block,
      new Error().stack
    );*/
    return <div>Invalid block data : {block.contentType}</div>;
  }

  // Defensive: check for block.properties before rendering
  if (!block.properties) {
    //console.error("BlockRenderer: Missing properties field in block:", block);
    return <div>Block missing properties</div>;
  }

  const DynamicComponent = blockMap[block.contentType];
  const UIComponent = blockUIMap[block.contentType];

  //console.log("Rendering block of type:", block.contentType);
  //console.log("DynamicComponent:", DynamicComponent);
  // console.log("UIComponent:", UIComponent);

  if (!DynamicComponent || !UIComponent) {
    return <div>Component not found : {block.contentType}</div>;
  }
  return (
    <DynamicComponent element={block}>
      {({
        data,
      }: {
        data:
          | Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockItem
          | Umbraco_Cms_Core_Models_DeliveryApi_ApiBlockGridItem;
      }) =>
        // Defensive: check for data before rendering UIComponent
        data ? <UIComponent content={data} /> : <div>Block data missing</div>
      }
    </DynamicComponent>
  );
};
