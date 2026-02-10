# AWS Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                                 │
│                                                                  │
│   ┌─────────────┐     ┌─────────────────────┐                  │
│   │   S3 Bucket │     │   CloudFront         │                  │
│   │  (Static)   │────▶│   Distribution       │                  │
│   └─────────────┘     └─────────────────────┘                  │
│                            │                                     │
│                            ▼                                     │
│                     ┌──────────────┐                             │
│                     │   ALB/NGINX  │                             │
│                     └──────────────┘                             │
│                            │                                     │
│         ┌──────────────────┴──────────────────┐                  │
│         ▼                                       ▼                  │
│   ┌─────────────┐                        ┌─────────────┐          │
│   │ ECS Fargate │                        │   MongoDB    │          │
│   │   (Client)  │                        │    Atlas     │          │
│   └─────────────┘                        └─────────────┘          │
│         │                                                       │
│         ▼                                                       │
│   ┌─────────────┐                                               │
│   │ ECS Fargate │                                               │
│   │   (Server)  │                                               │
│   └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- AWS CLI configured
- Docker & Docker Compose
- MongoDB Atlas account (or EC2 with MongoDB)

## Quick Start

### 1. Build and Test Locally

```bash
# Build production images
docker-compose -f docker-compose.production.yml build

# Run locally
docker-compose -f docker-compose.production.yml up -d

# Test
curl http://localhost
```

### 2. Configure Environment Variables

```bash
# Copy and edit environment files
cp .env.production .env.production.local
# Edit .env.production.local with your values

cp server/.env.production server/.env.production.local
# Edit server/.env.production.local

cp client/.env.production client/.env.production.local
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string

### 3. Deploy to AWS ECS

#### Option A: Using the deploy script

```bash
chmod +x deploy.sh
./deploy.sh production v1.0
```

#### Option B: Manual deployment

```bash
# Build and push to ECR
export AWS_REGION=eu-central-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Login to ECR
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build, tag, push
docker-compose -f docker-compose.production.yml build
docker tag ai-mcp-client:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-client:latest
docker tag ai-mcp-server:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-server:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-client:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/ai-mcp-server:latest

# Update ECS service
aws ecs update-service --cluster ai-mcp-cluster --service ai-mcp-service --region ${AWS_REGION} --force-new-deployment
```

## AWS Infrastructure Setup

### Using CloudFormation Template

```bash
aws cloudformation deploy \
    --template-file aws/cloudformation.yaml \
    --stack-name ai-mcp-infra \
    --parameter-overrides \
        Environment=production \
        VpcId=vpc-xxx \
        SubnetIds=subnet-xxx,subnet-yyy \
    --capabilities CAPABILITY_NAMED_IAM
```

### Manual Setup

1. **Create ECR Repositories**
   - ai-mcp-client
   - ai-mcp-server

2. **Create ECS Cluster**
   - Cluster type: Fargate

3. **Create Task Definitions**
   - ai-mcp-client-task
   - ai-mcp-server-task

4. **Create Services**
   - Target groups for each service
   - Security groups (allow ports 80, 4000)

5. **Setup ALB (Optional)**
   - Create Application Load Balancer
   - Configure path-based routing

6. **S3 + CloudFront (Optional for static hosting)**
   - Create S3 bucket (public access disabled)
   - Enable static website hosting
   - Create CloudFront distribution
   - Set origin to ALB or ECS service

## Environment Variables

### Server (.env.production)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 4000) | No |
| `NODE_ENV` | Environment (production) | No |

### Client (.env.production)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | API base URL | Yes |

## Monitoring & Logs

```bash
# View CloudWatch logs
aws logs tail /ecs/ai-mcp-server --follow
aws logs tail /ecs/ai-mcp-client --follow

# Check ECS service status
aws ecs describe-services --cluster ai-mcp-cluster --service ai-mcp-service
```

## Rollback

```bash
# Rollback to previous task definition
aws ecs update-service \
    --cluster ai-mcp-cluster \
    --service ai-mcp-service \
    --task-definition ai-mcp-server:previous_version
```

## Security Considerations

- ✅ Use MongoDB Atlas with VPC peering
- ✅ Enable HTTPS via CloudFront/ALB
- ✅ Configure security groups properly
- ✅ Use AWS Secrets Manager for sensitive data
- ✅ Enable CloudWatch logging
- ✅ Set up auto-scaling
