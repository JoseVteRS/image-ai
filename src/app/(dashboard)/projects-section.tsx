"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontalIcon,
  Search,
  TrashIcon,
} from "lucide-react";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useConfirm } from "@/hooks/use-confirm";

export const ProjectsSection = () => {
  const router = useRouter();

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetProjects();

  const duplicateMutation = useDuplicateProject();
  const removeMutation = useDeleteProject();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to laod projects
          </p>
        </div>
      </div>
    );
  }

  if (!data?.pages.length || !data.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Not projects found</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to laod projects
          </p>
        </div>
      </div>
    );
  }

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      removeMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <h3 className="text-lg font-semibold">Recent projects</h3>
      <Table>
        <TableBody>
          {data.pages.map((group, i) => {
            return (
              <React.Fragment key={i}>
                {group.data.map((project) => {
                  return (
                    <TableRow key={project.id}>
                      <TableCell
                        onClick={() => router.push(`/editor/${project.id}`)}
                        className="font-medium flex items-center gap-x-2 cursor-pointer"
                      >
                        <FileIcon />
                        {project.name}
                      </TableCell>
                      <TableCell
                        onClick={() => router.push(`/editor/${project.id}`)}
                        className="hidden md:table-cell cursor-pointer"
                      >
                        {project.width} x {project.height} px
                      </TableCell>
                      <TableCell
                        onClick={() => router.push(`/editor/${project.id}`)}
                        className="hidden md:table-cell cursor-pointer"
                      >
                        {formatDistanceToNow(new Date(project.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="flex items-center justify-end">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={false}
                            >
                              <MoreHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-60">
                            <DropdownMenuItem
                              className="h-10 cursor-pointer"
                              disabled={duplicateMutation.isPending}
                              onClick={() => onCopy(project.id)}
                            >
                              <CopyIcon className="size-4 mr-2" />
                              Make a copy
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 cursor-pointer"
                              disabled={removeMutation.isPending}
                              onClick={() => onDelete(project.id)}
                            >
                              <TrashIcon className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};
