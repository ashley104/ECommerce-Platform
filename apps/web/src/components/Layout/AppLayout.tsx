import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children, //props.children: page content wrapped by this layout
  query, //props.query: optional used to pass search query from the page to the top menu
  selectedCategory,
  selectedTag,
  selectedHistory,
}: PropsWithChildren<{ query?: string, selectedCategory?: string, selectedTag?: string, selectedHistory?: string }>) {
  return (
    <div className="flex">
      <LeftMenu 
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        selectedHistory={selectedHistory}
      />
      <Content>
        <TopMenu query={query} />
        {children}
      </Content>
    </div>
  );
}
