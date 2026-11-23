# Barqyar backup — 2026-11-23

This folder contains a read-only snapshot of the live Supabase database structure for the Barqyar PWA.

## GitHub source snapshot
- Repository: https://github.com/ailifedad-bot/barqyar
- Branch: main
- Source tree commit at capture: 215c39c6d9fe565df138c6cd7f066aaf94d27e5c
- The GitHub ZIP archive of the repository includes all tracked application source files, PWA assets, Supabase Edge Function source, SQL scripts, and this backup folder.

## Supabase snapshot
- Project ref: zgswoheckqasqoclhodg
- PostgreSQL: 17.11
- Snapshot file: supabase-schema-snapshot.json
- Captured: 2026-11-23 UTC
- Captures public/private tables, columns, defaults, constraints, indexes, RLS flags, RLS policies, public/private function definitions, triggers, installed extensions, and the public order-access function definition.

## Important limitations
- This is a schema/configuration snapshot, not a full database dump. It does NOT contain customer/order/product row data, Auth users/passwords, Storage object bytes, Vault secret values, Edge Function environment secrets, or provider-side project settings.
- Do not commit Supabase service-role/secret keys, database passwords, JWT signing secrets, or cron tokens to GitHub.
- To make a complete disaster-recovery backup, separately export the database data and Storage objects from the Supabase Dashboard/CLI, and securely record non-secret project configuration. Store those exports in encrypted private storage.
- The JSON snapshot is an inspection/reconstruction reference; it is not a single-click SQL restore script.
