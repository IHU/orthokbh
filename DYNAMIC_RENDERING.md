# Dynamic Page Rendering with Umbraco CMS

This document describes the dynamic page rendering system implemented in the Next.js client application.

## Overview

The application uses a **single universal ContentPage component** to render all Umbraco page types with **dynamic block rendering**. This eliminates the need for separate page type handlers and provides a unified rendering approach.

## Architecture

```
src/
├── app/
│   └── [...slug]/
│       └── page.tsx          # Dynamic catch-all route
├── components/
│   └── BlockRenderer.tsx      # Universal block renderer
```

## Implementation

### 1. Dynamic Route (`[...slug]/page.tsx`)

**Pattern**: Catch-all route that handles all URLs

```tsx
export default async function DynamicPage({ params }: PageProps) {
  const route = slug.length > 0 ? `/${slug.join("/")}` : "/";
  const content = await umbracoClient.getByRoute(route);

  // All pages rendered through ContentPage
  return <ContentPageRenderer content={content as ContentContentModel} />;
}
```

**Features**:

- Fetches content by route from Umbraco
- Single renderer for all page types (Home, Content, StartPage, etc.)
- Automatic 404 handling via `notFound()`

### 2. Content Page Renderer

**Pattern**: Uses ContentPage component with render props

```tsx
function ContentPageRenderer({ content }: { content: ContentContentModel }) {
  return (
    <ContentPage content={content}>
      {({ data }) => (
        <main>
          {/* Breadcrumb Image */}
          {data.breadcrumbImage && <BreadcrumbBanner />}

          {/* SEO Meta */}
          {data.metaTitle && <h1>{data.metaTitle}</h1>}
          {data.metaDescription && <p>{data.metaDescription}</p>}

          {/* Rich Text Content */}
          {data.contentArea && <RichTextArea />}

          {/* Dynamic Blocks */}
          {data.blocks && <BlockRenderer blocks={data.blocks} />}
        </main>
      )}
    </ContentPage>
  );
}
```

**Rendered Elements**:

1. **Breadcrumb Image** - Hero banner or page header image
2. **Page Title** - From `metaTitle` (SEO)
3. **Page Description** - From `metaDescription` (SEO)
4. **Content Area** - Rich text content from Umbraco
5. **Block List** - Dynamically rendered blocks

### 3. Block Renderer Component

**Location**: `src/components/BlockRenderer.tsx`

**Pattern**: Switch-based dynamic block rendering

```tsx
export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div className="blocks-container space-y-8">
      {blocks.items.map((blockItem, index) => {
        const element = blockItem.content;
        return renderBlock(element, index);
      })}
    </div>
  );
}

function renderBlock(element: IApiElementModel, index: number) {
  switch (element.contentType) {
    case "heroBlock":
      return <HeroBlock element={element}>...</HeroBlock>;
    case "featureBlock":
      return <FeatureBlock element={element}>...</FeatureBlock>;
    // ... 15 total block types
  }
}
```

**Supported Block Types** (15 total):

1. `heroBlock` - Hero banners with title, text, and image
2. `featureBlock` - Feature cards with icons
3. `richTextBlock` - Rich text content
4. `textWithImageBlock` - Text alongside images
5. `contactBlock` - Contact information display
6. `contactFormBlock` - Contact forms
7. `serviceCard` - Service offerings
8. `priceCard` - Pricing tables
9. `teaserCardWithIcon` - Teaser cards with icons
10. `newsListBlock` - News article listings
11. `upsBlock` - USP/benefits grid
12. `iFrameBlock` - Embedded iframe content
13. `footerBlock` - Footer content
14. `containerBlock` - Nested block containers
15. `seo` - SEO metadata (hidden)

### Block Rendering Pattern

Each block uses the headless component pattern:

```tsx
<HeroBlock element={element}>
  {({ data }) => (
    <div className="hero-block">
      {data.title && <h1>{data.title}</h1>}
      {data.text && <p>{data.text}</p>}
      {data.image && <img src={data.image.url} alt={data.image.name} />}
    </div>
  )}
</HeroBlock>
```

## URL Routing

**Pattern**: All URLs resolved by Umbraco's routing system

| URL                    | Resolved Content Type | Rendered Component |
| ---------------------- | --------------------- | ------------------ |
| `/`                    | Home (any)            | ContentPage        |
| `/about`               | Content               | ContentPage        |
| `/services`            | Content               | ContentPage        |
| `/services/web-design` | Content               | ContentPage        |
| `/contact`             | Content               | ContentPage        |

