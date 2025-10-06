# AI API Pricing Comparison (2025)

## Standard Pricing Per Million Tokens

| Provider | Model | Input Tokens | Output Tokens | Notes |
|----------|-------|--------------|---------------|-------|
| **DeepSeek** | V3.2-Exp | $0.028 (cache hit)<br>$0.28 (cache miss) | $0.42 | 128K context window<br>50%+ cheaper than V3.1 |
| **Zhipu AI (GLM)** | GLM-4.6 | ~$0.40* | ~$0.40* | 200K context window<br>$3/month coding plan available |
| **Anthropic** | Claude Sonnet 4.5 | $3.00 | $15.00 | Current flagship model |
| **Anthropic** | Claude Opus 4.1 | $15.00 | $75.00 | Most capable model |
| **OpenAI** | GPT-4o | $3.00 | $10.00 | 83% price drop from original |
| **OpenAI** | GPT-4o Mini | $0.15 | $0.60 | Budget-friendly option |
| **OpenAI** | GPT-4 (Original) | $10.00 | $30.00 | Legacy pricing |

*GLM-4.6 exact per-token pricing not publicly listed; estimated based on $3/month subscription model

## Cost Comparison Highlights

### Cheapest Options (Ranked by Total Cost)
1. **DeepSeek V3.2-Exp (Cache Hit)**: $0.028 input + $0.42 output = **$0.448 per 1M tokens total**
2. **OpenAI GPT-4o Mini**: $0.15 input + $0.60 output = **$0.75 per 1M tokens total**
3. **DeepSeek V3.2-Exp (Cache Miss)**: $0.28 input + $0.42 output = **$0.70 per 1M tokens total**
4. **GLM-4.6**: ~$0.40 input + ~$0.40 output = **~$0.80 per 1M tokens total** (or $3/month unlimited*)

### Mid-Range Options
- **OpenAI GPT-4o**: $3.00 input + $10.00 output = **$13.00 per 1M tokens total**
- **Claude Sonnet 4.5**: $3.00 input + $15.00 output = **$18.00 per 1M tokens total**

### Premium Options
- **Claude Opus 4.1**: $15.00 input + $75.00 output = **$90.00 per 1M tokens total**
- **OpenAI GPT-4 (Original)**: $10.00 input + $30.00 output = **$40.00 per 1M tokens total**

## Cost-Saving Features

### DeepSeek
- **Cache Hit Pricing**: 90% discount on cached input ($0.028 vs $0.28)
- **Sparse Attention**: Built-in efficiency reduces computational costs
- **Open Source**: Available under MIT license for self-hosting

### Claude (Anthropic)
- **Prompt Caching**: Up to 90% cost savings on repeated prompts
- **Batch API**: 50% discount on both input/output tokens
- **Regional Endpoints**: 10% premium for regional processing

### OpenAI
- **Batch API**: 50% discount for asynchronous processing
- **Recent Price Cuts**: 83-90% reduction on GPT-4o pricing

### GLM (Zhipu AI)
- **GLM Coding Plan**: $3/month subscription (claimed to be 1/7th the cost of Claude with 3x usage)
- **30% Token Efficiency**: More efficient than GLM-4.5

## Context Window Comparison

| Model | Context Window | Long Context Pricing |
|-------|---------------|---------------------|
| DeepSeek V3.2-Exp | 128K tokens | Same pricing |
| GLM-4.6 | 200K tokens | Same pricing |
| Claude Sonnet 4.5 | 1M tokens (200K standard) | Premium for >200K |
| Claude Opus 4.1 | 1M tokens (200K standard) | Premium for >200K |
| GPT-4o | 128K tokens | Same pricing |
| GPT-4o Mini | 128K tokens | Same pricing |

## Use Case Recommendations

### Best for Budget Projects
- **DeepSeek V3.2-Exp** - Extreme low cost with caching
- **GPT-4o Mini** - Good balance of cost and performance
- **GLM-4.6** - Fixed $3/month for coding tasks

### Best for Production Applications
- **Claude Sonnet 4.5** - Strong performance, good caching options
- **GPT-4o** - Competitive pricing, reliable performance

### Best for Complex/Critical Tasks
- **Claude Opus 4.1** - Highest capability, worth premium cost
- **GPT-4o** - Strong performance at lower cost than Opus

### Best for Long Context
- **GLM-4.6** - 200K context at competitive pricing
- **Claude Sonnet 4.5** - Up to 1M context (with premium)

### Best for Coding
- **GLM-4.6** - Specifically optimized, $3/month plan
- **Claude Sonnet 4.5** - Strong coding capabilities
- **DeepSeek V3.2-Exp** - Extremely low cost

## Important Notes

1. **Caching is Critical**: DeepSeek and Claude offer massive savings (up to 90%) with proper cache utilization
2. **Batch Processing**: Both OpenAI and Claude offer 50% discounts for async/batch processing
3. **Subscription vs Pay-per-Use**: GLM's $3/month coding plan may be better value than pay-per-token for heavy users
4. **Regional Pricing**: Claude charges 10% premium for regional endpoints
5. **Additional Costs**: Some providers charge extra for features like web search or code execution
6. **Pricing Changes**: AI pricing is highly dynamic - always verify current rates before committing

## Last Updated
January 2025

## Sources
- DeepSeek API Documentation
- Anthropic Pricing Page
- OpenAI Pricing Documentation
- Zhipu AI (Z.ai) Documentation
- Various tech news sources (VentureBeat, TechCrunch, MarkTechPost)
