"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NewsList } from "./_components/news-list";
import { NewsCategoriesList } from "./_components/news-categories-list";

export default function NewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Nội dung"
        title="Quản lý tin tức"
        description="Quản lý bài viết và chuyên mục tin tức trên trang public"
      />
      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Bài viết</TabsTrigger>
          <TabsTrigger value="categories">Chuyên mục</TabsTrigger>
        </TabsList>
        <TabsContent value="articles">
          <NewsList />
        </TabsContent>
        <TabsContent value="categories">
          <NewsCategoriesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
