import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScientistsTranslationsTable from "./scientists";
import NewsTranslationsTable from "./news";
import { Brain, Briefcase, Newspaper } from "lucide-react";
import DirectorsTranslationsTable from "./directors";

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
          <TabsTrigger value="directors">
            <Briefcase />
            Directors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scientists">
          <ScientistsTranslationsTable />
        </TabsContent>
        <TabsContent value="news">
          <NewsTranslationsTable />
        </TabsContent>
        <TabsContent value="directors">
          <DirectorsTranslationsTable />
        </TabsContent>
      </Tabs>
    </>
  )
}
