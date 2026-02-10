#!/bin/bash

# AWS Deployment Script for AI-MCP Application
# Usage: ./deploy.sh <environment>

set -e

ENV=${1:-production}
TAG=${2:-latest}
AWS_REGION=${AWS_REGION:-eu-central-1}

echo "🚀 Deploying AI-MCP to AWS (${ENV})..."

# Build images
echo "📦 Building Docker images..."
docker-compose -f docker-compose.production.yml build --no-cache

# Tag images
echo "🏷️ Tagging images..."
docker tag ai-mcp-client:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-client:${TAG}
docker tag ai-mcp-server:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-server:${TAG}

# Push to ECR
echo "⬆️ Pushing to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-client:${TAG}
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-server:${TAG}

# Update ECS service
echo "🔄 Updating ECS service..."
aws ecs update-service \
    --cluster ai-mcp-cluster \
    --service ai-mcp-service \
    --region ${AWS_REGION} \
    --force-new-deployment

echo "✅ Deployment initiated successfully!"
echo "📊 Check ECS console for deployment status."
