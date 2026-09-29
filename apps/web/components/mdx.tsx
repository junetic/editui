import { ChromeCta } from "@/components/chrome-cta";
import { DemoVideo, EditExample } from "@/components/edit-example";

export const mdxComponents = {
  ChromeCTA: ({ location = "mdx" }: { location?: string }) => (
    <div className="my-8">
      <ChromeCta location={location} />
    </div>
  ),
  EditExample,
  DemoVideo,
};
