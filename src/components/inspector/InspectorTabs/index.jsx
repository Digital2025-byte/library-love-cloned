"use client";

import { PaintBrushIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import Tabs, { Tab, TabsList, TabsPanel } from "@/components/ui/Tabs";

export default function InspectorTabs({ content, style, defaultValue = "content" }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        {content ? (
          <Tab value="content">
            <PencilSimpleIcon size={18} weight="regular" aria-hidden />
            Content
          </Tab>
        ) : null}
        {style ? (
          <Tab value="style">
            <PaintBrushIcon size={18} weight="regular" aria-hidden />
            Style
          </Tab>
        ) : null}
      </TabsList>
      {content ? <TabsPanel value="content">{content}</TabsPanel> : null}
      {style ? <TabsPanel value="style">{style}</TabsPanel> : null}
    </Tabs>
  );
}
