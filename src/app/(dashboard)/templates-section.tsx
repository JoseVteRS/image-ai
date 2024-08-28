"use client";

import {
  ResponseType,
  useGetTemplates,
} from "@/features/projects/api/use-get-templates";
import { AlertTriangle, Loader } from "lucide-react";
import React from "react";
import { TemplateCard } from "./template-card";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useRouter } from "next/navigation";
import { usePaywall } from "@/features/subcriptions/hooks/use-paywall";

export const TemplatesSection = () => {
  const router = useRouter();
  const { shouldBlock, triggerPaywall } = usePaywall();

  const { data, isLoading, isError } = useGetTemplates({
    page: "1",
    limit: "4",
  });

  const mutation = useCreateProject();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Start from a template</h3>
        <div className="flex flex-col items-center justify-center h-32">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Start from a template</h3>
        <div className="flex flex-col items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to laod templates
          </p>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return null;
  }

  const onClick = (template: ResponseType["data"][0]) => {
    if (template.isPro && shouldBlock) {
      triggerPaywall();
      return;
    }
    mutation.mutate(
      {
        name: `${template.name} Project`,
        json: template.json,
        width: template.width,
        height: template.height,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}`);
        },
      }
    );
  };

  return (
    <div>
      <h3 className="font-semibold text-lg">Start from a template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        {data?.map((template) => (
          <TemplateCard
            key={template.id}
            imageSrc={template.thumbnailUrl || ""}
            title={template.name}
            description={`${template.width} x ${template.height} px`}
            width={template.width}
            height={template.height}
            isPro={template.isPro || false}
            onClick={() => onClick(template)}
            disabled={mutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};