**Note**: Content type doesn't matter - all rendered through ContentPage

## Data Flow

```
URL Request
    ↓
DynamicPage (fetch content by route)
    ↓
UmbracoClient.getByRoute(route)
    ↓
ContentContentModel (Umbraco content)
    ↓
ContentPageRenderer
    ↓
ContentPage Component (headless)
    ↓
Render Props ({ data })
    ↓
├── Breadcrumb Image
├── SEO Meta (title, description)
├── Content Area (rich text)
└── BlockRenderer
        ↓
    Loop through blocks.items
        ↓
    renderBlock(element)
        ↓
    Switch on contentType
        ↓
    Render specific block component
```

## Benefits

### 1. **Simplicity**

- Single page renderer for all content types
- No need to map Umbraco content types to React components
- Reduced code complexity

### 2. **Flexibility**

- Content editors control layout via Block List
- No developer intervention for layout changes
- Supports nested blocks (ContainerBlock)

### 3. **Type Safety**

- Full TypeScript support
- OpenAPI-generated models
- Type-safe block rendering

### 4. **Scalability**

- Adding new block types: Update BlockRenderer switch
- Adding new page types: No changes needed
- Supports unlimited nesting

### 5. **Performance**

- Server-side rendering (Next.js App Router)
- Static generation possible via `generateStaticParams`
- Incremental static regeneration ready

## Styling

**Approach**: Tailwind CSS utility classes

**Design Tokens**:

- Typography: `text-4xl`, `text-lg`, `font-bold`
- Spacing: `mb-8`, `py-8`, `space-y-8`
- Colors: `text-gray-600`, `bg-blue-600`, `hover:bg-blue-700`
- Effects: `shadow-lg`, `rounded-lg`, `hover:shadow-xl`

**Block Container**: Each block wrapped in spacing div

```tsx
<div className="blocks-container space-y-8">
  <div className="block-item">{/* Block content */}</div>
</div>
```

## Environment Configuration

```env
# .env.local
NEXT_PUBLIC_UMBRACO_API_URL=https://localhost:44383
```

## Future Enhancements

### Planned Features

1. **SEO Meta Tags** - Dynamic `<head>` injection from ogImage, ogTitle, etc.
2. **Breadcrumbs** - Automatic breadcrumb generation from route
3. **Image Optimization** - Next.js Image component integration
4. **Block Variants** - Style variations per block type
5. **Preview Mode** - Umbraco preview integration
6. **Draft Content** - Preview unpublished content
7. **A/B Testing** - Block variant testing
8. **Analytics** - Block impression tracking

### Possible Improvements

1. **Default Block Renderers** - Fallback rendering for unknown blocks
2. **Block Skeleton Loading** - Loading states for blocks
3. **Error Boundaries** - Per-block error handling
4. **Block Lazy Loading** - Load blocks on scroll
5. **Block Animations** - Entrance animations
6. **Custom Block Styles** - Editor-controlled styling
7. **Block Reordering** - Client-side block reordering
8. **Block Search** - Search within blocks

## Developer Guide

### Adding a New Block Type

1. **Umbraco**: Create new Element Type in Umbraco
2. **Generate Models**: Run `npm run openapi:generate` in `packages/core`
3. **Generate Component**: Run `npm run generate:blocks` in `packages/core`
4. **Add to Renderer**: Update `BlockRenderer.tsx` switch statement

```tsx
case 'myNewBlock':
  return (
    <MyNewBlock element={element as MyNewBlockElementModel}>
      {({ data }) => (
        <div>
          {/* Render block */}
        </div>
      )}
    </MyNewBlock>
  );
```

5. **Build**: Run `npm run build` in `packages/core`
6. **Test**: Create content in Umbraco with new block

### Debugging

**Check block content type**:

```tsx
console.log(element.contentType); // e.g., "heroBlock"
```

**Inspect block data**:

```tsx
<HeroBlock element={element}>
  {({ data }) => {
    console.log("Hero block data:", data);
    return <div>...</div>;
  }}
</HeroBlock>
```

**Unknown block fallback**:

```tsx
default:
  return (
    <div className="unknown-block">
      Unknown block: <code>{contentType}</code>
    </div>
  );
```

## Conclusion

This universal rendering approach provides a scalable, maintainable, and type-safe solution for rendering Umbraco CMS content in Next.js. By using a single ContentPage component with dynamic block rendering, we achieve maximum flexibility while minimizing code complexity.

The system is production-ready and can handle any number of page types and block types without code changes - content editors have full control over page layouts through Umbraco's Block List editor.
