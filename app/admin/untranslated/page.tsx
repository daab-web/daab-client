import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScientistsTranslationsTable from "./scientists";
import NewsTranslationsTable from "./news";
import { Brain, Newspaper } from "lucide-react";

export default function Untranslated() {
  return (
    <>
      <Tabs defaultValue="scientists">
        <TabsList>
          <TabsTrigger value="scientists">
            <Brain />
            Scientists
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper />
            News
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scientists">
          <ScientistsTranslationsTable />
        </TabsContent>
        <TabsContent value="news">
          <NewsTranslationsTable />
        </TabsContent>
      </Tabs>
    </>
  )
}
