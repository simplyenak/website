import type { ListViewServerProps, PaginatedDocs } from "payload";
import ToursListClient from "./list.client";

type WorkflowStatus = "draft" | "in_review" | "approved" | "published";

const STATUSES: WorkflowStatus[] = ["draft", "in_review", "approved", "published"];

export default async function ToursListView({
  payload,
  Table,
  collectionSlug,
  columnState,
  hasCreatePermission,
  newDocumentURL,
  viewType,
  beforeActions,
  disableBulkDelete,
  disableBulkEdit,
  disableQueryPresets,
  hasDeletePermission,
  enableRowSelections,
  listMenuItems,
  queryPreset,
  queryPresetPermissions,
  renderedFilters,
  resolvedFilterOptions,
}: ListViewServerProps) {
  const results = await Promise.all(
    STATUSES.map((status) =>
      payload
        .find({
          collection: "tours",
          where: { workflowStatus: { equals: status } },
          limit: 10,
          page: 1,
          depth: 0,
        })
        .then((res) => ({ status, result: res as PaginatedDocs<any> }))
        .catch(() => ({
          status,
          result: {
            docs: [],
            hasNextPage: false,
            hasPrevPage: false,
            limit: 10,
            page: 1,
            pagingCounter: 1,
            totalDocs: 0,
            totalPages: 1,
          } as PaginatedDocs<any>,
        })),
    ),
  );

  const initialColumns = Object.fromEntries(
    results.map(({ status, result }) => [status, result]),
  ) as Record<WorkflowStatus, PaginatedDocs<any>>;

  return (
    <ToursListClient
      initialColumns={initialColumns}
      Table={Table}
      collectionSlug={collectionSlug}
      columnState={columnState}
      hasCreatePermission={hasCreatePermission}
      newDocumentURL={newDocumentURL}
      viewType={viewType}
      beforeActions={beforeActions}
      disableBulkDelete={disableBulkDelete}
      disableBulkEdit={disableBulkEdit}
      disableQueryPresets={disableQueryPresets}
      hasDeletePermission={hasDeletePermission}
      enableRowSelections={enableRowSelections}
      listMenuItems={listMenuItems}
      queryPreset={queryPreset}
      queryPresetPermissions={queryPresetPermissions}
      renderedFilters={renderedFilters}
      resolvedFilterOptions={resolvedFilterOptions}
    />
  );
}
