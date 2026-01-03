# 🔒 Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by emailing:

**Email:** amartubic1@gmail.com

Please do **NOT** create a public GitHub issue for security vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices

### Environment Variables

**⚠️ NEVER commit `.env` files to version control!**

This project uses environment variables for sensitive configuration. Always use the provided `.env.example` files as templates:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# NLP Service
cp NLP/.env.example NLP/.env
```

### API Keys & Secrets

- **Database URLs**: Contains sensitive connection strings with credentials
- **API Keys**: GitHub, Mistral AI, OpenAI, Twilio, Mailjet, Pinecone
- **Admin Credentials**: Change default admin password in production

### Production Deployment

1. **Rotate all API keys** before deploying to production
2. **Use environment-specific secrets** (development vs production)
3. **Enable HTTPS** for all endpoints
4. **Implement rate limiting** on API endpoints
5. **Review CORS settings** in production

### Database Security

- Uses **Prisma Accelerate** for secure database connections
- Connection pooling and query optimization
- Never expose raw database credentials

### Known Security Considerations

1. **Admin credentials** are hardcoded in development - **MUST** be changed in production
2. **CORS** is currently permissive for development - restrict origins in production
3. **JWT/Auth** implementation is basic - consider implementing OAuth2.0 for production

## Security Checklist for Production

- [ ] Rotate all API keys and secrets
- [ ] Change default admin password
- [ ] Configure strict CORS policy
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Review and test authentication flows
- [ ] Implement HTTPS everywhere
- [ ] Set up automated security scanning
- [ ] Configure secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Review and update dependencies regularly

## Third-Party Services

This project uses the following third-party services:

- **Prisma Accelerate** - Database connection pooling
- **Vercel** - Backend & frontend hosting
- **GitHub Models API** - AI model access (Mistral)
- **Mailjet** - Email service
- **Twilio** - SMS/notification service
- **Pinecone** - Vector database (optional)

Ensure you have proper API keys and follow each service's security guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
