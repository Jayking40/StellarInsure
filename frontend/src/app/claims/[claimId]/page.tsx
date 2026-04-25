import React from "react";
import ClaimDetailPageClient from "./claim-detail-page-client";

export default function ClaimDetailPage({
  params,
}: {
  params: { claimId: string };
}) {
  return <ClaimDetailPageClient params={params} />;
}
