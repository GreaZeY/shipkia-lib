import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { resolve } from "@framework/registry";

const DefaultListView = lazy(() => import("./list/BaseListView"));
const DefaultFormView = lazy(() => import("./form/BaseFormView"));

/**
 * ListViewPage - Dynamic resolver for DocType List Views.
 */
const ListViewPage: React.FC = () => {
  const { doctype } = useParams<{ doctype: string }>();
  if (!doctype) return null;

  const ViewComponent = resolve(`view:list:${doctype}`, DefaultListView);

  return (
    <Suspense fallback={null}>
      <ViewComponent doctype={doctype} />
    </Suspense>
  );
};

/**
 * FormViewPage - Dynamic resolver for DocType Form/Detail Views.
 */
const FormViewPage: React.FC = () => {
  const { doctype, name } = useParams<{ doctype: string; name: string }>();
  if (!doctype || !name) return null;

  const ViewComponent = resolve(`view:form:${doctype}`, DefaultFormView);

  return (
    <Suspense fallback={null}>
      <ViewComponent doctype={doctype} name={name} />
    </Suspense>
  );
};

export default { ListViewPage, FormViewPage };
