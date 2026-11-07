import { Suspense } from "react";
import { BlogPostEditor } from "./post-form";

export default function BlogEditorPage() {
  return (
    // The editor reads ?id= with useSearchParams.
    <Suspense>
      <BlogPostEditor />
    </Suspense>
  );
}
