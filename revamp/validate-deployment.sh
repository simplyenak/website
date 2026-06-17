#!/bin/bash

# Deployment Validation Script for Simply Enak
# Prevents accidental staging deployments to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Simply Enak - Deployment Validation"
echo "======================================"
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if deploying to production
if [[ "$1" == "production" ]] || [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo ""
    echo "${YELLOW}⚠️  PRODUCTION DEPLOYMENT DETECTED${NC}"
    echo ""

    # Validation checks
    FAILED_CHECKS=0

    # Check 1: Ensure we're on main branch
    if [[ "$CURRENT_BRANCH" != "main" ]]; then
        echo "${RED}❌ ERROR: Production must be deployed from 'main' branch${NC}"
        echo "   Current branch: $CURRENT_BRANCH"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    else
        echo "${GREEN}✓ Branch check passed (on main)${NC}"
    fi

    # Check 2: Ensure no uncommitted changes (ignoring untracked files)
    if [[ -n $(git status --porcelain | grep -v "??") ]]; then
        echo "${RED}❌ ERROR: Uncommitted changes detected${NC}"
        echo "   Please commit or stash your changes first"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    else
        echo "${GREEN}✓ Working directory clean${NC}"
    fi

    # Check 3: Check for staging-related commits in recent history
    RECENT_COMMITS=$(git log --oneline -5)
    if echo "$RECENT_COMMITS" | grep -iE "staging|wip|test|temp|hero redesign|black hero"; then
        echo "${YELLOW}⚠️  WARNING: Recent commits mention staging/test work:${NC}"
        echo "$RECENT_COMMITS" | grep -iE "staging|wip|test|temp|hero|redesign" || true
        echo ""
        echo "${YELLOW}   Are you sure this should go to production?${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    else
        echo "${GREEN}✓ No obvious staging commits in recent history${NC}"
    fi

    # Check 4: Verify hero section content
    HERO_FILE="frontend/src/components/Home/HeroSection.astro"
    if [ -f "$HERO_FILE" ]; then
        if grep -q "Food Tours that Reveal\|black hero\|hero redesign\|highlight-text" "$HERO_FILE"; then
            echo "${RED}❌ ERROR: Hero section appears to contain staging redesign${NC}"
            echo "   File: $HERO_FILE"
            echo "   Contains redesign keywords that shouldn't be in production"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
        else
            echo "${GREEN}✓ Hero section looks clean${NC}"
        fi
    fi

    # Check 5: Ensure package.json has production dependencies
    if [ -f "frontend/package.json" ]; then
        echo "${GREEN}✓ Package.json exists${NC}"
    else
        echo "${RED}❌ ERROR: frontend/package.json not found${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi

    echo ""
    echo "======================================"

    # Summary
    if [ $FAILED_CHECKS -gt 0 ]; then
        echo "${RED}❌ DEPLOYMENT BLOCKED: $FAILED_CHECKS validation check(s) failed${NC}"
        echo ""
        echo "Please fix the issues above before deploying to production."
        exit 1
    else
        echo "${GREEN}✅ All validation checks passed${NC}"
        echo ""
        echo "${YELLOW}🚀 Ready to deploy to production${NC}"
        echo ""

        # Final confirmation for production
        read -p "Type 'DEPLOY' to confirm production deployment: " CONFIRMATION
        if [[ "$CONFIRMATION" != "DEPLOY" ]]; then
            echo "${RED}Deployment cancelled${NC}"
            exit 1
        fi

        echo ""
        echo "${GREEN}✅ Deployment confirmed. Proceeding...${NC}"
        exit 0
    fi
else
    # Staging deployment - less strict
    echo ""
    echo "${GREEN}📦 Staging deployment - proceeding${NC}"
    exit 0
fi
