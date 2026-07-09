# Cron job for server Hermes: i18n self-healing pipeline
# Deploy on the server:
#   hermes cron create \
#     --name i18n-heal \
#     --schedule "0 */4 * * *" \
#     --prompt "Run the i18n self-healing script" \
#     --script scripts/heal-i18n.sh \
#     --no-agent
#
# The --no-agent mode means it just runs the script and delivers its
# stdout verbatim — no LLM tokens consumed.
#
# Environment variables the script needs (set in the service or crontab):
#   GEMINI_API_KEY      — LLM translation provider
#   PAYLOAD_TOKEN       — direct API token for Payload CMS writes
#   GITHUB_TOKEN or gh auth — for git push
#
# Files:
#   scripts/heal-i18n.sh              — orchestrator
#   site/scripts/translate-content.mjs — LLM translation engine
#   site/scripts/push-translations-payload.mjs — Payload write-back
#   eval/check-i18n-coverage.mjs      — i18n health check
#
# Frequency: every 4 hours is safe. The check skips quickly if all
# translations are current. A full heal cycle takes ~1-2 minutes per
# collection (API rate limits on the translation provider).
