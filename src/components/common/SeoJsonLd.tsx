export default function SeoJsonLd({ schema, id }: { schema: Record<string, unknown> | Record<string, unknown>[]; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
