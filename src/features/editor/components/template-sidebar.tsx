import Image from "next/image";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActiveTool, Editor, fonts } from "@/features/editor/types";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { AlertTriangle, Loader, Crown } from "lucide-react";
import { useGetTemplates } from "@/features/projects/api/use-get-templates";
import { ResponseType } from "@/features/projects/api/use-get-templates";
import { useConfirm } from "@/hooks/use-confirm";
import { usePaywall } from "@/features/subcriptions/hooks/use-paywall";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to replace the current template with this template"
  );

  const { shouldBlock, triggerPaywall } = usePaywall();

  const { data, isLoading, isError } = useGetTemplates({
    limit: "20",
    page: "1",
  });

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClickTemplate = async (template: ResponseType["data"][0]) => {
    if (template.isPro && shouldBlock) {
      triggerPaywall();
      return;
    }

    const ok = await confirm();

    if (ok) {
      editor?.loadJson(template.json);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden"
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />

      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to fetch templates
          </p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data &&
              data.map((template) => {
                return (
                  <button
                    style={{
                      aspectRatio: `${template.width}/${template.height}`,
                    }}
                    onClick={() => onClickTemplate(template)}
                    key={template.id}
                    className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                  >
                    <Image
                      fill
                      src={template.thumbnailUrl || ""}
                      alt={template.name || ""}
                      className="object-cover"
                    />
                    {template.isPro && (
                      <div className="absolute top-2 right-2 flex items-center bg-black/50 rounded-full">
                        <Crown className="size-4 text-yellow-500 fill-yellow-500 text-xs" />
                      </div>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white  p-1 bg-black/50 text-left">
                      {template.name}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
