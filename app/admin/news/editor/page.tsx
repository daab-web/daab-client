"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import NewsEditor from "@/components/news-editor"
import { Save, Eye } from "lucide-react"

export default function NewsEditorPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  
  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving article...", { title, slug })
  }

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview article...", { title, slug })
  }

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
          <NewsEditor />
        </CardContent>
      </Card>
    </div>
  )
}
