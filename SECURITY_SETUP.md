# 🔐 Security Setup Guide

## ⚠️ IMPORTANT: Configuration Security

This project contains sensitive configuration data that must be handled securely.

## 🚨 Files to NEVER commit to Git:
- `appsettings.json` (contains real API keys)
- `appsettings.Production.json` (contains production secrets)
- `appsettings.Development.json` (contains development secrets)

## 📋 Setup Instructions

### 1. Development Environment
```bash
# Copy template and fill in your values
cp LmsBackend/appsettings.Development.json.template LmsBackend/appsettings.Development.json

# Edit the file with your actual values:
# - Database connection string
# - JWT secret key (generate a strong one)
# - Cloudinary credentials
# - MoMo test credentials
# - ZaloPay test credentials
```

### 2. Production Environment
```bash
# Copy template and fill in your values
cp LmsBackend/appsettings.Production.json.template LmsBackend/appsettings.Production.json

# Edit the file with your actual PRODUCTION values:
# - Production database connection
# - Strong JWT secret (different from dev)
# - Production Cloudinary account
# - Real MoMo production credentials
# - Real ZaloPay production credentials
```

## 🔑 Where to get API Keys

### MoMo Payment
1. Register at: https://business.momo.vn/
2. Get: PartnerCode, AccessKey, SecretKey
3. Test endpoint: `https://test-payment.momo.vn/v2/gateway/api/create`
4. Production endpoint: `https://payment.momo.vn/v2/gateway/api/create`

### ZaloPay
1. Register at: https://zalopay.vn/business
2. Get: AppId, Key1, Key2
3. Test endpoint: `https://sb-openapi.zalopay.vn/v2/create`
4. Production endpoint: `https://openapi.zalopay.vn/v2/create`

### Cloudinary
1. Register at: https://cloudinary.com/
2. Get: CloudName, ApiKey, ApiSecret

## 🛡️ Security Best Practices

1. **Never commit real API keys to Git**
2. **Use different keys for development and production**
3. **Rotate keys regularly**
4. **Use environment variables in production**
5. **Enable IP whitelisting where possible**

## 🚀 Deployment Security

For production deployment, consider using:
- Azure Key Vault
- AWS Secrets Manager
- Environment variables
- Docker secrets

## ❌ If you accidentally committed secrets:
1. Immediately rotate all exposed keys
2. Remove from Git history: `git filter-branch` or BFG Repo-Cleaner
3. Force push to overwrite history
4. Notify team members to re-clone repository
