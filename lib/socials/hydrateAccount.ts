import type { Account, RawSocialAccountRow } from "./socialIndex";

export function hydrateAccount(row: RawSocialAccountRow): Account {
  return {
    ...row,

    provider_account_id:
      row.provider_account_id ??
      row.id,

    access_token:
      row.oauth?.access_token ?? null,

    refresh_token:
      row.oauth?.refresh_token ?? null,

    expires_at:
      row.oauth?.expires_at ?? null,
  };
}