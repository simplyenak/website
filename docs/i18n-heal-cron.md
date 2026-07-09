# Cron job for server Hermes: i18n self-healing pipeline
#
# Deploy on the server:
#   docker exec <hermes-container-id> hermes cron create "0 */4 * * *" \
#     --name i18n-heal --script heal-i18n --no-agent --deliver local
#
# The --no-agent mode runs the bash script directly and delivers its
# stdout verbatim — no LLM tokens consumed for orchestration.
#
# Environment variables (add to Docker service):
#   OMNIROUTE_API_KEY       — Omniroute AI gateway API key (for translations)
#   TRANSLATE_PROVIDER      — set to "omniroute" (default in heal-i18n.sh)
#   PAYLOAD_TOKEN           — Payload CMS API token (for write-back)
#   PAYLOAD_URL             — https://cms.system.simplyenak.com
#
# Alternatively, for Gemini-based translation:
#   GEMINI_API_KEY          — free key from https://aistudio.google.com/apikey
#
# Files (under ~/website-optimization/):
#   scripts/heal-i18n.sh              — orchestrator
#   site/scripts/translate-content.mjs — LLM translation engine
#   site/scripts/push-translations-payload.mjs — Payload write-back
#   eval/check-i18n-coverage.mjs      — i18n health check
#
# Frequency: every 4 hours is safe. The check skips quickly if all
# translations are current. A full heal cycle runs in ~2-5 minutes.
