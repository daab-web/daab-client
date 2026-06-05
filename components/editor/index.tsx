import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

export default function Editor() {
  return (
    <>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="min-h-100 max-h-[70vh] overflow-y-auto outline-none p-2"
            aria-placeholder={'Enter some text...'}
            placeholder={<div className="absolute top-2 left-2 text-muted-foreground pointer-events-none">Enter some text...</div>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin delay={300} />
      <AutoFocusPlugin />
    </>
  );
}
