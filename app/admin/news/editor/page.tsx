"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import NewsEditor from "@/components/news-editor"
import { Save, Eye, Calendar, User } from "lucide-react"

export default function NewsEditorPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving article...", { title, slug, content: editorContent })
  }

  const handlePreview = () => {
    setIsPreviewOpen(true)
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Editor</h1>
          <p className="text-muted-foreground">Create and edit news articles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Enter the basic information about your article
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="article-url-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Write your article content using the rich text editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsEditor onContentChange={setEditorContent} />
        </CardContent>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
            <DialogDescription>
              Preview how your article will appear to readers
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {title || "Untitled Article"}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{currentDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </div>
              </div>
            </div>

            <Separator />

            <div 
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
            
            {!editorContent && (
              <p className="text-center text-muted-foreground py-8">
                No content to preview. Start writing in the editor.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
